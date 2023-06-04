import { View, Text, StyleSheet, Dimensions, Image, Alert, Modal, TouchableOpacity, ScrollView, Platform } from 'react-native'
import { useCallback, useState, useLayoutEffect } from 'react'
import { auth, db } from '../config/firebase';
import { GiftedChat, Bubble, Time, MessageImage } from 'react-native-gifted-chat';
import { collection, addDoc, getDocs, getDoc, query, orderBy, onSnapshot, updateDoc, where, limit, doc, increment } from 'firebase/firestore';
import { useEffect } from 'react';
import { createStackNavigator,TransitionPresets } from '@react-navigation/stack';
import { useUserContext } from '../UserContext';
import { Feather, Entypo, EvilIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AddNewGroupChat from './ChatComponents/AddNewGroupChat';
import { useFocusEffect } from '@react-navigation/native';
import { InputToolbar, Actions } from 'react-native-gifted-chat';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { storage } from '../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { TextInput } from 'react-native-paper';
import moment from 'moment';

const ScreenHeight = Dimensions.get("window").height;
const ScreenWidth = Dimensions.get("window").width;

import ChatProfile from './ChatComponents/ChatProfile';
import ChatRoom from './ChatComponents/ChatRoom';

const Stack = createStackNavigator();
export default function Chats({ navigation }) {
  return (
    <Stack.Navigator initialRouteName='MainRoom' screenOptions={{
      //this is the animation for the navigation
      ...TransitionPresets.SlideFromRightIOS,
      headerBlurEffect: 'light',
    }} >
      <Stack.Screen name="ChatRoom" component={ChatRoom} />
      <Stack.Screen name="MainRoom" component={MainRoom} options={{ headerShown: false }} />
      <Stack.Screen name="ChatProfile" component={ChatProfile} options={{headerTitleAlign:'center'}} animationType="slide" />
    </Stack.Navigator>
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
          type: doc.data().type
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
        console.log("unsubscribing")
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
      addDoc(collection(db, auth.currentUser.email), { Name: auth.currentUser.displayName + "+" + contact.name, UserName: contact.name, userEmail: contact.id, image: contact.avatar, unread: false, unreadCount: 0, lastMessage: "", lastMessageTime: new Date(), type: "private" });
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
        addDoc(collection(db, contact.id), { Name: auth.currentUser.displayName + "+" + contact.name, UserName: auth.currentUser.displayName, image: auth.currentUser.photoURL, userEmail: auth.currentUser.email, unread: true, unreadCount: 0, lastMessage: "", lastMessageTime: new Date(), type: "private" });
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
  const yasterday = moment().subtract(1, 'days').format('MMM DD YYYY')

  useEffect(() => {
    const temp = props.name.lastMessageTime.toString().split(' ')
    let date = temp[1] + ' ' + temp[2] + ' ' + temp[3]
    date=new moment(date).format('MMM DD YYYY')
    const time= temp[4].split(':').slice(0, 2).join(':')
    setLastMessageTime(time)
    setLastMessageDate(date)
    if (props.name.lastMessage.length > 30) {
      setLastMessageText(props.name.lastMessage.slice(0, 35) + '...')
    }
    else {
      setLastMessageText(props.name.lastMessage)
    }
  }, [props.name]);

  const navigateToChatRoom = async (user) => {
    navigation.navigate('ChatRoom', { name: user.Name, UserName: user.UserName, userEmail: user.userEmail, type: props.name.type })
    const docRef = query(collection(db, auth.currentUser.email), where("Name", "==", props.name.Name));
    const res = await getDocs(docRef);
    res.forEach((doc) => {
      updateDoc(doc.ref, { unread: false, unreadCount: 0 });
    });
  }
  return (
    <>
      <View key={props.name.Name} >
        <TouchableOpacity style={styles.conCard} key={props.name.Name} onPress={() => navigateToChatRoom(props.name)} onLongPress={()=> {console.log("Long pressed")}}>
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
            {lastMessageDate === today && <Text style={styles.conTime}>{lastMessageTime}</Text>}
            {lastMessageDate === yasterday && <Text style={styles.conDate}>yasterday</Text>}
            {lastMessageDate !== today && lastMessageDate !== yasterday && <Text style={styles.conDate}>{lastMessageDate}</Text>}

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
  convoImage: {
    width: 55,
    height: 55,
    borderRadius: 54
  },
  
})