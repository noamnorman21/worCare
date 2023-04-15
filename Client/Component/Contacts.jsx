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
import { MaterialCommunityIcons, AntDesign, Feather, Octicons } from '@expo/vector-icons';

import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from "react-native-popup-menu";

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Contacts() {
  const stack = createStackNavigator();
  return (
    <MenuProvider>
      <stack.Navigator initialRouteName='Main' screenOptions={{ headerShown: false }} >
        <stack.Screen name="Main" component={Main} options={{ headerShown: true, headerTitle: "Contacts", headerTitleAlign: 'center' }} />
        <stack.Screen name="Contact" component={Contact} options={{ headerShown: true, headerTitle: "Edit Contact", headerTitleAlign: 'center' }} />
      </stack.Navigator>
    </MenuProvider>
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
    const data = await response.json();

    let contacts = data.map((item) => {
      return <ContactCard key={item.contactId} contact={item} fetchContacts={fetchContacts} />
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
        <AddNewContact patientId={patientId} cancel={() => { setModal1Visible(false); fetchContacts() }} />
      </Modal>
    </View>
  )
}

function ContactCard(props) {
  const navigation = useNavigation();

  const openModal = (value) => {
    if (value == 1) {
      console.log("Email")
    }
    else if (value == 2) {
      console.log("call")
    }
    if (value == 3) {
      navigation.navigate('Contact', { contact: props.contact })
    }
    if (value == 4) {
      DeleteContact()
    }
  }

  const DeleteContact = () => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this contact?',
      [
        { text: "Don't Delete", style: 'cancel', onPress: () => { } },
        {
          text: 'Delete',
          style: 'destructive',
          // If the user confirmed, then we dispatch the action we blocked earlier
          // This will continue the action that had triggered the removal of the screen
          onPress: () => {
            fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Contacts/DeleteContact/', {
              method: 'DELETE',
              body: JSON.stringify(props.contact),
              headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
              })
            })
              .then(res => {
                return res.json()
              })
              .then(
                (result) => {
                  console.log("fetch POST= ", result);
                  Alert.alert("Contact "+props.contact.contactName +" Deleted Successfully")
                  props.fetchContacts();                
                },
                (error) => {
                  console.log("err post=", error);
                });
          }
        },
      ]
    );
  }
  return (
    <Menu onSelect={value => openModal(value)} renderer={renderers.SlideInMenu} >
      <MenuTrigger
        children={<View style={styles.contactcard}>
          <Text style={styles.name}>{props.contact.contactName}</Text>
          <Text style={styles.number}>{props.contact.mobileNo}</Text>
        </View>}
      />
      <MenuOptions

        style={{ marginBottom: SCREEN_HEIGHT * 0.03 }}
        customStyles={{
          optionsContainer: {
            borderRadius: 10,
            elevation: 100,
          },
          // optionsWrapper: newStyles.optionsWrapper,
        }}
      >
        <MenuOption value={1} children={<View style={styles.options}><MaterialCommunityIcons name='bell-ring-outline' size={20} /><Text style={styles.optionsText}> Send Email</Text></View>} />
        <MenuOption value={2} children={<View style={styles.options}><Feather name='eye' size={20} /><Text style={styles.optionsText}> Call Contact</Text></View>} />
        <MenuOption value={3} children={<View style={styles.options}><Feather name='edit' size={20} /><Text style={styles.optionsText}> Edit Contact</Text></View>} />
        <MenuOption value={4} children={<View style={styles.options}><Feather name='trash-2' size={20} color='#FF3C3C' /><Text style={styles.deleteTxt}> Delete Contact</Text></View>} />
      </MenuOptions>
    </Menu>
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
  options: {
    flexDirection: 'row',
    borderBottomColor: '#80808080',
    borderBottomWidth: 0.2,
    padding: 7,
    fontFamily: 'Urbanist-Medium',
  },
  optionsText: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 16,
  },
  optionsWrapper: {
    position: 'absolute',
    flexDirection: 'column',
    top: -120,
    backgroundColor: '#fff',
    borderRadius: 10,
    left: SCREEN_WIDTH * 0.09,
    elevation: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  deleteTxt: {
    color: '#FF3C3C',
    fontFamily: 'Urbanist-Medium',
    fontSize: 16,
  },
});