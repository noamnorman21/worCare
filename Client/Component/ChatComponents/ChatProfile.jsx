import { View, Text, StyleSheet, Dimensions, Image, Alert, Modal, TouchableOpacity, ScrollView } from 'react-native'
import { auth, db } from '../../config/firebase';
import { collection, addDoc, getDocs, getDoc, query, orderBy, onSnapshot, updateDoc, where, limit, doc, increment } from 'firebase/firestore';
import { useUserContext } from '../../UserContext';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';

const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;


export default function ChatProfile({ route, navigation }) {

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
      navigation.navigate('ChatRoom', { name: auth.currentUser.displayName + "+" + user.name, UserName: user.name })
      // const editRef= collection(db, auth.currentUser.email, where("Name", "==", auth.currentUser.displayName+"+"+user.name));
      // const doc= await getDocs(editRef);
      // await updateDoc(editRef, { unread: false, unreadCount: 0 });
    } else {
      console.log("add new private chat")
      let contact = user
      console.log("Userrrrr", contact)
      addDoc(collection(db, auth.currentUser.email), { Name: auth.currentUser.displayName + "+" + contact.name, UserName: contact.name, userEmail: contact._id, image: contact.avatar, unread: false, unreadCount: 0, lastMessage: "", lastMessageTime: new Date() });
      checkifConvoExistsforContact(user)
      navigation.navigate('ChatRoom', { name: auth.currentUser.displayName + "+" + contact.name, UserName: contact.name, userEmail: contact.id })
    }
  }

  const checkifConvoExistsforContact = async (contact) => {
    console.log(contact)
    const q1 = query(collection(db, contact._id), where("Name", "==", auth.currentUser.displayName + "+" + contact.name));
    const q2 = query(collection(db, contact._id), where("Name", "==", contact.name + "+" + auth.currentUser.displayName));
    const query1 = await getDocs(q1);
    const query2 = await getDocs(q2);
    if (query1.docs.length > 0 || query2.docs.length > 0) {
      console.log("convo existsssssss")
    } else {
      console.log("add new private chat")
      addDoc(collection(db, contact.id), { Name: auth.currentUser.displayName + "+" + contact.name, UserName: auth.currentUser.displayName, image: auth.currentUser.photoURL, userEmail: auth.currentUser.email, unread: true, unreadCount: 0, lastMessage: "", lastMessageTime: new Date() });
    }
  }  

  return (
    <View style={styles.container}>
      <Image style={styles.avatar} source={{ uri: route.params.user.avatar }} />
        <Text>{route.params.user._id}</Text>
        <Text>{route.params.user.name}</Text>  
      <TouchableOpacity style={styles.button}
        onPress={() => addNewPrivateChat(route.params.user)}>
        <AntDesign name='message1' size={20} color={"#548DFF"} />
        <Text style={styles.BtnTxt}>Send Messsage </Text>
      </TouchableOpacity>      
    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
   //chat user profile
   avatar: {
    height:150,width:150, borderRadius:75
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 16,
    height: 54,
    width: ScreenWidth * 0.3,
    borderColor: '#548DFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 1,
  },
})