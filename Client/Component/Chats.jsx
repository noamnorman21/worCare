import { View, Text, StyleSheet, Dimensions,Image } from 'react-native'
import { useCallback, useState, useLayoutEffect } from 'react'
import { useIsFocused } from '@react-navigation/native';
import { auth, db } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { GiftedChat } from 'react-native-gifted-chat';
import { collection, addDoc, getDocs, query, orderBy, onSnapshot, listCollection } from 'firebase/firestore';
import { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { useUserContext } from '../UserContext';
import { Feather } from '@expo/vector-icons';

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
    const q = query(collection(db, route.params.name), orderBy('createdAt', 'desc'));    
    const unsubscribe = onSnapshot(q, (snapshot) => setMessages(
      snapshot.docs.map(doc => ({
        _id: doc.data()._id,
        createdAt: doc.data().createdAt.toDate(),
        text: doc.data().text,
        user: doc.data().user,
      }))
    ));

    return () => {
      unsubscribe();
    };

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
    />
  );
}


function MainRoom ({navigation}) {
  const [names, setNames] = useState([])
  const [namesToDisplay, setNamesToDisplay] = useState([])
  const { userContext, userConvo } = useUserContext();

  useLayoutEffect(() => {
    console.log()
    const tempNames= query(collection(db, auth.currentUser.email));
    const getNames = onSnapshot(tempNames, (snapshot) => setNames(
      snapshot.docs.map(doc => ({
        key: doc.data.Name,
        Name: doc.data().Name,
        User: doc.data().User,
      }))
    ))
    return () => {
      getNames();
    }
  }, [navigation]);

  useEffect(() => {
    const renderNames = () => {
      console.log('names', names)
      setNamesToDisplay(names.map((name) => (
        // <Text key={name.Name}>{name.Name} aaa</Text>
        <View key={name.Name}>
        <TouchableOpacity style={styles.conCard} key={name.Name} onPress={() => navigation.navigate('ChatRoom', {name: name.Name})}> 
        <View style={styles.conLeft}>
        <Image source={{ uri: userContext.userUri }} style={{ width: 65, height: 65, borderRadius:54 }} />
        </View>
        <View style={styles.conMiddle}>
        <Text style={styles.conName}>{name.User? name.User:name.Name}</Text>
        <Text style={styles.conLastMessage}>last message</Text>
        </View>
        <View style={styles.conRight}>
        <Text style={styles.conBadgeText}>1</Text>
        <Text style={styles.conTime}>time</Text>
        </View>     
        </TouchableOpacity>
        <View style={styles.lineContainer}>
        <View style={styles.line} />
      </View>  
      </View>
      )))}
    renderNames();
  }, [names]);

  const addNewChat = () => {
    const contact="amitaiamitai@gmail.com"
    addDoc(collection(db, auth.currentUser.email), { Name: auth.currentUser.email+"+"+contact, User: "Amitai"});
    addDoc(collection(db, contact), { Name: auth.currentUser.email+"+"+contact, User:userContext.FirstName});
    navigation.navigate('ChatRoom', {name: auth.currentUser.email+"+"+contact})
    
    console.log("add new chat")
  }

  return (
    <View style={styles.container}>
      <View style={styles.top}>
      <Text style={styles.header}>Chat Room</Text>
      <Feather name='edit' size={20} onPress={()=>addNewChat()} />
      </View>
      <ScrollView>    
      {namesToDisplay}
      </ScrollView> 
    </View>
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
    alignItems: 'center'
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
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    width: ScreenWidth * 0.2,
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
  
})
