import { View, Text, StyleSheet, Dimensions, Image, Alert, Modal, TouchableOpacity, ScrollView } from 'react-native'
import { auth, db } from '../../config/firebase';
import { collection, addDoc, getDocs, getDoc, query, orderBy, onSnapshot, updateDoc, where, limit, doc, increment } from 'firebase/firestore';
import { useUserContext } from '../../UserContext';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const ScreenWidth = Dimensions.get('window').width;

export default function ChatProfile(props) {

  const navigation = useNavigation();

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
        console.log(1)
        props.closeModal()
        navigation.popToTop()
        navigation.navigate('ChatRoom', { name: auth.currentUser.displayName + "+" + user.name, UserName: user.name, userEmail: user._id, unreadCount: querySnapshot.docs[0].data().unreadCount, type: "private" })
      }
      else {
        console.log(2)
        props.closeModal()
        navigation.popToTop()
        navigation.navigate('ChatRoom', { name: user.name + "+" + auth.currentUser.displayName, UserName: user.name, userEmail: user._id, unreadCount: querySnapshot2.docs[0].data().unreadCount, type: "private" })
      }
    } else {
      console.log("add new private chat")
      let contact = user
      console.log("Userrrrr", contact)
      addDoc(collection(db, auth.currentUser.email), { Name: auth.currentUser.displayName + "+" + contact.name, UserName: contact.name, userEmail: contact._id, image: contact.avatar, unread: false, unreadCount: 0, lastMessage: "", lastMessageTime: new Date() });
      checkifConvoExistsforContact(user)
      props.closeModal()
      navigation.popToTop()
      navigation.navigate('ChatRoom', { name: auth.currentUser.displayName + "+" + contact.name, UserName: contact.name, userEmail: contact._id, unreadCount: 0, type: "private" })
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

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <View style={styles.imageView}>
          <Image style={styles.avatar} source={{ uri: props.user.avatar }} />
          <Text style={styles.name}>{props.user.name}</Text>
        </View>
        <TouchableOpacity style={styles.button}
          onPress={() => addNewPrivateChat(props.user)}>
          <Text style={styles.BtnTxt}>Chat</Text>
          <AntDesign style={styles.chatIcon} name='message1' size={18} color={"#548DFF"} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'flex-end',
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 1,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  profile: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginVertical: 20,
  },
  //chat user profile
  avatar: {
    height: 75,
    width: 75,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    width: ScreenWidth * 0.5,
    height: 54,
    borderRadius: 16,
    borderColor: '#548DFF',
    borderWidth: 1.5,
    flexDirection: 'row',
  },
  imageView: {
    alignItems: 'center',
    width: ScreenWidth * 0.9,
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
    fontSize: 18,
    fontFamily: 'Urbanist-Bold',
    color: '#548DFF',
  },
  chatIcon: {
    marginLeft: 10,
  },
  name: {
    fontFamily: "Urbanist-SemiBold",
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  }
})