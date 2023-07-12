import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Alert, Modal, TouchableOpacity, ScrollView, Platform, SafeAreaView, KeyboardAvoidingView } from 'react-native'
import { GiftedChat, Bubble, Actions, InputToolbar, Time, MessageImage, LoadEarlier, Composer, Send, MessageText } from 'react-native-gifted-chat';
import { Ionicons, FontAwesome, Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { collection, query, where, getDocs, addDoc, updateDoc, orderBy, onSnapshot } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import { db, auth, storage } from '../../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { TextInput } from 'react-native-paper';
import moment from 'moment';
import { Audio } from 'expo-av';
import axios from 'axios';

import { useUserContext } from '../../UserContext';
import ChatProfile from './ChatProfile';

const ScreenHeight = Dimensions.get("window").height;
const ScreenWidth = Dimensions.get("window").width;

export default function ChatRoom({ route, navigation }) {
  const [messages, setMessages] = useState([]);
  const [picPreviewModal, setPicPreviewModal] = useState(false);
  const [selectedPic, setSelectedPic] = useState(null); //to send image to firebase
  const [imageDescription, setImageDescription] = useState('')//to send image with description
  const [GroupMembers, setGroupMembers] = useState(); //for group chat
  const { newMessages, setNewMessages, sendPushNotification } = useUserContext();
  const [userToken2, setUserToken2] = useState(''); //for push notification- temporary- will start as ''
  const [userLanguage, setUserLanguage] = useState(''); //for push notification- temporary- will start as ''
  //profile modal
  const [userModal, setUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [recording, setRecording] = useState(null); // for audio recording
  const [audioPermission, setAudioPermission] = useState(false); // for audio recording
  const [recordingStatus, setRecordingStatus] = useState('not recording'); // for audio recording

  // get messages from firebase
  useLayoutEffect(() => {
    const tempMessages = query(collection(db, route.params.name), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(tempMessages, (snapshot) => {
      setMessages(
        snapshot.docs.map(doc => ({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
          image: doc.data().image,
          translatedText: doc.data().translatedText,
        }))
      )
    });
    // get group members if group chat
    if (route.params.type === "group") {
      const groupusers = query(collection(db, "GroupMembers"), where("Name", "==", route.params.name));
      getDocs(groupusers).then((querySnapshot) => {
        setGroupMembers(querySnapshot.docs.map(doc => doc.data().userEmail))
      });
    }
    navigation.setOptions({
      headerTitle: route.params.UserName ? route.params.UserName : route.params.name,
      headerLeft: () => (
        <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#58" />
        </TouchableOpacity>
      ),
    })
    if (route.params.type === "private") {
      getUserToken();
    }
    return () => { console.log("unsub"); unsubscribe() };
  }, [navigation]);

  useEffect(() => {
    console.log("userToken2", userToken2)
  }, [userToken2])

  //delete return when pubished
  const getUserToken = async () => {
    console.log("getUserToken")
    let user = {
      Email: route.params.userEmail
    }
    console.log("user", user)
    fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/User/GetUserToken', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
      }),
      body: JSON.stringify({
        Email: route.params.userEmail,
      })
    })
      .then(res => {
        return res.json()
      }
      )
      .then(
        (result) => {
          console.log("result", result)
          setUserToken2(result.pushToken)
          console.log(result.lagnuagecode)
          setUserLanguage(result.lagnuagecode)
          // sendPushNotification(result.Token, result.Name)
        }
      )
  }

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
      setNewMessages(newMessages - route.params.unreadCount)
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

  useEffect(() => {
    async function getAudioPermission() {
      await Audio.requestPermissionsAsync().then((premission) => {
        setAudioPermission(premission.granted)

      }).catch((error) => {
        console.log("error", error)
      })
    }
    getAudioPermission();
    return () => {
      if (recording) {
        stopRecording();
      }
    };

  }, []);

  async function startRecording() {
    try {
      // Set the audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
        playsInSilentModeIOS: true,
      });

      if (audioPermission) {
        await Audio.requestPermissionsAsync();
      }

      const newRecording = new Audio.Recording();
      console.log("Start recording");
      await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      await newRecording.startAsync();
      setRecording(newRecording);
      setRecordingStatus('recording');
    } catch (err) {
      console.log('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    try {
      if (recordingStatus === 'recording') {
        console.log("Stop recording")
        await recording.stopAndUnloadAsync();
        const recordingUri = recording.getURI();

        const fileName = `recording-${Date.now()}.caf`;
        await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'recordings/', { intermediates: true });
        await FileSystem.moveAsync({
          from: recordingUri,
          to: `${FileSystem.documentDirectory}recordings/${fileName}`,
        });

        const playbackObject = new Audio.Sound();
        await playbackObject.loadAsync({ uri: `${FileSystem.documentDirectory}recordings/${fileName}` });
        await playbackObject.playAsync();

        setRecording(null);
        setRecordingStatus('not recording');
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  async function handleRecordButtonPress() {
    if (recording) {
      const audioUri = await stopRecording(recording);
      if (audioUri) {
        console.log("audioUri", audioUri)
      }
    } else {
      await startRecording();
    }
  }

  //handle audio recording
  const onSendAudio = async (recording) => {
    //add new message to db
    const newMessage = {
      _id: Math.random().toString(36).substring(7),
      createdAt: new Date(),
      user: {
        _id: auth.currentUser.email,
        name: auth.currentUser.displayName,
        avatar: auth.currentUser.photoURL
      },
      audio: recording,
    }
    setMessages(previousMessages => GiftedChat.append(previousMessages, [newMessage]));
    const { _id, createdAt, user, audio } = newMessage
    addDoc(collection(db, route.params.name), { _id, createdAt, user, audio });
    console.log("new message added to db")
    //update last message and last message time in db
    const docRef = query(collection(db, auth.currentUser.email), where("Name", "==", route.params.name));
    const res = getDocs(docRef);
    res.then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        updateDoc(doc.ref, { lastMessage: "audio", lastMessageTime: createdAt });
      });
    });
    if (GroupMembers) {
      GroupMembers.forEach(arr => {
        arr.forEach(user => {
          console.log("usera", user)
          if (user !== auth.currentUser.email) {
            const docRef = query(collection(db, user), where("Name", "==", route.params.name));
            const res = getDocs(docRef);
            console.log("res", res)
            res.then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                updateDoc(doc.ref, { unread: false, unreadCount: querySnapshot.docs[0].data().unreadCount + 1, lastMessage: "audio", lastMessageTime: createdAt });
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
          updateDoc(doc.ref, { unread: false, unreadCount: querySnapshot.docs[0].data().unreadCount + 1, lastMessage: "audio", lastMessageTime: createdAt });
        });
      });
    }
  }

  //send image to firebase
  const onSendImage = async (downloadUrl) => {
let translatedText = imageDescription;
    if(imageDescription){
      translatedText = await translateText(imageDescription, userLanguage);
    }
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
      text: imageDescription,
      translatedText: translatedText,
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
        updateDoc(doc.ref, { lastMessage: text || "Image", lastMessageTime: createdAt });
        console.log("updated for user")
      });
    });
    if (GroupMembers) {
      GroupMembers.forEach(arr => {
        arr.forEach(user => {
          console.log("useraa", user)
          if (user !== auth.currentUser.email) {
            const docRef = query(collection(db, user), where("Name", "==", route.params.name));
            const res = getDocs(docRef);
            console.log("res", res)
            res.then((querySnapshot) => {
              if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                  updateDoc(doc.ref, { unread: false, unreadCount: querySnapshot.docs[0].data().unreadCount + 1, lastMessage: text || "Image", lastMessageTime: createdAt });
                  console.log("updated")
                })
              }
              else {
                addDoc(collection(db, user), { Name: route.params.name, UserName: "", userEmail: "", image: auth.currentUser.photoURL, unread: true, unreadCount: 1, lastMessage: text, lastMessageTime: createdAt, type: "group" });
                console.log("added")
              }
              ;
            });
          }
        }
        )
      });
    }
    else {
      const docRef = query(collection(db, route.params.userEmail), where("Name", "==", route.params.name));
      const res = getDocs(docRef);
      res.then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          updateDoc(doc.ref, { unread: false, unreadCount: querySnapshot.docs[0].data().unreadCount + 1, lastMessage: text || "Image", lastMessageTime: createdAt });
          console.log("updated for user")
        });
      });
      if (userToken2 != '') {
        let PushNotificationsData =
        {
          expoPushToken: userToken2,
          title: "New Message",
          body: `You have a New Image Message from ${auth.currentUser.displayName}`,
          data: { data: 'goes here' },
          // how to send user to the request screen? 
          // maybe we can send the request id and then in the request screen we will fetch the request by id
        }
        console.log("PushNotificationsData", PushNotificationsData)
        sendPushNotification(PushNotificationsData)
      }
    }
  }
  

  // send text message to firebase
  const onSend = useCallback( async (messages = [], GroupMembers, userToken2, userLanguage) => {
    const { _id, createdAt, text, user } = messages[0]
    // change to user language- second side
    let targetLanguage = userLanguage;
    let translate = await translateText(text, targetLanguage);
    addDoc(collection(db, route.params.name), { _id, createdAt, text, user, translatedText: translate });
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
          if (user !== auth.currentUser.email) {
            console.log("user", user)
            const docRef = query(collection(db, user), where("Name", "==", route.params.name));
            const res = getDocs(docRef);
            console.log("res", res)
            res.then((querySnapshot) => {
              // if user has no documentation in db of chat
              if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                  updateDoc(doc.ref, { unread: false, unreadCount: querySnapshot.docs[0].data().unreadCount + 1, lastMessage: text || "Image", lastMessageTime: createdAt });
                  console.log("updated")
                })
              }
              // if user has documentation in db of chat
              else {
                addDoc(collection(db, user), { Name: route.params.name, UserName: "", userEmail: "", image: auth.currentUser.photoURL, unread: true, unreadCount: 1, lastMessage: text, lastMessageTime: createdAt, type: "group" });
                console.log("added")
              }
            });
          }
        }
        )
      });
    }
    else {
      console.log("route.params.userEmail", route.params.userEmail)
      const docRef = query(collection(db, route.params.userEmail), where("Name", "==", route.params.name));
      const res = getDocs(docRef);
      res.then((querySnapshot) => {
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            updateDoc(doc.ref, { unread: false, unreadCount: querySnapshot.docs[0].data().unreadCount + 1, lastMessage: text, lastMessageTime: createdAt });
          });
        }
        else {
          addDoc(collection(db, route.params.userEmail), { Name: auth.currentUser.displayName + "+" + route.params.UserName, UserName: auth.currentUser.displayName, image: auth.currentUser.photoURL, userEmail: auth.currentUser.email, unread: true, unreadCount: 1, lastMessage: text, lastMessageTime: createdAt });
        }
      });
      if (userToken2 != '') {
        console.log("pushtoken2", userToken2)
        let PushNotificationsData =
        {
          expoPushToken: userToken2,
          title: "New Message",
          body: `You have a New Message from ${auth.currentUser.displayName}`,
          data: { data: 'goes here' },
          // how to send user to the request screen? 
          // maybe we can send the request id and then in the request screen we will fetch the request by id
        }
        console.log("PushNotificationsData", PushNotificationsData)
        sendPushNotification(PushNotificationsData)
      }
    }
  }, []);

  const translateText = async (text, targetLanguage) => {
    try {
      const response = await axios.post(`https://translation.googleapis.com/language/translate/v2`, {}, {
        params: {
          q: text,
          target: targetLanguage,
          key: 'AIzaSyBuJMig6uWp36DYloOdaOkY89-hjc4TK40',
        },
      });
      return response.data.data.translations[0].translatedText;
    } catch (error) {
      console.error("There was an error with the translation: ", error);
      return text;
    }
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <GiftedChat
          wrapInSafeArea={false}
          bottomOffset={Platform.OS === 'ios' ? 10 : 0} //this in case canceling tab bar wont work
          messages={messages}
          showAvatarForEveryMessage={false}
          alwaysShowSend={true}
          renderAvatarOnTop={true}
          renderSend={(props) => {
            return (
              <Send {...props}>
                <View style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 5,
                  marginRight: 5,
                  marginBottom: 0,
                  width: 30,
                  height: 44,
                }}>
                  <Ionicons name="send" size={28} color="#548DFF" />
                </View>
              </Send>
            )
          }}
          onSend={messages => onSend(messages, GroupMembers, userToken2, userLanguage)}
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
                    borderWidth: 1.5,
                    borderRadius: 20,
                    margin:Platform.OS==='android'&& 2,
                  },
                  right: {
                    backgroundColor: "#7DA9FF",
                    borderColor: "#548DFF",
                    borderWidth: 1.5,
                    borderRadius: 20,
                  }
                }}
                textStyle={{
                  left: { fontFamily: "Urbanist-Regular", fontSize: 16 },
                  right: { fontFamily: "Urbanist-Regular", color: "#fff", fontSize: 16 }
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
                renderMessageText={(props) => {                                  
                  return (
                    <Text style={[props.textStyle[props.position], {padding:5, paddingLeft:10, paddingRight:10}]}>
                      { props.currentMessage.user._id==auth.currentUser.email ?props.currentMessage.text:props.currentMessage.translatedText}
                    </Text>
                  );
                }}
              />
            )
          }}
          onPressAvatar={(user) => {
            if (user._id !== auth.currentUser.email) {
              // navigation.navigate('ChatProfile', { user: user }); - romoved for now- switched to modal- maybe replace textinput in modal
              return (
                console.log("user is not me"),
                setSelectedUser(<ChatProfile user={user} closeModal={() => { setUserModal(false); console.log("close") }} />),
                setUserModal(true)
              )
            }
            else {
              console.log("user is me")
            }
          }
          }
          renderInputToolbar={(props) => {
            return (
              <InputToolbar {...props}
                containerStyle={{
                  height: 50,
                }}
                primaryStyle={{
                  backgroundColor: '#D9D9D9',
                  borderColor: "#9E9E9E",
                  borderWidth: 1.5,
                  borderRadius: 16,
                  width: ScreenWidth * 0.975,
                  marginBottom: 5,
                  marginHorizontal: 5
                }}  //for the text input
                renderActions={(props) => {
                  return (
                    <>
                      <Actions {...props}
                        containerStyle={{
                          width: 28,
                          alignItems: 'center',
                          left: 0,
                          justifyContent: 'center',
                          bottom: 2,
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
                    </>
                  )
                }
                }
                renderComposer={(props) => {
                  return (
                    <Composer {...props}
                      textInputStyle={{
                        fontFamily: "Urbanist-Medium",
                        fontSize: 16,
                        color: "#000",
                        paddingVertical: 0,
                      }}
                      multiline={false}
                      placeholder="Type a message..."
                      placeholderTextColor="#808080"
                    />
                  )
                }
                }
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
                  backgroundColor: '#000',
                  swipeToDismiss: false,
                  springConfig: { tension: 100000, friction: 100000 },
                  renderHeader: (close) => (
                    <View style={styles.imagePreviewheader}>
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
                      {props.currentMessage.text &&
                        <View style={styles.txtBox}>
                          <Text style={styles.lightboxTxt}>{props.currentMessage.text}</Text>
                        </View>
                      }
                    </View>
                  ),
                  modalProps: {
                    animationType: 'slide',
                  }
                }}
              />
            );
          }}
        />
        <Modal visible={picPreviewModal} animationType='slide' onRequestClose={() => setPicPreviewModal(false)}>
          <SafeAreaView style={styles.imagePreview}>
            <TouchableOpacity style={styles.imagePreviewheader} onPress={() => setPicPreviewModal(false)}>
              <View>
                <Ionicons name='close' size={30} color='#000' />
              </View>
            </TouchableOpacity>
            <View>
              <Image source={{ uri: selectedPic }} style={styles.image} />
            </View>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.inputAndSend}
            >
              <TextInput
                style={[styles.modalInput, { fontFamily: 'Urbanist-Medium', fontSize: 16 }]}
                mode='outlined'
                onChangeText={(text) => setImageDescription(text)}
                placeholder="Add a caption..."
                outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
                contentStyle={{ fontFamily: 'Urbanist-Medium' }}
                activeOutlineColor="#548DFF"
                outlineColor='#E6EBF2'
              />
              <TouchableOpacity style={styles.iconSend} onPress={() => { setPicPreviewModal(false); sendToFirebase(selectedPic) }}>
                <Ionicons name='send' size={25} color='#000' />
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Modal>
        <Modal style={{ height: ScreenHeight * 0.35 }} visible={userModal} transparent={true} animationType='slide' onRequestClose={() => setUserModal(false)}>
          <SafeAreaView style={styles.profileModal}>
            <TouchableOpacity style={styles.profileModalCloseBtn} onPress={() => setUserModal(false)}>
              <View>
                <Ionicons name='close' size={30} color='#000' />
              </View>
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              {selectedUser}
            </View>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
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
    width: ScreenWidth * 0.95,
    height: ScreenHeight * 0.8,
    borderRadius: 10,
    // resizeMode: 'contain'
  },
  inputAndSend: {
    position: 'absolute',
    bottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: ScreenWidth,
    padding: 10,
  },
  modalInput: {
    width: ScreenWidth * 0.95,
    backgroundColor: '#fff',
    borderRadius: 10,
    // padding: 5,
    height: 54,
    justifyContent: 'center',
    fontFamily: 'Urbanist-Regular',
    fontSize: 16,
  },
  iconSend: {
    position: 'absolute',
    right: 20,
    justifyContent: 'center',
    top: 30,
  },
  imagePreviewheader: {
    width: 50,
    height: 50,
    borderRadius: 50,
    position: 'absolute',
    top: 75,
    right: 5,
    backgroundColor: '#C0C0C0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    zIndex: 1
  },
  lightboxTxt: {
    color: '#fff',
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 18,
    textAlign: 'center',
  },
  txtBox: {
    width: ScreenWidth * 0.95,
    position: 'absolute',
    bottom: 25,
    backgroundColor: '#080808',
    borderRadius: 16,
    borderTopEndRadius: 0,
    borderTopStartRadius: 0,
    padding: 10,
    height: 54,
  },
  profileModal: {
    justifyContent: 'flex-end',
    backgroundColor: "#fff",
    height: ScreenHeight * 0.35,
    width: ScreenWidth,
    position: "absolute",
    bottom: 0,
  },
  profileModalCloseBtn: {
    width: 50,
    height: 50,
    borderRadius: 50,
    position: 'absolute',
    top: 10,
    right: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    zIndex: 1
  },
})