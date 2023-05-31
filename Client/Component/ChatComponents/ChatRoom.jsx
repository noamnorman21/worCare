import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Alert, Modal, TouchableOpacity, ScrollView, Platform } from 'react-native'
import { GiftedChat, Bubble, Actions, InputToolbar, Time, MessageImage } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { collection, query, where, getDocs, addDoc, updateDoc, orderBy, onSnapshot } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import { db, auth, storage } from '../../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { TextInput } from 'react-native-paper';
import moment from 'moment';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const ScreenHeight = Dimensions.get("window").height;
const ScreenWidth = Dimensions.get("window").width;

export default function ChatRoom({ route, navigation }) {
  const [messages, setMessages] = useState([]);
  const [picPreviewModal, setPicPreviewModal] = useState(false);
  const [selectedPic, setSelectedPic] = useState(null);
  const [imageDescription, setImageDescription] = useState('')
  const [GroupMembers, setGroupMembers] = useState(); //for group chat

  useLayoutEffect(() => {
    const tempMessages = query(collection(db, route.params.name), orderBy('createdAt', 'desc'));
    getDocs(tempMessages).then((querySnapshot) => {
      onSnapshot(tempMessages, (snapshot) => {
        setMessages(
          snapshot.docs.map(doc => ({
            _id: doc.data()._id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            user: doc.data().user,
            image: doc.data().image
          }))
        )
      });
    });

    if (route.params.type === "group") {
      const groupusers = query(collection(db, "GroupMembers"), where("Name", "==", route.params.name));
      getDocs(groupusers).then((querySnapshot) => {
       setGroupMembers(querySnapshot.docs.map(doc => doc.data().UserEmail))
      });
    }
    navigation.setOptions({
      headerTitle: route.params.UserName ? route.params.UserName : route.params.name,
    })

  }, [navigation]);

  // useEffect(async () => {
  //   console.log("type", route.params.type)
  //   const getUsers = async () => {
  //     if (route.params.type === "group") {
  //       const groupusers = query(collection(db, "GroupMembers"), where("Name", "==", route.params.name));
  //       let users = await getDocs(groupusers);
  //       if (users.docs.length > 0) {
  //         console.log("users", users.docs[0].data().UserEmail)
  //       }
  //     }
  //   }
  // }, []);

  useEffect(() => {
    console.log("type", route.params.type)
    console.log("Group Members",GroupMembers)
  }, [GroupMembers]);

  useFocusEffect( //update convo in db that user has read the messages when leaving page
    useCallback(() => {
      const setDocAsRead = async () => {
        console.log("set doc as read")
        const docRef = query(collection(db, auth.currentUser.email), where("Name", "==", route.params.name));
        const res = await getDocs(docRef);
        res.forEach((doc) => {
          updateDoc(doc.ref, { unread: false, unreadCount: 0 });
        });
      }
      return () => {
        setDocAsRead();
      }
    }, [])
  );

  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("You've refused to allow this appp to access your camera!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync(
      {
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 0.1,
      }
    );
    // Explore the result
    if (!result.canceled) {
      setPicPreviewModal(true); 
      console.log("result.uri", result.assets[0].uri)
      setSelectedPic(result.assets[0].uri);
    }
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.1,
    });
    // Explore the result
    if (!result.canceled) {
      setPicPreviewModal(true); 
      console.log("result.uri", result.assets[0].uri)
      setSelectedPic(result.assets[0].uri);
           
      // sendToFirebase(result.assets[0].uri);     
    }
  };

  const sendToFirebase = async (image) => {
    // if the user didn't upload an image, we will use the default image
    const filename = image.substring(image.lastIndexOf('/') + 1);
    const storageRef = ref(storage, "chatImages/" + filename);
    const blob = await fetch(image).then(response => response.blob());
    try {
      const uploadTask = uploadBytesResumable(storageRef, blob);
      uploadTask.on('state_changed',
        snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% complete`);
        },
        error => {
          console.error(error);
          Alert.alert('Upload Error', 'Sorry, there was an error uploading your image. Please try again later.');
        },
        () => {
          getDownloadURL(storageRef).then(downloadURL => {
            console.log('File available at', downloadURL);
            onSendImage(downloadURL);
          });
        }
      );
    }
    catch (error) {
      console.error(error);
      Alert.alert('Upload Error', 'Sorry, there was an error uploading your image. Please try again later.');
    }
  };

  const onSendImage = async (downloadUrl) => {
    //add new message to db
    const newMessage = {
      _id: Math.random().toString(36).substring(7),
      createdAt: new Date(),
      user: {
        _id: auth.currentUser.email,
        name: auth.currentUser.displayName,
        avatar: auth.currentUser.photoURL
      },
      image: downloadUrl,
      text: imageDescription
    }
    setMessages(previousMessages => GiftedChat.append(previousMessages, [newMessage]));
    const { _id, createdAt, text, user, image } = newMessage
    addDoc(collection(db, route.params.name), { _id, createdAt, text, user, image });
    console.log("new message added to db")
    setPicPreviewModal(false);
    setImageDescription('');
    //update last message and last message time in db
    const docRef = query(collection(db, auth.currentUser.email), where("Name", "==", route.params.name));
    const res = getDocs(docRef);
    res.then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        updateDoc(doc.ref, { lastMessage: text||"image", lastMessageTime: createdAt });
      });
    });
    if (GroupMembers){
      GroupMembers.forEach(arr => {
        arr.forEach(user => {
          return console.log("user", user)
          if (user !== auth.currentUser.email) {
            const docRef = query(collection(db, user), where("Name", "==", route.params.name));
            const res = getDocs(docRef);
            res.then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                updateDoc(doc.ref, { unread: false, unreadCount: querySnapshot.docs[0].data().unreadCount + 1, lastMessage: text||"image", lastMessageTime: createdAt });
              });
            });
          }
        }
        )
      });
    }
    else if (route.params.userEmail) {
      const docRef = query(collection(db, route.params.userEmail), where("Name", "==", route.params.name));
      const res = getDocs(docRef);
      res.then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          updateDoc(doc.ref, { unread: false, unreadCount: querySnapshot.docs[0].data().unreadCount + 1, lastMessage: text||"image", lastMessageTime: createdAt });
        });
      });
    }
  }





  const onSend = useCallback((messages = [], GroupMembers) => {
    const { _id, createdAt, text, user } = messages[0]
    addDoc(collection(db, route.params.name), { _id, createdAt, text, user });
    const docRef = query(collection(db, auth.currentUser.email), where("Name", "==", route.params.name));
    const res = getDocs(docRef);
    res.then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        updateDoc(doc.ref, { lastMessage: text, lastMessageTime: createdAt });
      });
    });
    if (GroupMembers) {
      GroupMembers.forEach(arr => {
        arr.forEach(user => {
          console.log("user", user)
          if (user !== auth.currentUser.email) {
            const docRef = query(collection(db, user), where("Name", "==", route.params.name));
            const res = getDocs(docRef);
            console.log("res", res)
            res.then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                updateDoc(doc.ref, { unread: false, unreadCount: querySnapshot.docs[0].data().unreadCount + 1, lastMessage: text, lastMessageTime: createdAt });
                console.log("updated")
              });
            });
          }
        }
        )
      });
    }
    else if (route.params.userEmail) {
      const docRef = query(collection(db, route.params.userEmail), where("Name", "==", route.params.name));
      const res = getDocs(docRef);
      res.then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          updateDoc(doc.ref, { unread: false, unreadCount: querySnapshot.docs[0].data().unreadCount + 1, lastMessage: text, lastMessageTime: createdAt });
        });
      });
    }
  }, []);

  return (
    <>
    <GiftedChat
      wrapInSafeArea={false}
      //bottomOffset={Platform.OS === 'ios' ? 50 : 0} this in case canceling tab bar wont work
      messages={messages}
      showAvatarForEveryMessage={true}
      onSend={messages => onSend(messages,GroupMembers)}
      user={{
        _id: auth?.currentUser?.email,
        name: auth?.currentUser?.displayName,
        avatar: auth?.currentUser?.photoURL
      }}
      isLoadingEarlier={true}
      showUserAvatar={true}
        renderBubble={(props) => {
          return (
            <Bubble {...props}
              wrapperStyle={{
                left: {
                  backgroundColor: "#D9D9D980",
                  borderColor: "#808080",
                  borderWidth: 1,
                  borderRadius: 15,
                },
                right: {
                  backgroundColor: "#7DA9FF",
                  borderColor: "#548DFF",
                  borderWidth: 1,
                  borderRadius: 15,
                }
              }}
              textStyle={{
                left: { fontFamily: "Urbanist-Regular" },
                right: { fontFamily: "Urbanist-Regular", color: "#fff" }
              }}
              renderTime={(props) => {
                if (props.currentMessage.image && !props.currentMessage.text) {
                  return (
                    <View style={{ position: 'absolute', bottom: 5, paddingRight: 10, paddingLeft: 10 }}>
                      <Text style={{ fontSize: 12, fontFamily: "Urbanist-Regular", color: '#fff' }}>{moment(props.currentMessage.createdAt).format('HH:MM')}</Text>
                    </View>
                  )
                }
                else {
                  return (
                    <Time {...props}
                      timeTextStyle={{
                        left: { fontFamily: "Urbanist-Regular", color: "#000", fontSize: 12 },
                        right: { fontFamily: "Urbanist-Regular", color: "#fff", fontSize: 12 },
                      }}
                      timeFormat='HH:mm'
                    />
                  )
                }
              }
              }

            />
          )
        }}
      onPressAvatar={(user) => {
        if(user._id !== auth.currentUser.email){
        navigation.navigate('ChatProfile', { user: user });
        }
        else{
          console.log("user is me")
        }
      }
      }
      renderActions={(props) => {
        return (
          <Actions {...props}
            containerStyle={{
              width: 44,
              height: 44,
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 4,
              marginRight: 4,
              marginBottom: 0,
            }}
            icon={() => (
              <Ionicons name="camera" size={28} color="#548DFF"/>
            )}
            options={{
              'Take Photo': () => {
                openCamera();
              },
              'Choose From Gallery': () => {
                pickImage();
              },
              Cancel: () => { },
            }}
            optionTintColor="#222B45"
          />
        )
      }
      }
      renderInputToolbar={(props) => {
        return (
          <InputToolbar {...props}
            containerStyle={{
            }}
            primaryStyle={{ alignItems: 'center', justifyContent:'center' }}  //for the text input
          />
        )
      }
      }

      imageStyle={{ width: 200, height: 200, borderRadius: 10 }}     
      renderMessageImage={(props) => {
        return (
          <MessageImage
            {...props}
            imageProps={{ resizeMode: 'contain' }}
            lightboxProps={{
              underlayColor: 'transparent',
              backgroundColor:'#fff',
              swipeToDismiss: true,
              springConfig: { tension: 30, friction: 7 },
              renderHeader: (close) => (
                <View style={styles.lightboxHeader}>
                  <TouchableOpacity onPress={close}>
                    <Ionicons name='close' size={30} color='000' />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { }}>
                    <Ionicons name='download' size={30} color='#fff' />
                  </TouchableOpacity>
                </View>
              ),
              renderContent: () => (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Image
                    source={{ uri: props.currentMessage.image }}
                    style={{ width: ScreenWidth*0.95, height: ScreenHeight*0.85, resizeMode: 'contain', }}
                  />
                  <Text style={{color:'red'}} >{props.currentMessage.text}</Text>
                </View>
              ),
            }}
          />
        );
      }}



      

/>
      <Modal visible={picPreviewModal} animationType='slide' onRequestClose={() => setPicPreviewModal(false)} >
        <View style={styles.imagePreview}>
          <View>
          <Image source={{ uri: selectedPic }} style={styles.image} />
          </View>
          <View style={styles.inputAndSend}>
            <TextInput style={styles.modalInput}
                mode='outlined'
                onChangeText={(text) => setImageDescription(text)} 
                placeholder="Add a caption...(optional)"
                outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
                contentStyle={{ fontFamily: 'Urbanist-Medium' }}
                activeOutlineColor="#548DFF"
                outlineColor='#E6EBF2' />
            <Ionicons name='send' size={30} color='#fff'  onPress={() => { setPicPreviewModal(false); sendToFirebase(selectedPic) }}/>
          </View>
        </View>
      </Modal>
</>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  conName: {
    fontSize: 20,
    fontFamily: 'Urbanist-SemiBold',
    marginBottom: 5,
  },
  conCard: {
    width: ScreenWidth * 0.9,
    height: ScreenHeight * 0.1,
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  conMiddle: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 10,
    width: ScreenWidth * 0.6,
    flex: 9,
  },
  conRight: {
    flex: 4,
    flexDirection: 'column',
    alignItems: 'flex-end',
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
    height: ScreenHeight * 0.1,
  },
  conTime: {
    fontSize: 12,
    fontFamily: 'Urbanist-Regular',
    color: "#808080"
  },
  conDate: {
    fontSize: 12,
    fontFamily: 'Urbanist-Regular',
    color: "#808080"
  },
  lineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: ScreenWidth * 0.9,
    alignSelf: 'center',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#80808080',
    marginVertical: 5,
  },
  conLeft: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  top: {
    width: ScreenWidth * 0.9,
    height: ScreenHeight * 0.1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 24,
    fontFamily: 'Urbanist-Bold',
    color: '#000',
    marginLeft: 10,
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalText: {
    fontSize: 24,
    fontFamily: 'Urbanist-Bold',
    color: '#000',
    marginBottom: 20,
  },
  modalButton: {
    width: ScreenWidth * 0.8,
    height: ScreenHeight * 0.07,
    backgroundColor: '#000',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  modalButtonText: {
    fontSize: 24,
    fontFamily: 'Urbanist-Bold',
    color: '#fff',
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Urbanist-SemiBold',
    marginBottom: 5,
    color: '#000',
  },
  userCard: {
    width: ScreenWidth * 0.9,
    height: ScreenHeight * 0.13,
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  unread: {
    borderRadius: 54,
    borderColor: '#000',
    width: 20,
    height: 20,
    padding: 3,
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#548DFF',
    marginBottom: 5,
  },
  unreadTxt: {
    fontSize: 10,
    fontFamily: 'Urbanist-Bold',
    color: '#fff',
  },
  conLastMessage: {
    fontSize: 16,
    fontFamily: 'Urbanist-Regular',
    color: '#808080',
  },
  sendButton: {
    borderRadius: 25,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  convoImage: {
    width: 55,
    height: 55,
    borderRadius: 54
  },
  //for image preview modal 
  imagePreview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000'
  },
  image: {
    width: ScreenWidth*1,
    height: ScreenHeight*1,
    borderRadius: 10 ,
    resizeMode:'contain'
  },
  inputAndSend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: ScreenWidth,
    padding: 10,
  },
  lightboxHeader: {
    width: ScreenWidth, 
    height: 50, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 10 
},
modalInput: {
   width:ScreenWidth*0.8, 
   backgroundColor: '#fff', 
   borderRadius: 10, 
   padding: 10, 
   fontFamily: 'Urbanist-Regular', 
   fontSize: 16, 
   marginVertical: 10 
},
})