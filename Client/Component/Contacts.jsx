import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert, Modal } from 'react-native'
import { useEffect, useState } from 'react'
import React from 'react'
import { Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AddNewContact from './ContactComponents/AddNewContact'
import { useIsFocused } from '@react-navigation/native';
import Contact from './ContactComponents/Contact'
import { useUserContext } from '../UserContext'
import { Octicons } from '@expo/vector-icons';
export default function Contacts() {
  const stack = createStackNavigator();
  return (
    <stack.Navigator initialRouteName='Main' screenOptions={{ headerShown: false }} >
      <stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
      <stack.Screen name="Contact" component={Contact} options={{ headerShown: false }} />
    </stack.Navigator>
  )

}

function Main({ navigation }) {
  const [idArr, setidArr] = useState([])
  const [patientId, setpatientId] = useState()
  const [Contacts, setContacts] = useState([])
  const [Search, setSearch] = useState([])
  const [ContactToRender, setContactToRender] = useState([])
  const [modal1Visible, setModal1Visible] = useState(false);
  const { userContext, userContacts, setuserContacts, updateuserContacts } = useUserContext()  
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
    const data =await response.json();
  
    let contacts = data.map((item) => {      
        return <ContactCard key={item.contactId} contact={item} />  
    })
    let idarr = data.map((item) => {      
        return item.patientId
    })
    setpatientId(idarr[0]);    
    setContacts(data);
    setContactToRender(contacts);
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
      {ContactToRender}
      <TouchableOpacity style={styles.button} mode="fixed" onPress={() => setModal1Visible(true)}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
      {/*NewContactModal*/}
      <Modal animationType="slide" visible={modal1Visible}>
        <AddNewContact patientId={patientId}cancel={() => { setModal1Visible(false); fetchContacts() }} />
      </Modal>
    </View>
  )
}

function ContactCard(props) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity style={styles.contactcard} onPress={() => navigation.navigate('Contact', { contact: props.contact })}>
      <Text style={styles.name}>{props.contact.contactName}</Text>
      <Text style={styles.number}>{props.contact.mobileNo}</Text>
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
  details: {
    marginTop: -20, // fix style
    margin: 10,
    padding: 10,
    textAlign: 'left',
  },
  detailsheader: {
    fontSize: 15,
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
  button: {
    borderRadius: 54,
    backgroundColor: '#548DFF',
    width: 64,
    height: 64,
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 10,
    right: Platform.OS === 'ios' ? 15 : 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 30,
    color: '#fff',
  },
  savebutton: {
    width: Dimensions.get('window').width * 0.45,
    backgroundColor: '#548DFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'lightgray',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 1,
    margin: 7,
    height: 45,
  },
  cancelbutton: {
    width: Dimensions.get('window').width * 0.45,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'lightgray',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 1,
    margin: 7,
    height: 45,
  },
  bottom: {
    flexDirection: 'row',
    marginTop: 20,
  },
  savebuttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
  },
  cancelbuttonText: {
    color: '#000',
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
  },
});