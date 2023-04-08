// Path: Client\Component\Contact.jsx
// Contact Page
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert, TextInput } from 'react-native'
import { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Contact({ route, navigation }) {

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

  

  const Cancel = () => {
    Alert.alert(
      'Cancel Changes',
      'are you sure you want to Exit the Page? All changes will be lost',
      [
        { text: "Don't leave", style: 'cancel', onPress: () => { } },
        {
          text: 'Leave',
          style: 'destructive',
          // If the user confirmed, then we dispatch the action we blocked earlier
          // This will continue the action that had triggered the removal of the screen
          onPress: () => navigation.popToTop()
        },
      ]
    );
  }
  const handleInputChange = (field, value) => {
    setContact({ ...Contact, [field]: value });
    if (!isChanged) {
      setIsChanged(true);
    }
  }

  const validatePhoneNum = (phoneNum) => {
    //only numbers allowed in phone number input - no spaces or dashes - 10 digits - starts with 0
    const phoneNumRegex = /^(0)[0-9]{9}$/
    return phoneNumRegex.test(phoneNum)
  }
  const validateEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/
    return emailRegex.test(email)
  }
  const validateInput = () => {
    const { email, mobileNo, contactName } = Contact
    if (!mobileNo || !contactName) {
      return Alert.alert('Error', 'Email and Mobile Number are required')
    }
    if (email !== null) {
      console.log('email', email)
      if (!validateEmail(email)) {
        return Alert.alert('Invalid Email', 'Please enter a valid email')
      }
    }
    if (contactName === '') {
      return Alert.alert('Invalid Contact Name', 'Please enter a valid contact name')
    }
    if (!validatePhoneNum(mobileNo)) {
      return Alert.alert('Invalid Phone Number', 'Please enter a valid phone number')
    }
    SaveChanges(Contact);
  }
  const SaveChanges = () => {
    let urlContact = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Contacts/UpdateContact/';
    fetch(urlContact, {
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
          navigation.goBack();
        },
        (error) => {
          console.log("err post2=", error);
        });
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
                <Text style={styles.contactheader}>Phone number(optional):</Text>
                <TextInput
                  style={[styles.input, styles.numInput]}
                  value={Contact.phoneNo}
                  keyboardType='ascii-capable'
                  onChangeText={(value) => handleInputChange('phoneNo', value)}
                />
              </View>
              <View>
                <Text style={styles.contactheader}>Mobile number:</Text>
                <TextInput
                  style={[styles.input, styles.numInput]}
                  value={Contact.mobileNo}
                  keyboardType='ascii-capable'
                  onChangeText={(value) => handleInputChange('mobileNo', value)}
                />
              </View>
              <Text style={styles.contactheader}>Role:</Text>
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
            <View style={styles.bottom}>
              <TouchableOpacity style={styles.savebutton} onPress={validateInput}>
                <Text style={styles.savebuttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelbutton} onPress={Cancel}>
                <Text style={styles.cancelbuttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.Deletebutton} onPress={DeleteContact}>
              <Text style={styles.cancelbuttonText}>Delete</Text>
            </TouchableOpacity>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  inputContainer: {
    width: SCREEN_WIDTH * 0.95,
    marginTop: 10,
  },
  input: {
    width: Dimensions.get('window').width * 0.95,
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
  cancelbutton: {
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
  Deletebutton: {
    width: Dimensions.get('window').width * 0.85,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#548DFF',
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
    justifyContent: 'space-between',
    width: SCREEN_WIDTH * 0.95,
  },
  savebuttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
  },
  cancelbuttonText: {
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
  Deletebutton: {
    width: Dimensions.get('window').width * 0.95,
    backgroundColor: '#F5F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#548DFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 1,
    marginTop: 10,
    height: 45,
  },
});