import { View, Text, StyleSheet, Dimensions, Image, Alert, Modal, TouchableOpacity, ScrollView } from 'react-native'
import { auth, db } from '../../config/firebase';
import { collection, addDoc, getDocs, getDoc, query, orderBy, onSnapshot, updateDoc, where, limit, doc, increment } from 'firebase/firestore';
import { useUserContext } from '../../UserContext';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { TextInput } from 'react-native-paper';

const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

export default function ChatProfile({ route, navigation }) {

  useEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.user.name,
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontSize: 20,
        fontFamily: 'Urbanist-Bold',
      },
      headerStyle: {
        shadowColor: '#fff',
        elevation: 0,
      },
      headerTintColor: '#000',
      headerBackTitleVisible: false,
      headerLeft: () => (
        <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="#58" />
        </TouchableOpacity>
      ),
    });
  }, []);

  const addNewPrivateChat = async (user) => {
    // check if convo already exists in firestore 
    // if yes, navigate to chat room
    // if no, add new convo to firestore and navigate to chat room
    const q1 = query(collection(db, auth.currentUser.email), where("Name", "==", auth.currentUser.displayName + "+" + user.name));
    const q2 = query(collection(db, auth.currentUser.email), where("Name", "==", user.name + "+" + auth.currentUser.displayName));
    const querySnapshot = await getDocs(q1);
    const querySnapshot2 = await getDocs(q2);
    if (querySnapshot.docs.length > 0 || querySnapshot2.docs.length > 0) {
      checkifConvoExistsforContact(user)
      console.log("convo exists")
      if (querySnapshot.docs.length > 0) {
        navigation.popToTop()
        navigation.navigate('ChatRoom', { name: auth.currentUser.displayName + "+" + user.name, UserName: user.name, userEmail: user.id, unreadCount: querySnapshot.docs[0].data().unreadCount, type: "private" })
      }
      else {
        navigation.popToTop()
        navigation.navigate('ChatRoom', { name: user.name + "+" + auth.currentUser.displayName, UserName: user.name, userEmail: user.id, unreadCount: querySnapshot2.docs[0].data().unreadCount, type: "private" })
      }
    } else {
      console.log("add new private chat")
      let contact = user
      console.log("Userrrrr", contact)
      addDoc(collection(db, auth.currentUser.email), { Name: auth.currentUser.displayName + "+" + contact.name, UserName: contact.name, userEmail: contact._id, image: contact.avatar, unread: false, unreadCount: 0, lastMessage: "", lastMessageTime: new Date() });
      checkifConvoExistsforContact(user)
      navigation.popToTop()
      navigation.navigate('ChatRoom', { name: auth.currentUser.displayName + "+" + contact.name, UserName: contact.name, userEmail: contact.id, unreadCount: 0, type: "private" })
    }
  }

  const checkifConvoExistsforContact = async (contact) => {
    console.log("contact", contact)
    const q1 = query(collection(db, auth.currentUser.email), where("Name", "==", auth.currentUser.displayName + "+" + contact.name));
    const q2 = query(collection(db, auth.currentUser.email), where("Name", "==", contact.name + "+" + auth.currentUser.displayName));
    const query1 = await getDocs(q1);
    const query2 = await getDocs(q2);
    if (query1.docs.length > 0 || query2.docs.length > 0) {
      console.log("convo existsssssss")
    } else {
      console.log("add new private chat")
      console.log("Userrrrr", contact)
      addDoc(collection(db, contact._id), { Name: auth.currentUser.displayName + "+" + contact.name, UserName: auth.currentUser.displayName, image: auth.currentUser.photoURL, userEmail: auth.currentUser.email, unread: true, unreadCount: 0, lastMessage: "", lastMessageTime: new Date() });
    }
  }

  // const addNewPrivateChat = async (user) => {
  //   // check if convo already exists in firestore 
  //   // if yes, navigate to chat room
  //   // if no, add new convo to firestore and navigate to chat room
  //   const q1 = query(collection(db, auth.currentUser.email), where("Name", "==", auth.currentUser.displayName + "+" + user.name));
  //   const q2 = query(collection(db, auth.currentUser.email), where("Name", "==", user.name + "+" + auth.currentUser.displayName));
  //   const querySnapshot = await getDocs(q1);
  //   const querySnapshot2 = await getDocs(q2);
  //   if (querySnapshot.docs.length > 0 || querySnapshot2.docs.length > 0) {
  //     checkifConvoExistsforContact(user)
  //     console.log("convo exists")
  //     if (querySnapshot.docs.length > 0) {
  //       console.log(querySnapshot.docs[0].data())
  //       navigation.navigate('ChatRoom', { name: auth.currentUser.displayName + "+" + user.name, UserName: user.name, userEmail: user.id, unreadCount: querySnapshot.docs[0].data().unreadCount, type: "private" })
  //     }
  //     else {
  //       console.log(querySnapshot2.docs[0].data())
  //       navigation.navigate('ChatRoom', { name: user.name + "+" + auth.currentUser.displayName, UserName: user.name, userEmail: user.id, unreadCount: querySnapshot2.docs[0].data().unreadCount, type: "private" })
  //     }
  //     setAddNewModal(false)
  //     // const editRef= collection(db, auth.currentUser.email, where("Name", "==", auth.currentUser.displayName+"+"+user.name));
  //     // const doc= await getDocs(editRef);
  //     // await updateDoc(editRef, { unread: false, unreadCount: 0 });
  //   } else {
  //     console.log("add new private chat")
  //     let contact = user
  //     console.log("Userrrrr", contact)
  //     addDoc(collection(db, auth.currentUser.email), { Name: auth.currentUser.displayName + "+" + contact.name, UserName: contact.name, userEmail: contact.id, image: contact.avatar, unread: false, unreadCount: 0, lastMessage: "", lastMessageTime: new Date(), type: "private" });
  //     checkifConvoExistsforContact(user)
  //     setAddNewModal(false)
  //     navigation.navigate('ChatRoom', { name: auth.currentUser.displayName + "+" + contact.name, UserName: contact.name, userEmail: contact.id, unreadCount: 0, type: "private" })
  //   }
  // }

  // const checkifConvoExistsforContact = async (contact) => {
  //   console.log(contact)
  //   const q1 = query(collection(db, contact.id), where("Name", "==", auth.currentUser.displayName + "+" + contact.name));
  //   const q2 = query(collection(db, contact.id), where("Name", "==", contact.name + "+" + auth.currentUser.displayName));
  //   const query1 = await getDocs(q1);
  //   const query2 = await getDocs(q2);
  //   if (query1.docs.length > 0 || query2.docs.length > 0) {
  //     console.log("convo exists for contact")
  //   } else {
  //     console.log("add new private chat")
  //     addDoc(collection(db, contact.id), { Name: auth.currentUser.displayName + "+" + contact.name, UserName: auth.currentUser.displayName, image: auth.currentUser.photoURL, userEmail: auth.currentUser.email, unread: true, unreadCount: 0, lastMessage: "", lastMessageTime: new Date(), type: "private" });
  //   }
  // }

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <View style={styles.header}>
          {/* <Text style={styles.headterTxt}>{route.params.user.name}</Text> */}
        </View>
        <View style={styles.imageView}>
          <Image style={styles.avatar} source={{ uri: route.params.user.avatar }} />
        </View>
        <TextInput
          label="Email"
          value={route.params.user._id}
          mode="outlined"
          disabled={true}
          style={styles.inputTxt}
          textColor='#000'
          outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
          labelStyle={{ color: '#000', fontSize: 16, fontWeight: 'bold', }}
          theme={{ colors: { primary: '#548DFF', underlineColor: 'transparent', } }}
          contentStyle={{ fontFamily: 'Urbanist-Regular' }}
        />
        <TouchableOpacity style={styles.button}
          onPress={() => addNewPrivateChat(route.params.user)}>
          <AntDesign name='message1' size={22} color={"#548DFF"} />
          <Text style={styles.BtnTxt}>Send Messsage </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profile: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  //chat user profile
  avatar: {
    height: 75, width: 75, borderRadius: 75
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 16,
    height: 54,
    width: ScreenWidth * 0.9,
    borderColor: '#548DFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 1,
    marginTop: 20,
  },
  imageView: {
    margin: 20,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headterTxt: {
    fontSize: 20,
    fontFamily: 'Urbanist-Bold',
  },
  BtnTxt: {
    fontSize: 16,
    fontFamily: 'Urbanist-Bold',
    color: '#548DFF',
  },
  inputTxt: {
    fontFamily: 'Urbanist-Light',
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
    marginVertical: 10,
    width: ScreenWidth * 0.9,
  },
})