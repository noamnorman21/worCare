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
  const [Contacts, setContacts] = useState([])
  const [Search, setSearch] = useState([])
  const [ContactToRender, setContactToRender] = useState([])
  const [modal1Visible, setModal1Visible] = useState(false);
  const { userContext, userContacts, setuserContacts, updateuserContacts } = useUserContext()
  const PatientId = 779355403// will change when we finish context to get the patient id
  const isFocused = useIsFocused()
  const [list, setList] = useState([
    [
        {
            "contactId": 1,
            "contactName": "Eugen",
            "phoneNo": "123424",
            "mobileNo": "0543122662",
            "email": "C3P9VDO@IKEJ1PV.V57CXJAMSA9LH8",
            "role": "4BVQEDUCIM6V1K6RMO8PZ2PM7TPAU6OESMH37NIT2",
            "contactComment": "sed Tam eudis quad apparens regit, brevens, e",
            "patientId": "151515151"
        },
        {
            "contactId": 3,
            "contactName": "Gail",
            "phoneNo": null,
            "mobileNo": "4721674483",
            "email": "I9GSSGNO2A@1VMX0MW.YRCNMBC",
            "role": "23JY6ENHQLBM4W1Z5MFGEGHX4X5I0",
            "contactComment": "quad sed Versus non Sed ut imaginator sed quo",
            "patientId": "151515151"
        },
        {
            "contactId": 4,
            "contactName": "Elton0",
            "phoneNo": null,
            "mobileNo": "2530595961",
            "email": "KP5XQRUO2A@B80E6MF.4OO8FK8X2FNJOGZ",
            "role": "5JIAP5B2VKOQB0XWGRIH6BCL0MMLU894GPFS4U7WO2RVRO4GZ",
            "contactComment": "novum fecundio, dolorum plorum non plurissimum",
            "patientId": "151515151"
        },
        {
            "contactId": 8,
            "contactName": "William",
            "phoneNo": null,
            "mobileNo": "8384575168",
            "email": "FGAE1H94CLSC0ZEI@94MLSTC.03WRG7DDMA2SRW",
            "role": "2G8TAFULX0AR6W4P769U3",
            "contactComment": "et eggredior. Tam si quartu et quartu volcans",
            "patientId": "151515151"
        }
    ],
    [
        {
            "contactId": 16,
            "contactName": "Dominick115",
            "phoneNo": "2023260473",
            "mobileNo": "3130484901",
            "email": "KQ043O8@FS34BH4.PTYRHZS2ZIPYM",
            "role": "214JSEV94S9",
            "contactComment": "apparens Quad manifestum brevens, regit, quantare",
            "patientId": "162701067"
        },
        {
            "contactId": 24,
            "contactName": "Mason44",
            "phoneNo": null,
            "mobileNo": "1810027947",
            "email": "VSN0JS8@LA8BR8N97O.DDHV9531AUGASGX",
            "role": "TBY9MAO1BZ2L6VBZB23FRJL8E5EYHDKGS0652T4XNJDJJT368S",
            "contactComment": "linguens fecundio, egreddior funem. et pars",
            "patientId": "162701067"
        },
        {
            "contactId": 37,
            "contactName": "Shauna985",
            "phoneNo": null,
            "mobileNo": "9799683376",
            "email": "0455ODU@S13UOAD.QBZ3ZGU",
            "role": "W8WJ4O6ZI87LO4RNUEHJSRLQY1JHBEPYKPG5G",
            "contactComment": "rarendum et novum transit. Sed non gravis",
            "patientId": "162701067"
        }
    ]
])


  const onChangeSearch = query => setSearch(query);
  const fetchContacts = async () => {
  const user = {
    Id: userContext.Id,
    userType: userContext.userType,
  } 
  // new part when server is uploaded
    // fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Contacts/GetContacts/' + PatientId,
    //   {
    //     method: 'POST',
    //     headers: new Headers({
    //       'Content-Type': 'application/json; charset=UTF-8',
    //       }),
    //     body: JSON.stringify(user)
    //   })
    fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Contacts/GetContacts/' + PatientId)
      .then((response) => response.json())
      .then(json => {
        if (json != null) {
          let contacts = list.map((patient) => {
            return patient.map((item) => {
              return <ContactCard key={item.contactId} contact={item} />
            })
          })
          let idarr = list.map((patient) => {
            return patient.map((item) => {
              return item.patientId
            })
          })
          setidArr(idarr);
          setContacts(list);
          updateuserContacts(list);
          setContactToRender(contacts);
        }
      })
      .catch((error) => {
        console.error(error);
      }
      );


    //replace the fetch with this when the server is ready
    // fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Contacts/GetContacts/', {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(userContext.Id, userContext.userType),
    // })
    // .then((response) => response.json())
    // . .then(json => {
    //     if (json != null) {
    //       let contacts = list.map((patient) => {
    //        return patient.map((item) => {
    //          console.log("IIII",item)
    //          return <ContactCard key={item.contactId} contact={item}  />
    //      })
    //    })

    //      setContacts(list);
    //      console.log(contacts)
    //      setContactToRender(contacts);
    //    }
    //  })
    // .catch((error) => {
    //   console.error(error);
    // }
    // );
  }

  useEffect(() => {
    let temp = Contacts.map((patient) => {
      return patient.filter((item) => {
        return item.contactName.includes(Search)
      })
    })
    let contacts = temp.map((patient) => {
      return patient.map((item) => {
        return <ContactCard key={item.contactId} contact={item} />
      })
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
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={Search}
        icon="magnify"
      />
      {ContactToRender}
      {userContext.userType=="User"? <TouchableOpacity style={styles.button} mode="fixed" onPress={() => setModal1Visible(true)}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>: null}
      {/*NewContactModal*/}
      <Modal animationType="slide" visible={modal1Visible}>
        <AddNewContact cancel={() => {
          setModal1Visible(false); fetchContacts()
        }} idArr={idArr} />
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
    marginTop: -20,
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
    backgroundColor: '#E6EBF2',
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
    width: Dimensions.get('window').width * 0.4,
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
    width: Dimensions.get('window').width * 0.4,
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
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelbuttonText: {
    color: 'black',
    fontWeight: '600',
    fontSize: 16,
  },
});

