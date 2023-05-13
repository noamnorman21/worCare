import { View, Text, StyleSheet, Dimensions,Image, Alert,Modal,TouchableOpacity,ScrollView } from 'react-native'
import { useCallback, useState, useLayoutEffect } from 'react'
import { useIsFocused } from '@react-navigation/native';
import { auth, db } from '../config/firebase';
import { signOut, updateProfile } from 'firebase/auth';
import { GiftedChat } from 'react-native-gifted-chat';
import { collection, addDoc, getDocs, query, orderBy, onSnapshot, listCollection, where, limit } from 'firebase/firestore';
import { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useUserContext } from '../UserContext';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AddNewGroupChat from '../Component/HelpComponents/AddNewGroupChat';
import { get } from 'firebase/database';


const ScreenHeight = Dimensions.get("window").height;
const ScreenWidth = Dimensions.get("window").width;

// const Chat = ({ navigation }) => {
//     const [messages, setMessages] = useState([]);
//     const signOutNow = () => {
//         signOut(auth).then(() => {
//             // Sign-out successful.
//             navigation.replace('Login');
//         }).catch((error) => {
//             // An error happened.
//         });
//     }
// useLayoutEffect(() => {
//   navigation.setOptions({
//     headerLeft: () => (
//       <View style={{ marginLeft: 20 }}>
//         <Avatar
//           rounded
//           source={{
//             uri: auth?.currentUser?.photoURL,
//           }}
//         />
//       </View>
//     ),
//     headerRight: () => (
//       <TouchableOpacity style={{
//         marginRight: 10
//       }}
//         onPress={signOutNow}
//       >
//         <Text>logout</Text>
//       </TouchableOpacity>
//     )
//   })
//   const q = query(collection(db, 'chats'), orderBy('createdAt', 'desc'));
//   const unsubscribe = onSnapshot(q, (snapshot) => setMessages(
//     snapshot.docs.map(doc => ({
//       _id: doc.data()._id,
//       createdAt: doc.data().createdAt.toDate(),
//       text: doc.data().text,
//       user: doc.data().user,
//     }))
//   ));

//   return () => {
//     unsubscribe();
//   };
// }, [navigation]);

//     useEffect(() => {
//         setMessages([
//             {
//                 _id: 1,
//                 text: 'Hello developer',
//                 createdAt: new Date(),
//                 user: {
//                     _id: 2,
//                     name: 'React Native',
//                     avatar: 'https://placeimg.com/140/140/any',
//                 },
//             },
//         ])
//     }, []);
//     const onSend = useCallback((messages = []) => {
//         setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
//     }, []);
//     return (
//         <GiftedChat
//             messages={messages}
//             showAvatarForEveryMessage={true}
//             onSend={messages => onSend(messages)}
//             user={{
//                 _id: auth?.currentUser?.email,
//                 name: auth?.currentUser?.displayName,
//                 avatar: auth?.currentUser?.photoURL
//             }}
//         />
//     );
// }

// export default Chat;
const stack = createStackNavigator();
export default function Chats({ navigation }) {
  return(
<stack.Navigator initialRouteName='MainRoom' >
    <stack.Screen name="ChatRoom" component={ChatRoom}  />
    <stack.Screen name="MainRoom" component={MainRoom} options={{headerShown:false}} />
</stack.Navigator>
  )  
}

function ChatRoom ({route,navigation})  {
  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    const tempMessages= query(collection(db, route.params.name), orderBy('createdAt', 'desc'));
    getDocs(tempMessages).then((querySnapshot) => {
    onSnapshot(tempMessages, (snapshot) => {setMessages(
      snapshot.docs.map(doc => ({
        _id: doc.data()._id,
        createdAt: doc.data().createdAt.toDate(),
        text: doc.data().text,
        user: doc.data().user,
      }))
    )});
  });
  navigation.setOptions({
    headerTitle: route.params.user?route.params.user:route.params.name,
  })
  
  }, [navigation]);


  const onSend = useCallback((messages = []) => {
    const { _id, createdAt, text, user } = messages[0]
    addDoc(collection(db, route.params.name), { _id, createdAt, text, user });
  }, []);

  return (
    <GiftedChat
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
    />
  );
}


function MainRoom ({navigation}) {
  const [namesToDisplay, setNamesToDisplay] = useState([])
  const { userContext, userChats } = useUserContext();
  const [users, setUsers] = useState([])
  const [usersToDisplay, setUsersToDisplay] = useState([])
  const [addNewModal, setAddNewModal] = useState(false)
  const [newName, setNewName] = useState('')
  const [addNewModalGroup, setAddNewModalGroup] = useState(false)
  const [publicGroupNames, setPublicGroupNames] = useState([])

  useLayoutEffect(() => {
    
    // get all conversations from collection
    // const tempNames= query(collection(db, auth.currentUser.email));
    // // add listener to names collection
    // const getNames = onSnapshot(tempNames, (snapshot) => setNames(
    //   snapshot.docs.map(doc => ({
    //     key: doc.data().Name,
    //     Name: doc.data().Name,
    //     User: doc.data().User,
    //     image: doc.data().image,
    //   }))
    // ))

    
    
    // get all users from collection except current user
    const tempUsers= query(collection(db, "AllUsers"), where("id","!=",auth.currentUser.email));
    // add listener to users collection
    const getUsers = onSnapshot(tempUsers, (snapshot) => setUsers(
      snapshot.docs.map(doc => ({
        id: doc.data().id,
        name: doc.data().name,
        avatar: doc.data().avatar,
      }))
    ))
    //get public groups
// const tempGroupNames= query(collection(db, "allPublicGroups"));
//     const getPublic = (collection(db, "allPublicGroups"), onSnapshot(tempGroupNames, (snapshot) => setPublicGroupNames(
//       snapshot.docs.map(doc => ({
//         Name: doc.data().Name,
//       }))
//     )));
    
    return () => {
      // getNames();
      getUsers();
      // getPublic();
    }
  }, [navigation]);
  


  useEffect(() => {
    //relevant- from user context
    const renderNames = () => {
      setNamesToDisplay(userChats.map((name,index) => (
        <ConvoCard key={index} name={name} />
        )))
    }  
    
    
    renderNames();
  }, [userChats]);

  useEffect(() => {
    const renderUsers = () => {
      const res= users.map((user) => (
          <View key={user.name} >
          <TouchableOpacity style={styles.userCard} onPress={() => addNewPrivateChat(user)}>
          <Image source={{ uri: user.avatar }} style={{ width: 65, height: 65, borderRadius:54 }} />
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
    const q= query(collection(db, auth.currentUser.email), where("Name", "==", auth.currentUser.displayName+"+"+user.name));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs.length > 0) {
      console.log("convo exists")
      setAddNewModal(false)
      navigation.navigate('ChatRoom', {name: auth.currentUser.displayName+"+"+user.name, user: user.name})
    } else {
    console.log("add new private chat")
    const contact= user
    addDoc(collection(db, auth.currentUser.email), { Name: auth.currentUser.displayName+"+"+contact.name, User: contact.name, image: contact.avatar});
    checkifConvoExistsforContact(contact)
    navigation.navigate('ChatRoom', {name: auth.currentUser.displayName+"+"+contact.name, user: contact.name})  
    setAddNewModal(false)   
  }
}

  const checkifConvoExistsforContact = (contact) => {
    console.log(contact)
    const q= query(collection(db, contact.id), where("Name","==",auth.currentUser.displayName+"+"+contact.name));
    getDocs(q).then((querySnapshot) => {
      if (querySnapshot.size > 0) {
        return console.log("convo existsssssss")
      } else {
        console.log("add new private chat")
        addDoc(collection(db, contact.id), { Name: auth.currentUser.displayName+"+"+contact.name, User: auth.currentUser.displayName, image: auth.currentUser.photoURL});
      }
    }
    )
  }
  

  return (
    <View style={styles.container}>
      <View style={styles.top}>
      <Text style={styles.header}>Chat Room</Text>
      <Feather name='edit' size={20} onPress={()=>{setAddNewModal(true)}} />
      </View>
      <ScrollView>    
      {namesToDisplay}
      </ScrollView> 
      <Modal visible={addNewModal} animationType='slide'>
        <View style={styles.modal}>
          <Text style={styles.modalText}>Add new chat</Text>
          {/* <TouchableOpacity style={styles.modalButton} onPress={()=>{setAddNewModal(false);setAddNewModalGroup(true)}}>
            <Text style={styles.modalButtonText}>Group</Text>
          </TouchableOpacity> */}
          {usersToDisplay}
          <TouchableOpacity style={styles.modalButton} onPress={()=>{setAddNewModal(false);console.log("pressed close")}}>
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


const ConvoCard= (props) =>{
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [lastMessage, setLastMessage] = useState('')
  const [lastMessageTime, setLastMessageTime] = useState('')
  const [lastMessageDate, setLastMessageDate] = useState('')
  const [lastMessageUser, setLastMessageUser] = useState('')
  const [lastMessageUserImage, setLastMessageUserImage] = useState('')
  const [lastMessageUserEmail, setLastMessageUserEmail] = useState('')

 
useEffect(() => {
      const tempMessages= query(collection(db, props.name.Name), orderBy('createdAt', 'desc'));
      const querySnapshot = getDocs(tempMessages).then((querySnapshot) => {
      onSnapshot(tempMessages, (snapshot) => {setMessages(
        snapshot.docs.map(doc => ({
          _id: doc.data()._id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        }))
      )});
    });
    
}, [navigation]);

useEffect(() => {
  if(messages.length>0){
    setLastMessage(messages[0].text)
    let string = messages[0].createdAt.toString()
    const res= string.split(' ')
    const date= res[1]+' '+res[2]+' '+res[3]
    setLastMessageTime(res[4].split(':').slice(0,2).join(':'))
    setLastMessageDate(date)
    setLastMessageUser(messages[0].user.name)
    setLastMessageUserImage(messages[0].user.avatar)
    setLastMessageUserEmail(messages[0].user.email)
  }

}, [messages]);

  
  return (
    <>
    <View key={props.name.Name}>
      <TouchableOpacity style={styles.conCard} key={props.name.Name} onPress={() => navigation.navigate('ChatRoom', { name: props.name.Name, user: props.name.User })}>
        <View style={styles.conLeft}>
          <Image source={{ uri: props.name.image }} style={{ width: 65, height: 65, borderRadius: 54 }} />
        </View>
        <View style={styles.conMiddle}>
          <Text style={styles.conName}>{props.name.User ? props.name.User : props.name.Name}</Text>
          <Text style={styles.conLastMessage}>{lastMessage}</Text>
        </View>
        <View style={styles.conRight}>
          <Text style={styles.conBadgeText}>1</Text>
          <Text style={styles.conDate}>{lastMessageDate}</Text>
          <Text style={styles.conTime}>{lastMessageTime}</Text>
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
    backgroundColor:'#fff'
  },
  conName: {
    fontSize: 20,
    fontFamily:'Urbanist-SemiBold',
    marginBottom: 5,
  },
  conCard: {
    width: ScreenWidth * 0.9,
    height: ScreenHeight * 0.13,
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
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'center',
    width: ScreenWidth * 0.2,
  },
  conTime: {
    fontSize: 12,
    fontFamily:'Urbanist-Regular',
  },
  conDate:{
    fontSize: 12,
    fontFamily:'Urbanist-Regular',
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
    width: ScreenWidth*0.9,
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
})
