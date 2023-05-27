import { View, Text, StyleSheet, Dimensions, Image, Alert, Modal, TouchableOpacity, ScrollView, Platform } from 'react-native'
import { useCallback, useState, useLayoutEffect } from 'react'
import { auth, db } from '../config/firebase';
import { GiftedChat, Bubble, Time, MessageImage } from 'react-native-gifted-chat';
import { collection, addDoc, getDocs, getDoc, query, orderBy, onSnapshot, updateDoc, where, limit, doc, increment } from 'firebase/firestore';
import { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useUserContext } from '../UserContext';
import { Feather, Entypo, EvilIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AddNewGroupChat from './ChatComponents/AddNewGroupChat';
import { useFocusEffect } from '@react-navigation/native';
import {InputToolbar, Actions} from 'react-native-gifted-chat';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { storage } from '../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


import moment from 'moment';

const ScreenHeight = Dimensions.get("window").height;
const ScreenWidth = Dimensions.get("window").width;

import ChatProfile from './ChatComponents/ChatProfile';
import { TextInput } from 'react-native-paper';


const stack = createStackNavigator();
export default function Chats({ navigation }) {
  return (
    <stack.Navigator initialRouteName='MainRoom' >
      <stack.Screen name="ChatRoom" component={ChatRoom} />
      <stack.Screen name="MainRoom" component={MainRoom} options={{ headerShown: false }} />
      <stack.Screen name="ChatProfile" component={ChatProfile} options={{ headerShown: false }} />
    </stack.Navigator>
  )
}


function ChatRoom({ route, navigation }) {
  const [messages, setMessages] = useState([]);
  const [picPreviewModal, setPicPreviewModal] = useState(false);
  const [selectedPic, setSelectedPic] = useState(null);
  const [imageDescription, setImageDescription] = useState('')

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
    navigation.setOptions({
      headerTitle: route.params.UserName ? route.params.UserName : route.params.name,
    })

  }, [navigation]);

  useEffect(() => {
    const setDocAsRead = async () => {
      const docRef = query(collection(db, auth.currentUser.email), where("Name", "==", route.params.name));
      const res = await getDocs(docRef);
      res.forEach((doc) => {
        updateDoc(doc.ref, { unread: false, unreadCount: 0 });
      });
    }
    setDocAsRead();
  }, []);

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
        allowsEditing: true,
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
      allowsEditing: true,
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
    if (route.params.userEmail) {
      const docRef = query(collection(db, route.params.userEmail), where("Name", "==", route.params.name));
      const res = getDocs(docRef);
      res.then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          updateDoc(doc.ref, { unread: false, unreadCount: querySnapshot.docs[0].data().unreadCount + 1, lastMessage: text, lastMessageTime: createdAt });
        });
      });
    }
  }


  const onSend = useCallback((messages = []) => {
    const { _id, createdAt, text, user } = messages[0]
    addDoc(collection(db, route.params.name), { _id, createdAt, text, user });
    const docRef = query(collection(db, auth.currentUser.email), where("Name", "==", route.params.name));
    const res = getDocs(docRef);
    res.then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        updateDoc(doc.ref, { lastMessage: text, lastMessageTime: createdAt });
      });
    });
    if (route.params.userEmail) {
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
      onSend={messages => onSend(messages)}
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
              <Ionicons name="camera" size={28} color="#000" />
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
            primaryStyle={{ alignItems: 'center' }}    
                   
          />
        )
      }
      }
      renderTime={(props) => {  
        return (
          <Time {...props}
            timeTextStyle={{
              left: { fontFamily: "Urbanist-Regular", color: "#000" },
              right: { fontFamily: "Urbanist-Regular", color: "#fff" },
              position:'absolute',
            }}
            timeFormat='HH:mm'
           
          />
        )
        // return (
        //   <View>
        //     {props.currentMessage.createdAt && <Text style={{ fontSize: 12, fontFamily: 'Urbanist-Regular', color: "#000", paddingRight:7, paddingLeft:7,paddingBottom:2}}>{moment(props.currentMessage.createdAt).format('HH:MM')}</Text>}
        //   </View>
        // )
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
            <TextInput style={{ width:ScreenWidth*0.8, backgroundColor: '#fff', borderRadius: 10, padding: 10, fontFamily: 'Urbanist-Regular', fontSize: 16, marginVertical: 10 }}
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


function MainRoom({ navigation }) {
  const [chatsToDisplay, setchatsToDisplay] = useState([])
  const { userContext } = useUserContext();
  const [users, setUsers] = useState([])
  const [userChats, setUserChats] = useState([])
  const [usersToDisplay, setUsersToDisplay] = useState([])
  const [addNewModal, setAddNewModal] = useState(false)
  const [newName, setNewName] = useState('')
  const [addNewModalGroup, setAddNewModalGroup] = useState(false)
  const [publicGroupNames, setPublicGroupNames] = useState([])

  useEffect(() => {
    if (userContext) {
      const tempNames = query(collection(db, auth.currentUser.email));
      // add listener to names collection
      const getNames = onSnapshot(tempNames, (snapshot) => setUserChats(
        snapshot.docs.map(doc => ({
          key: doc.data().Name,
          Name: doc.data().Name,
          UserName: doc.data().UserName,
          userEmail: doc.data().userEmail,
          image: doc.data().image,
          unread: doc.data().unread,
          unreadCount: doc.data().unreadCount,
          lastMessage: doc.data().lastMessage,
          lastMessageTime: doc.data().lastMessageTime.toDate(),
        }))
      ));
      const tempUsers = query(collection(db, "AllUsers"), where("id", "!=", auth.currentUser.email));
      // add listener to users collection
      const getUsers = onSnapshot(tempUsers, (snapshot) => setUsers(
        snapshot.docs.map(doc => ({
          id: doc.data().id,
          name: doc.data().name,
          avatar: doc.data().avatar,
        }))
      ))
      return () => {
        getNames();
        getUsers();
      }
    }
    else {
      console.log("no user context")
      setUserChats([])
    }


  }, [auth.currentUser.email])



  useEffect(() => {
    //relevant- from user context
    if (userChats) {
      const renderNames = () => {
        setchatsToDisplay(userChats.map((name, index) => (
          <ConvoCard key={index} name={name} userEmails={name.userEmails} />
        )))
      }
      renderNames();
    }
    else {
      setchatsToDisplay()
    }
  }, [userChats]);

  useEffect(() => {
    const renderUsers = () => {
      const res = users.map((user) => (
        <View key={user.name} >
          <TouchableOpacity style={styles.userCard} onPress={() => addNewPrivateChat(user)}>
            <Image source={{ uri: user.avatar }} style={{ width: 65, height: 65, borderRadius: 54 }} />
            <Text style={styles.userName}>{user.id}</Text>
          </TouchableOpacity>
          <View style={styles.lineContainer}>
            <View style={styles.line} />
          </View>
        </View>
      )
      )
      setUsersToDisplay(res)
    }
    renderUsers();
  }, [users]);

  // useEffect(() => {
  //   console.log('publicGroupNames', publicGroupNames)
  // }, [publicGroupNames]);

  const addNewPrivateChat = async (user) => {
    // check if convo already exists in firestore 
    // if yes, navigate to chat room
    // if no, add new convo to firestore and navigate to chat room
    const q = query(collection(db, auth.currentUser.email), where("Name", "==", auth.currentUser.displayName + "+" + user.name));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs.length > 0) {
      console.log("convo exists")
      setAddNewModal(false)
      navigation.navigate('ChatRoom', { name: auth.currentUser.displayName + "+" + user.name, UserName: user.name })
      // const editRef= collection(db, auth.currentUser.email, where("Name", "==", auth.currentUser.displayName+"+"+user.name));
      // const doc= await getDocs(editRef);
      // await updateDoc(editRef, { unread: false, unreadCount: 0 });
    } else {
      console.log("add new private chat")
      const contact = user
      addDoc(collection(db, auth.currentUser.email), { Name: auth.currentUser.displayName + "+" + contact.name, UserName: contact.name, userEmail: contact.id, image: contact.avatar, unread: false, unreadCount: 0, lastMessage: "", lastMessageTime: new Date() });
      checkifConvoExistsforContact(contact)
      navigation.navigate('ChatRoom', { name: auth.currentUser.displayName + "+" + contact.name, UserName: contact.name, userEmail: contact.id })
      setAddNewModal(false)
    }
  }

  const checkifConvoExistsforContact = (contact) => {
    console.log(contact)
    const q = query(collection(db, contact.id), where("Name", "==", auth.currentUser.displayName + "+" + contact.name));
    getDocs(q).then((querySnapshot) => {
      if (querySnapshot.size > 0) {
        console.log("convo existsssssss")
      } else {
        console.log("add new private chat")
        addDoc(collection(db, contact.id), { Name: auth.currentUser.displayName + "+" + contact.name, UserName: auth.currentUser.displayName, image: auth.currentUser.photoURL, userEmail: auth.currentUser.email, unread: true, unreadCount: 0, lastMessage: "", lastMessageTime: new Date() });
      }
    }
    )
  }


  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.header}>Chat Room</Text>
        <Feather name='edit' size={20} onPress={() => { setAddNewModal(true) }} />
      </View>
      <ScrollView>
        {chatsToDisplay}
      </ScrollView>
      <Modal visible={addNewModal} animationType='slide'>
        <View style={styles.modal}>
          <Text style={styles.modalText}>Add new chat</Text>
          {/* <TouchableOpacity style={styles.modalButton} onPress={()=>{setAddNewModal(false);setAddNewModalGroup(true)}}>
            <Text style={styles.modalButtonText}>Group</Text>
          </TouchableOpacity> */}
          {usersToDisplay}
          <TouchableOpacity style={styles.modalButton} onPress={() => { setAddNewModal(false); console.log("pressed close") }}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {/* <Modal visible={addNewModalGroup} animationType='slide'>
        <AddNewGroupChat groupNames={publicGroupNames} users={users} closeModal={()=>setAddNewModalGroup(false)} navigate={(name)=>{ navigation.navigate('ChatRoom', { name: name })}} />
      </Modal> */}

    </View>
  )
}

const ConvoCard = (props) => {
  const navigation = useNavigation();
  const [lastMessageTime, setLastMessageTime] = useState('')
  const [lastMessageText, setLastMessageText] = useState('')
  const [lastMessageDate, setLastMessageDate] = useState('')
  const today = moment().format('MMM DD YYYY')
  const yasterday= moment().subtract(1, 'days').format('MMM DD YYYY')

  useEffect(() => {
    const temp = props.name.lastMessageTime.toString().split(' ')
    const date = temp[1] + ' ' + temp[2] + ' ' + temp[3]
    setLastMessageTime(temp[4].split(':').slice(0, 2).join(':'))
    setLastMessageDate(date)
    if (props.name.lastMessage.length > 30) {
      setLastMessageText(props.name.lastMessage.slice(0, 35) + '...')
    }
    else {
      setLastMessageText(props.name.lastMessage)
    }
  }, [props.name]);

  const navigateToChatRoom = async (user) => {
    navigation.navigate('ChatRoom', { name: user.Name, UserName: user.UserName, userEmail: user.userEmail })
    const docRef = query(collection(db, auth.currentUser.email), where("Name", "==", props.name.Name));
    const res = await getDocs(docRef);
    res.forEach((doc) => {
      updateDoc(doc.ref, { unread: false, unreadCount: 0 });
    });
  }
  return (
    <>
      <View key={props.name.Name} >
        <TouchableOpacity style={styles.conCard} key={props.name.Name} onPress={() => navigateToChatRoom(props.name)}>
          <View style={styles.conLeft}>
            <Image source={{ uri: props.name.image }} style={styles.convoImage} />
          </View>
          <View style={styles.conMiddle}>
            <Text style={styles.conName}>{props.name.UserName ? props.name.UserName : props.name.Name}</Text>
            <Text style={styles.conLastMessage}>{lastMessageText}</Text>
          </View>
          <View style={styles.conRight}>
            {props.name.unreadCount > 0 && <View style={styles.unread}>
              <Text style={styles.unreadTxt}>{props.name.unreadCount}</Text>
            </View>}
            {lastMessageDate === yasterday && <Text style={styles.conDate}>yasterday</Text>}
            {lastMessageDate < yasterday && <Text style={styles.conDate}>{lastMessageDate}</Text>}
            {lastMessageDate === today && <Text style={styles.conTime}>{lastMessageTime}</Text>}
          </View>
        </TouchableOpacity>
        <View style={styles.lineContainer}>
          <View style={styles.line} />
        </View>
      </View>
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
    width: ScreenWidth*0.9,
    height: ScreenHeight*0.6,
    borderRadius: 10 ,
    resizeMode:'cover'
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
  }
})