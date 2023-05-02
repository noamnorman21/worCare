import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert, ScrollView, Linking } from 'react-native'
import { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { MaterialCommunityIcons, AntDesign, Feather, Octicons } from '@expo/vector-icons';
import { useUserContext } from "../../UserContext";
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function ContactDetails({ route, navigation }) {
  const [isChanged, setIsChanged] = useState(false);
const { fetchUserContacts } = useUserContext()
  const [Edit, setEdit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [Contact, setContact] = useState({
    contactId: route.params.contact.contactId,
    contactName: route.params.contact.contactName,
    phoneNo: route.params.contact.phoneNo,
    mobileNo: route.params.contact.mobileNo,
    email: route.params.contact.email,
    role: route.params.contact.role,
    contactComment: route.params.contact.contactComment,
    patientId: route.params.contact.patientId // will change when we finish context to get the patient id
  })

  useEffect(() => {
    if (Edit) {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity style={styles.headerButton} onPress={() => setSaving(true)}>
            <Text style={styles.headerButtonText}>Save</Text>
          </TouchableOpacity>
        ),
        headerTitle: "Edit Contact Details",
      });
    }
    else {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity style={styles.headerButton} onPress={() => setEdit(true)}>
            <Text style={styles.headerButtonText}>Edit</Text>
          </TouchableOpacity>
        ),
        headerLeft: () => (
          <TouchableOpacity style={styles.backBtn} onPress={() => setCancel(true)}>
            <Ionicons name="chevron-back" size={28} color="black" />
          </TouchableOpacity>
        ),
        headerTitle: "Contact Details",

      });
    }
  }, [Edit]);

  useEffect(() => {
    if (saving && isChanged) {
      validateInput();
    }
    else if (saving && !isChanged) {
      setSaving(false);
      setEdit(false);
    }
    else {
      setSaving(false);
    }
  }, [saving]);

  useEffect(() => {
    if (cancel) {
      Cancel();
    }
  }, [cancel]);

  const Cancel = () => {
    if (isChanged) {
      Alert.alert(
        'Cancel Changes',
        'Are you sure you want to cancel changes?',
        [
          {
            text: 'Yes',
            onPress: () => {
              setEdit(false);
              setCancel(false);
              setSaving(false);
              navigation.goBack();
            }
          },
          {
            text: 'No',
            onPress: () => {
              setCancel(false);
            }
          }
        ]
      )
    }
    else {
      navigation.goBack();
    }
  }

  const handleInputChange = (field, value) => {
    setContact({ ...Contact, [field]: value });

    if (field == 'email' && value == '') {
      setContact({ ...Contact, [field]: null });
    }
    if (Contact != route.params.contact) {
      setIsChanged(true)
    }
  }

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]*$/
    return phoneRegex.test(phone)
  }

  const validateEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/
    return emailRegex.test(email)
  }

  const validateInput = () => {
    const { email, contactName, mobileNo, phoneNo } = Contact
    console.log(email)
    console.log(Contact)
    if (!contactName) {
      return Alert.alert('Invalid Contact Name', 'Please enter a valid contact name')
    }
    if (email !== null && email !== '' && email != ' ' && !validateEmail(email)) {
      console.log("email = ", email)
      setSaving(false);
      return Alert.alert('Invalid Email', 'Please enter a valid email')
    }
    if (Contact.email === '') {
      setContact({ ...Contact, email: null })
    }
    if (!mobileNo && !phoneNo) {
      console.log("mobileNo = ", mobileNo)
      console.log("phoneNo = ", phoneNo)
      setSaving(false);
      return Alert.alert('Invalid Phone Number', 'Please enter a valid mobile or Telephone number')
    }
    saveContact(Contact);
  }

  const saveContact = () => {
    console.log("contact to save = ", Contact)
    let urlContactUpdate = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Contacts/UpdateContact/';
    fetch(urlContactUpdate, {
      method: 'PUT',
      body: JSON.stringify(Contact),
      headers: new Headers({ 'Content-Type': 'application/json; charset=UTF-8' })
    })
      .then(res => {
        if (res.status === 200) {
          console.log('contact updated');
          return res.json();
        }
        else {
          Alert.alert('Something went wrong', 'Please try again');
          console.log('cannot update contact');
        }
      })
      .then(
        (result) => {
          console.log("fetch POST= ", result);
          Alert.alert('Contact Saved', 'The contact was saved successfully');
          setSaving(false);
          setEdit(false);
          setIsChanged(false);
          fetchUserContacts();
        },
        (error) => {
          console.log("err post2=", error);
        });
  }

  const deleteContact = () => {
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
                  if (result === 1) {
                    Alert.alert('Contact Deleted', 'The contact was deleted successfully');
                  }
                  fetchUserContacts();
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

  const optionsToCall = () => {
    if (!Contact.mobileNo && !Contact.phoneNo) {
      return Alert.alert('No Phone Number', 'This contact has no phone number');
    }
    if (Contact.mobileNo && !Contact.phoneNo) {
      return Linking.openURL(`tel:${Contact.mobileNo}`)
    }
    if (!Contact.mobileNo && Contact.phoneNo) {
      return Linking.openURL(`tel:${Contact.phoneNo}`)
    }

    Alert.alert(
      'Call',
      'Choose a number to call',
      [
        { text: "Close", style: 'cancel', onPress: () => { } },
        {
          text: Contact.mobileNo ? Contact.mobileNo : Contact.phoneNo,
          onPress: () => {
            Linking.openURL(`tel:${Contact.mobileNo ? Contact.mobileNo : Contact.phoneNo}`)
          }
        },
        {
          text: Contact.phoneNo ? Contact.phoneNo : Contact.mobileNo,
          onPress: () => {
            Linking.openURL(`tel:${Contact.phoneNo ? Contact.phoneNo : Contact.mobileNo}`)
          }
        },
      ]
    );
  }

  const optionsToSMS = () => {
    if (!Contact.mobileNo && !Contact.phoneNo) {
      return Alert.alert('No Phone Number', 'This contact has no phone number');
    }
    if (Contact.mobileNo && !Contact.phoneNo) {
      return Linking.openURL(`sms:${Contact.mobileNo}`)
    }
    if (!Contact.mobileNo && Contact.phoneNo) {
      return Linking.openURL(`sms:${Contact.phoneNo}`)
    }

    Alert.alert(
      'SMS',
      'Choose a number to send SMS',
      [
        { text: "Close", style: 'cancel', onPress: () => { } },
        {
          text: Contact.mobileNo ? Contact.mobileNo : Contact.phoneNo,
          onPress: () => {
            Linking.openURL(`sms:${Contact.mobileNo ? Contact.mobileNo : Contact.phoneNo}`)
          }
        },
        {
          text: Contact.phoneNo ? Contact.phoneNo : Contact.mobileNo,
          onPress: () => {
            Linking.openURL(`sms:${Contact.phoneNo ? Contact.phoneNo : Contact.mobileNo}`)
          }
        },
      ]
    );
  }

  

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
          <ScrollView contentContainerStyle={styles.centeredView}>
            {!Edit && <Text style={styles.contactheader}>{Contact.contactName}</Text>}
            {!Edit && <View style={styles.ButtonView}>
              <TouchableOpacity style={Contact.email ? styles.button : styles.disabled} disabled={Contact.email ? false : true}
                onPress={() => Linking.openURL(`mailto:${Contact.email}`)}>
                <MaterialCommunityIcons name='email-send-outline' size={20} color={Contact.email ? "#548DFF" : "grey"} />
                <Text style={Contact.email ? styles.BtnTxt : styles.disabledBtnTxt}>Email</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}
                onPress={optionsToCall}>
                <Feather name='phone-call' size={20} color={"#548DFF"} />
                <Text style={styles.BtnTxt}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}
                onPress={optionsToSMS}>
                <Feather name='message-circle' size={20} color={"#548DFF"} />
                <Text style={styles.BtnTxt}>Message</Text>
              </TouchableOpacity>

            </View>}
            <View style={styles.inputContainer}>
              {Edit &&
                <TextInput style={styles.inputTxt}
                  editable={Edit ? true : false}
                  mode='outlined'
                  label='Full Name'
                  value={Contact.contactName}
                  onChangeText={(val) => handleInputChange('contactName', val)}
                  placeholder="Type Something..."
                  outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
                  activeOutlineColor="#548DFF"
                  outlineColor='#E6EBF2' />
               }
              <TextInput style={styles.inputTxt}
                editable={Edit ? true : false}
                mode='outlined'
                label='Mobile Number'
                value={Contact.mobileNo}
                onChangeText={(val) => handleInputChange('mobileNo', val)}
                placeholder="Type Something..."
                outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
                activeOutlineColor="#548DFF"
                outlineColor='#E6EBF2' />
              <TextInput style={styles.inputTxt}
                editable={Edit ? true : false}
                mode='outlined'
                label='Phone Number'
                value={Contact.phoneNo}
                onChangeText={(val) => handleInputChange('phoneNo', val)}
                placeholder="Type Something..."
                outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
                contentStyle={{ fontFamily: 'Urbanist-Regular' }}
                activeOutlineColor="#548DFF"
                outlineColor='#E6EBF2' />
              <TextInput style={styles.inputTxt}
                editable={Edit ? true : false}
                mode='outlined'
                label='Email Address'
                value={Contact.email}
                onChangeText={(val) => handleInputChange('email', val)}
                placeholder="Type Something..."
                contentStyle={{ fontFamily: 'Urbanist-Regular' }}
                outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
                activeOutlineColor="#548DFF"
                outlineColor='#E6EBF2' />
              <TextInput style={styles.inputTxt}
                editable={Edit ? true : false}
                mode='outlined'
                label='Role'
                value={Contact.role}
                onChangeText={(val) => handleInputChange('role', val)}
                outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
                activeOutlineColor="#548DFF"
                placeholder="Type Something..."
                contentStyle={{ fontFamily: 'Urbanist-Regular' }}
                outlineColor='#E6EBF2' />
              <TextInput style={styles.inputTxt}
                editable={Edit ? true : false}
                mode='outlined'
                label='Comment'
                value={Contact.comment}
                onChangeText={(val) => handleInputChange('comment', val)}
                placeholder="Type Something..."
                multiline
                numberOfLines={4}
                maxLength={300}
                contentStyle={{ height: 100, fontFamily: 'Urbanist-Regular' }}
                outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
                activeOutlineColor="#548DFF"
                outlineColor='#E6EBF2' />

              <TouchableOpacity style={styles.deleteBtn} onPress={deleteContact}>
                <Text style={styles.deleteBtnTxt}>Delete Contact</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
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
  },
  input: {
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
  inputTxt: {
    fontFamily: 'Urbanist-Light',
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
    marginVertical: 10,
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
    paddingBottom: 10,
  },
  ButtonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH * 0.95,
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 16,
    height: 54,
    width: SCREEN_WIDTH * 0.3,
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
    height: 54,
    width: SCREEN_WIDTH * 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 1,
    opacity: 0.3,
  },
  deleteBtn: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingLeft: 10,
    flexDirection: 'row',
    width: SCREEN_WIDTH * 0.95,
    marginTop: SCREEN_HEIGHT * 0.03,
  },
  deleteBtnTxt: {
    color: '#FF3C3C',
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
  },
  headerButton: {
    width: SCREEN_WIDTH * 0.15,
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
  backBtn: {
    paddingLeft: 10,
  },
});