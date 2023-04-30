import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert, Modal,ScrollView } from 'react-native'
import { useEffect, useState } from 'react'
import React from 'react'
import { Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import AddNewContact from './ContactComponents/AddNewContact'
import { useIsFocused } from '@react-navigation/native';
import EditContact from './ContactComponents/editContact'
import ContactDetails from './ContactComponents/ContactDetails'
import { useUserContext } from '../UserContext'
import { MaterialCommunityIcons, Feather, Octicons, Ionicons } from '@expo/vector-icons';
import { AddBtn } from './HelpComponents/AddNewTask';


const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Contacts() {
  const stack = createStackNavigator();
  return (
    <stack.Navigator initialRouteName='Main' screenOptions={{
      //this is the animation for the navigation
      ...TransitionPresets.SlideFromRightIOS,
      headerBlurEffect: 'light',
      headerShown: false
    }} >
      <stack.Screen name="Main" component={Main} options={{ headerShown: true, headerTitle: "Contacts", headerTitleAlign: 'center' }} />
      <stack.Screen name="EditContact" component={EditContact} options={{ headerShown: true, headerTitle: "Edit Contact", headerTitleAlign: 'center' }} />
      <stack.Screen name="ContactDetails" component={ContactDetails} options={{ headerShown: true, headerTitle: "Contact Details", headerTitleAlign: 'center', animationEnabled: true, animation: 'slide_from_right' }} />
    </stack.Navigator>
  )
}

function Main({ navigation }) {
  const [idArr, setidArr] = useState([])

  const [Contacts, setContacts] = useState([])
  const [Search, setSearch] = useState([])
  const [ContactToRender, setContactToRender] = useState([])
  const [addModalVisible, setaddModalVisible] = useState(false);
  const { userContext, userContacts, setuserContacts, updateuserContacts } = useUserContext()
  const [patientId, setpatientId] = useState(userContext.patientId)
  const isFocused = useIsFocused()

  const onChangeSearch = query => setSearch(query);
  const fetchContacts = async () => {
    const user = {
      userId: userContext.userId,
      userType: userContext.userType,
    }
    // new part when server is uploaded
    const response = await fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Contacts/GetContacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user)
    });
    const data = await response.json();
    if (data.length > 0) {
    let contacts = data.map((item) => {
      return <ContactCard key={item.contactId} contact={item} fetchContacts={fetchContacts} />
    })
    setContacts(data);
    setContactToRender(contacts);
  }
  else {
    setContacts([])
    setContactToRender([])
    setaddModalVisible(true)
  }
}

  useEffect(() => {
    let temp = Contacts.filter((item) => {
      return item.contactName.includes(Search)
    })
    let contacts = temp.map((item) => {
      return <ContactCard key={item.contactId} contact={item} />
    })
    setContactToRender(contacts);
  }, [Search])

  useEffect(() => {
    if (isFocused) {
      fetchContacts();
    }
  }, [isFocused])

  return (
    <View style={styles.container}>
      <Searchbar style={styles.searchBar}
        placeholder="Search..."
        onChangeText={onChangeSearch}
        value={Search}
        icon={(() => (<Octicons name="search" size={28} color="#808080" />))}
        inputStyle={{ fontFamily: 'Urbanist-Medium', fontSize: 18 }}
        placeholderTextColor="#808080"
      />
      <ScrollView alwaysBounceVertical={false}>
        {ContactToRender}
      </ScrollView>
      <View style={styles.addBtnView}><AddBtn onPress={() => setaddModalVisible(true)} /></View>
      {/*NewContactModal*/}
      <Modal animationType="slide" visible={addModalVisible}>
        <AddNewContact contacts={Contacts} patientId={patientId} cancel={() => fetchContacts()} closeModal={()=> setaddModalVisible(false)} goBack={()=>navigation.goBack()}  />
      </Modal>
    </View>
  )
}

function ContactCard(props) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity style={styles.contactcard} onPress={() => navigation.navigate('ContactDetails', { contact: props.contact })} >
      <Text style={styles.name}>{props.contact.contactName}</Text>
      <Text style={styles.number}>{props.contact.mobileNo? props.contact.mobileNo:props.contact.phoneNo}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contact: {
    justifyContent: 'center',
  },
  contactheader: {
    fontSize: 18,
    color: '#000',
    borderBottomColor: '#B9B9B9',
    borderBottomWidth: 1,
    borderRadius: 10,
    margin: 10,
    padding: 10,
    textAlign: 'left',
  },
  contacttext: {
    fontSize: 14,
    textAlign: 'left',
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomColor: '#B9B9B9',
    borderBottomWidth: 0.4,
    marginTop: 10,
    marginLeft: 0,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  addBtnView: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  contactcard: {
    backgroundColor: '#fff',
    height: 60,
    marginTop: 0,
    margin: 10,
    padding: 10,
    textAlign: 'left',
    borderBottomWidth: 1,
    borderBottomColor: '#B9B9B9',
  },
  name: {
    fontSize: 17,
    color: '#000',
    fontFamily: 'Urbanist-Medium',
  },
  number: {
    fontSize: 14,
    color: '#8A8A8D',
    fontFamily: 'Urbanist-Regular',
  },
  searchBar: {
    margin: 10,
    borderRadius: 16,
    backgroundColor: '#EEEEEE',
    borderWidth: 1.5,
    fontFamily: 'Urbanist-Medium',
    borderColor: '#E6EBF2',
    height: Dimensions.get('window').height * 0.06,
  },
});