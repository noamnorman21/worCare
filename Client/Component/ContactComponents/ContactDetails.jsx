// Path: Client\Component\Contact.jsx
// Contact Page
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert, TextInput } from 'react-native'
import { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { MaterialCommunityIcons, AntDesign, Feather, Octicons } from '@expo/vector-icons';


const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function ContactDetails({ route, navigation }) {
  const { contact } = route.params;
  const [isChanged, setIsChanged] = useState(false);
  const [Contact, setContact] = useState({
    contactId: route.params.contact.contactId,
    contactName: route.params.contact.contactName,
    phoneNo: route.params.contact.phoneNo,
    mobileNo: route.params.contact.mobileNo,
    email: route.params.contact.email,
    role: route.params.contact.role,
    contactComment: route.params.contact.contactComment,
    patientId: 779355403 // will change when we finish context to get the patient id
  })

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('EditContact', { contact: route.params.contact })}>
          <Text style={styles.headerButtonText}>Edit</Text>
        </TouchableOpacity>
      ),
    });
  }, []);


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
              body: JSON.stringify(Contact),
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
                  navigation.goBack();
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
          <View style={styles.centeredView}>
            <Text style={styles.contactheader}>{Contact.contactName}</Text>
            <View style={styles.ButtonView}>
              <TouchableOpacity style={Contact.email ? styles.button : styles.disabled} disabled={Contact.email ? false : true} onPress={() => console.log("Email")}>
                <MaterialCommunityIcons name='email-send-outline' size={20} color={Contact.email ? "#548DFF" : "grey"} />
                <Text style={Contact.email ? styles.BtnTxt : styles.disabledBtnTxt}>Email</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => console.log("Call")}>
                <Feather name='phone-call' size={20} color={"#548DFF"} />
                <Text style={styles.BtnTxt}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => console.log("Message")}>
                <Feather name='message-circle' size={20} color={"#548DFF"} />
                <Text style={styles.BtnTxt}>Message</Text>
              </TouchableOpacity>

            </View>
            <View style={styles.inputContainer}>
            <View style={styles.input}><Text style={styles.inputTxtHeader}>Mobile</Text><Text style={styles.inputTxt}>{Contact.mobileNo}</Text></View>
              {Contact.phoneNo ? <View style={styles.input}><Text style={styles.inputTxtHeader}>Phone</Text><Text style={styles.inputTxt}>{Contact.phoneNo}</Text></View> : null}
              {Contact.email ? <View style={styles.input}><Text style={styles.inputTxtHeader}>Email</Text><Text style={styles.inputTxt}>{Contact.email}</Text></View> : null}
              {Contact.role ? <View style={styles.input}><Text style={styles.inputTxtHeader}>Role</Text><Text style={styles.inputTxt}>{Contact.role}</Text></View> : null}
              {Contact.contactComment ? <View style={styles.commentInput}><Text style={styles.inputTxtHeader}>Comment</Text><Text style={styles.inputTxt}>{Contact.contactComment}</Text></View> : null}
              <TouchableOpacity style={styles.deletebutton} onPress={DeleteContact}>
              <Text style={styles.deleteBtnTxt}>Delete Contact</Text>
            </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  centeredView: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  inputContainer: {
    width: SCREEN_WIDTH * 0.95,
    marginTop: 10,
  },
  input: {
    width: SCREEN_WIDTH * 0.95,
    marginBottom: 10,
    paddingLeft: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E6EBF2',
    shadowColor: '#000',
    height: 54,
    marginVertical: 15,
    fontFamily: 'Urbanist-Medium',
    fontSize: 16,
  },
  commentInput: {
    width: SCREEN_WIDTH * 0.95,
    marginBottom: 10,
    paddingLeft: 10,
    padding:8,
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E6EBF2',
    shadowColor: '#000',
    height: 'auto',
    marginVertical: 15,
    fontFamily: 'Urbanist-Medium',
    fontSize: 16,
  },
  inputTxt: {
    fontFamily: 'Urbanist-Light',
    fontSize: 16,
    marginVertical: 1,
  },
  inputTxtHeader: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 16,
    marginVertical: 1,
  },
  BtnTxt: {
    color: '#548DFF',
    textAlign: 'center',
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
  },
  disabledBtnTxt: {
    color: 'grey',
    textAlign: 'center',
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
  },
  contactheader: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 30,
    marginTop: 20,

  },
  ButtonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH * 0.95,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 16,
    height: 45,
    width: SCREEN_WIDTH * 0.31,
    borderColor: '#548DFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 1,
  },
  disabled: {
    backgroundColor: 'lightgrey',
    borderRadius: 16,
    height: 45,
    width: SCREEN_WIDTH * 0.31,
    borderColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 1,
    opacity: 0.3,
  },
  deletebutton: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingLeft: 10,
    marginTop: SCREEN_HEIGHT*0.03,
  },
  deleteBtnTxt: {
    color: '#FF3C3C',
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
  },
  headerButton: {
    width: SCREEN_WIDTH * 0.1,
    height: SCREEN_HEIGHT * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
},
headerButtonText: {
  color: '#548DFF',
  fontFamily: 'Urbanist-SemiBold',
  fontSize: 16,
},
});