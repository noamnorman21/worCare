// Path: Client\Component\Contact.jsx
// Contact Page
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert, TextInput } from 'react-native'
import { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { AntDesign, Octicons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';


const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function EditContact({ route, navigation }) {
  const [saving, setSaving] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [Contact, setContact] = useState({
    contactId: route.params.contact.contactId,
    contactName: route.params.contact.contactName,
    phoneNo: route.params.contact.phoneNo,
    mobileNo: route.params.contact.mobileNo,
    email: route.params.contact.email,
    role: route.params.contact.role,
    contactComment: route.params.contact.contactComment,
    patientId: route.params.contact.patientId
  })

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={styles.headerButton} onPress={() => setSaving(true)}>
          <Text style={styles.headerButtonText}>Done</Text>
        </TouchableOpacity>

      ),
      headerLeft: () => (
        <TouchableOpacity style={styles.backBtn} onPress={() => setCancel(true)}>
            <Ionicons name="chevron-back" size={28} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (saving) {
      validateInput();
    }
    if (cancel) {
      Cancel();
    }
  }, [saving, cancel]);

  const Cancel = () => {
    if (isChanged) {
    Alert.alert(
      'Cancel Changes',
      'are you sure you want to Exit the Page? All changes will be lost',
      [
        { text: "Don't leave", style: 'cancel', onPress: () => {setCancel(false) } },
        {
          text: 'Leave',
          style: 'destructive',
          // If the user confirmed, then we dispatch the action we blocked earlier
          // This will continue the action that had triggered the removal of the screen
          onPress: () => navigation.goBack()
        },
      ]
    );
  }
  else {
    navigation.goBack()
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

  //validate that phone contains only digits
  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]*$/
    return phoneRegex.test(phone)
  }

  const validateEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/
    return emailRegex.test(email)
  }

  const validateInput = () => {
    const { email, contactName, mobileNo } = Contact
    if (!contactName) {
      return Alert.alert('Invalid Contact Name', 'Please enter a valid contact name')
      setSaving(false);
    }
    if (email !== null && email !== '' && !validateEmail(email)) {
      return Alert.alert('Invalid Email', 'Please enter a valid email')
      setSaving(false);
    }
    if (!mobileNo) {
      return Alert.alert('Mobile number is required', 'Please enter a valid mobile number')
      setSaving(false);
    }
    if (!validatePhone(mobileNo)) {
      return Alert.alert('Invalid Mobile Number', 'Please enter a valid mobile number')
      setSaving(false);
    }
    SaveChanges(Contact);
  }
  const SaveChanges = () => {
    let urlContactUpdate = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Contacts/UpdateContact/';
    fetch(urlContactUpdate, {
      method: 'PUT',
      body: JSON.stringify(Contact),
      headers: new Headers({ 'Content-Type': 'application/json; charset=UTF-8' })
    })
      .then(res => {
        return res.json()
      })
      .then(
        (result) => {
          console.log("fetch POST= ", result);
          navigation.popToTop();
        },
        (error) => {
          console.log("err post2=", error);
        });
  }


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
          <View style={styles.centeredView}>
            <Text style={styles.title}>Edit Contact Details</Text>
            <View style={[styles.inputContainer]}>
              <Text style={styles.contactheader}>Name:</Text>
              <TextInput
                style={styles.input}
                value={Contact.contactName}
                keyboardType='ascii-capable'
                onChangeText={(value) => handleInputChange('contactName', value)}
              />
               <View>
                <Text style={styles.contactheader}>Mobile number:</Text>
                <TextInput
                  style={[styles.input, styles.numInput]}
                  value={Contact.mobileNo}
                  keyboardType='numeric'
                  onChangeText={(value) => handleInputChange('mobileNo', value)}
                />
              </View>
              <View>
                <Text style={styles.contactheader}>Phone number(optional):</Text>
                <TextInput
                  style={[styles.input, styles.numInput]}
                  value={Contact.phoneNo}
                  keyboardType='numeric'
                  onChangeText={(value) => handleInputChange('phoneNo', value)}
                />
              </View>
              <Text style={styles.contactheader}>Role(optional):</Text>
              <TextInput
                style={styles.input}
                value={Contact.role}
                keyboardType='ascii-capable'
                onChangeText={(value) => handleInputChange('role', value)}
              />
              <Text style={styles.contactheader}>Email(optional):</Text>
              <TextInput
                style={styles.input}
                value={Contact.email}
                keyboardType='ascii-capable'
                onChangeText={(value) => handleInputChange('email', value)}
              />
              <Text style={styles.contactheader}>Comment(optional):</Text>
              <TextInput
                style={styles.input}
                value={Contact.contactComment}
                keyboardType='ascii-capable'
                onChangeText={(value) => handleInputChange('contactComment', value)}
              />
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
    justifyContent: 'center',
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
    paddingLeft: 20,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E6EBF2',
    shadowColor: '#000',
    height: 54,
    fontFamily: 'Urbanist-Light',
    fontSize: 16,
  },
  savebutton: {
    backgroundColor: '#548DFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    width: SCREEN_WIDTH * 0.45,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 1,
  },
  deleteBtn: {
    backgroundColor: '#F5F8FF',
    borderRadius: 16,
    height: 45,
    width: SCREEN_WIDTH * 0.45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#548DFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 1,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH * 0.95,
  },
  savebuttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
  },
  deleteBtnTxt: {
    color: '#548DFF',
    textAlign: 'center',
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Urbanist-Bold',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactheader: {
    fontFamily: 'Urbanist-Bold',
    marginLeft: 7,
    textAlign: 'left',
  },
  numbersInput: {
    flexDirection: 'row',
  },
  headerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10,
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