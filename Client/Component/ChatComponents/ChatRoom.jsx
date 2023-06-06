
import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Alert, Modal, TouchableOpacity, ScrollView, Platform } from 'react-native'
import { GiftedChat, Bubble, Actions, InputToolbar, Time, MessageImage, LoadEarlier } from 'react-native-gifted-chat';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
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
  const [selectedPic, setSelectedPic] = useState(null); //to send image to firebase
  const [imageDescription, setImageDescription] = useState('')//to send image with description
  const [GroupMembers, setGroupMembers] = useState(); //for group chat
  const [recording, setRecording] = useState(null); // for audio recording

  useLayoutEffect(() => {
    const tempMessages = query(collection(db, route.params.name), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(tempMessages, (snapshot) => {
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
    if (route.params.type === "group") {
      console.log("group chat")
      const groupusers = query(collection(db, "GroupMembers"), where("Name", "==", route.params.name));
      getDocs(groupusers).then((querySnapshot) => {
        setGroupMembers(querySnapshot.docs.map(doc => doc.data().userEmail))
      });
    }
    // navigation.setOptions({
    //   headerTitle: route.params.UserName ? route.params.UserName : route.params.name,
    // })

    return () => { console.log("unsub"); unsubscribe() };

  }, [navigation]);

  useEffect(() => {
    console.log("group members", GroupMembers)
  }, [GroupMembers])

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


  useEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.UserName ? route.params.UserName : route.params.name,
    })
  }, [navigation]);

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

  //record audio
  // const recordAudio = async () => {
  //   const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
  //   if (status !== 'granted') return;
  //   const recording = new Audio.Recording();
  //   try {
  //     await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
  //     await recording.startAsync();
  //     setRecording(recording);
  //   } catch (error) {
  //     console.log(error);
  //     stopRecording();
  //   }
  // }

  // //handle audio recording
  // const onSendAudio = async (recording) => {
  //   //add new message to db
  //   const newMessage = {
  //     _id: Math.random().toString(36).substring(7),
  //     createdAt: new Date(),
  //     user: {
  //       _id: auth.currentUser.email,
  //       name: auth.currentUser.displayName,
  //       avatar: auth.currentUser.photoURL
  //     },
  //     audio: recording,
  //   }
  //   setMessages(previousMessages => GiftedChat.append(previousMessages, [newMessage]));
  //   const { _id, createdAt, user, audio } = newMessage
  //   addDoc(collection(db, route.params.name), { _id, createdAt, user, audio });
  //   console.log("new message added to db")
  //   //update last message and last message time in db
  //   const docRef = query(collection(db, auth.currentUser.email), where("Name", "==", route.params.name));
  //   const res = getDocs(docRef);
  //   res.then((querySnapshot) => {
  //     querySnapshot.forEach((doc) => {
  //       updateDoc(doc.ref, { lastMessage: "audio", lastMessageTime: createdAt });
  //     });
  //   });
  //   if (GroupMembers) {
  //     GroupMembers.forEach(arr => {
  //       arr.forEach(user => {
  //         console.log("usera", user)
  //         if (user !== auth.currentUser.email) {
  //           const docRef = query(collection(db, user), where("Name", "==", route.params.name));
  //           const res = getDocs(docRef);
  //           console.log("res", res)
  //           res.then((querySnapshot) => {
  //             querySnapshot.forEach((doc) => {
  //               updateDoc(doc.ref, { unread: false, unreadCount: querySnapshot.docs[0].data().unreadCount + 1, lastMessage: "audio", lastMessageTime: createdAt });
  //               console.log("updated")
  //             });
  //           });
  //         }
  //       }
  //       )
  //     });
  //   }
  //   else if (route.params.userEmail) {
  //     const docRef = query(collection(db, route.params.userEmail), where("Name", "==", route.params.name));
  //     const res = getDocs(docRef);
  //     res.then((querySnapshot) => {
  //       querySnapshot.forEach((doc) => {
  //         updateDoc(doc.ref, { unread: false, unreadCount: querySnapshot.docs[0].data().unreadCount + 1, lastMessage: "audio", lastMessageTime: createdAt });
  //       });
  //     });
  //   }
  // }

  //send image to firebase
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
    //update last message and last message time in db
    const docRef = query(collection(db, auth.currentUser.email), where("Name", "==", route.params.name));
    const res = getDocs(docRef);
    res.then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        updateDoc(doc.ref, { lastMessage: text || "image", lastMessageTime: createdAt });
        console.log("updated for user")
      });
    });
    if (GroupMembers) {
      console.log("GroupMembers", GroupMembers)
      GroupMembers.forEach(arr => {
        arr.forEach(user => {
          console.log("useraa", user)
          if (user !== auth.currentUser.email) {
            const docRef = query(collection(db, user), where("Name", "==", route.params.name));
            const res = getDocs(docRef);
            console.log("res", res)
            res.then((querySnapshot) => {
              if(!querySnapshot.empty){

              querySnapshot.forEach((doc) => {
                updateDoc(doc.ref, { unread: false, unreadCount: querySnapshot.docs[0].data().unreadCount + 1, lastMessage: text || "image", lastMessageTime: createdAt });
                console.log("updated")
              })}
              else {
                addDoc(collection(db, user), { Name: route.params.name,UserName: "",userEmail: "",image: auth.currentUser.photoURL, unread: true, unreadCount: 1, lastMessage: text, lastMessageTime: createdAt, type: "group" });
                console.log("added")
              }
                ;
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
          updateDoc(doc.ref, { unread: false, unreadCount: querySnapshot.docs[0].data().unreadCount + 1, lastMessage: text || "image", lastMessageTime: createdAt });
        });
      });
    }
  }

  const onSend = useCallback((messages = [], GroupMembers) => {
    console.log("group members", GroupMembers)
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
    console.log("GroupMembers", GroupMembers)
      GroupMembers.forEach(arr => {
        arr.forEach(user => {
          if (user !== auth.currentUser.email) {
            console.log("user", user)
            const docRef = query(collection(db, user), where("Name", "==", route.params.name));
            const res = getDocs(docRef);
            console.log("res", res)
            res.then((querySnapshot) => {
              // if user has no documentation in db of chat
              if(!querySnapshot.empty){
              querySnapshot.forEach((doc) => {
                updateDoc(doc.ref, { unread: false, unreadCount: querySnapshot.docs[0].data().unreadCount + 1, lastMessage: text || "image", lastMessageTime: createdAt });
                console.log("updated")
              })
            }
            // if user has documentation in db of chat
            else {
              addDoc(collection(db, user), { Name: route.params.name,UserName: "",userEmail: "",image: auth.currentUser.photoURL, unread: true, unreadCount: 1, lastMessage: text, lastMessageTime: createdAt, type: "group" });
              console.log("added")
            }
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

  useEffect(() => {
    console.log("group members", GroupMembers)
  }, [GroupMembers])


  return (
    <>
      <GiftedChat
        wrapInSafeArea={false}
        //bottomOffset={Platform.OS === 'ios' ? 50 : 0} this in case canceling tab bar wont work
        messages={messages}
        showAvatarForEveryMessage={true}
        onSend={messages => onSend(messages, GroupMembers)}
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
          if (user._id !== auth.currentUser.email) {
            navigation.navigate('ChatProfile', { user: user });
          }
          else {
            console.log("user is me")
          }
        }
        }
        renderActions={(props) => {
          return (<>
            <Actions {...props}
              containerStyle={{
                width: 34,
                height: 44,
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 6,
                marginRight: 4,
                marginBottom: 0,
              }}
              icon={() => (
                <Ionicons name="camera" size={28} color="#548DFF" />
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
            {/* <Actions {...props}
              containerStyle={{
                width: 34,
                height: 44,
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 4,
                marginRight: 4,
                marginBottom: 0,
              }}
              icon={() => (
                <FontAwesome name="microphone" size={28} color="#548DFF" />
              )}
              onPressActionButton={() => { console.log("audio") }}
            /> */}

          </>
          )
        }
        }
        renderInputToolbar={(props) => {
          return (
            <InputToolbar {...props}
              containerStyle={{
              }}
              primaryStyle={{ alignItems: 'center', justifyContent: 'center' }}  //for the text input
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
                backgroundColor: '#fff',
                swipeToDismiss: true,
                springConfig: { tension: 30, friction: 7 },
                renderHeader: (close) => (
                  <View style={styles.lightboxHeader}>
                    <TouchableOpacity onPress={close}>
                      <Ionicons name='close' size={30} color='000' />
                    </TouchableOpacity>
                  </View>
                ),
                renderContent: () => (
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                      source={{ uri: props.currentMessage.image }}
                      style={{ width: ScreenWidth * 0.95, height: ScreenHeight * 0.85, resizeMode: 'contain', }}
                    />
                    <Text style={{ color: 'red' }} >{props.currentMessage.text}</Text>
                  </View>
                ),
              }}
            />
          );
        }}
        // loadEarlier={true}
        // renderLoadEarlier={(props) => {
        //   return (
        //     <LoadEarlier {...props}
        //       wrapperStyle={{
        //         alignItems: 'center',
        //         justifyContent: 'center',
        //         height: 44,
        //         width: ScreenWidth,
        //       }}
        //       textStyle={{
        //         fontFamily: "Urbanist-Regular",
        //         fontSize: 14,
        //         color: "#000",
        //       }}
        //       label="Load Earlier Messages"
        //       activityIndicatorColor="#548DFF"
        //       activityIndicatorStyle={{
        //         marginTop: 5,
        //         marginBottom: 5,

        //       }}
        //       text="Load Earlier Messages"
        //       />
        //   )
        // }
        // }
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
            <Ionicons name='send' size={30} color='#fff' onPress={() => { setPicPreviewModal(false); sendToFirebase(selectedPic) }} />
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
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  //for image preview modal 
  imagePreview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000'
  },
  image: {
    width: ScreenWidth * 1,
    height: ScreenHeight * 1,
    borderRadius: 10,
    resizeMode: 'contain'
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
    width: ScreenWidth * 0.8,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    fontFamily: 'Urbanist-Regular',
    fontSize: 16,
    marginVertical: 10
  },
})