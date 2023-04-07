import { Alert, View, StyleSheet, Text, SafeAreaView, TextInput, Dimensions, TouchableOpacity } from "react-native"
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useState, useEffect } from "react"
import { useUserContext } from "../../UserContext";

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function AddNewContact(props) {
  const [Contact, setContact] = useState({
    contactName: '',
    phoneNo: '',
    mobileNo: '',
    email: null,
    role: '',
    contactComment: '',
    patientId: null // will change when we finish context to get the patient id
  })

  const handleInputChange = (field, value) => {
    setContact({ ...Contact, [field]: value });
  }

  const validateInput = () => {
    if (!Contact.mobileNo || !Contact.contactName) {
      return Alert.alert('Error', 'Email and Mobile Number are required')
    }
    if (Contact.email !== null && !validateEmail(Contact.email)) {
      return Alert.alert('Invalid Email', 'Please enter a valid email')
    }
    if (Contact.contactName === '') {
      return Alert.alert('Invalid Contact Name', 'Please enter a valid contact name')
    }
    if (!validatePhoneNum(Contact.mobileNo)) {
      return Alert.alert('Invalid Phone Number', 'Please enter a valid phone number')
    }
    if (Contact.patientId === null || Contact.patientId === undefined) {
      return Alert.alert('Invalid Patient Id', 'Please Choose Patient Id')
    }
    sendToDB();
  }

  const sendToDB = () => {
    fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Contacts/NewContact', {
      method: 'POST',
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
          Alert.alert("Contact added successfully");
          props.cancel();
        },
        (error) => {
          console.log("err post=", error);
        });
  }

  const validateEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/
    return emailRegex.test(email)
  }

  const validatePhoneNum = (phoneNum) => {
    //only numbers allowed in phone number input - no spaces or dashes - 10 digits - starts with 0
    const phoneNumRegex = /^(0)[0-9]{9}$/
    return phoneNumRegex.test(phoneNum)
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
          <View style={styles.centeredView}>
            <View>
              <Text style={styles.title}>Add New Contact</Text>
              <View style={styles.inputContainer}>
                <View >
                  <TextInput
                    style={styles.input}
                    placeholder="Contact Name"
                    keyboardType='ascii-capable'
                    onChangeText={(value) => handleInputChange('contactName', value)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    keyboardType='decimal-pad'
                    onChangeText={(value) => handleInputChange('phoneNo', value)}
                    returnKeyType='done'
                    inputMode='numeric'
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Mobile Number"
                    keyboardType='decimal-pad'
                    onChangeText={(value) => handleInputChange('mobileNo', value)}
                    returnKeyType='done'
                    inputMode='numeric'
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Role"
                    keyboardType='ascii-capable'
                    onChangeText={(value) => handleInputChange('role', value)}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Email (optional)"
                    keyboardType='ascii-capable'
                    onChangeText={(value) => handleInputChange('email', value)}
                  />
                  <TextInput
                    multiline={true}
                    returnKeyType='done'
                    numberOfLines={6}
                    maxHeight={100}
                    style={styles.commentInput}
                    placeholder="Comment ( optional )"
                    keyboardType='ascii-capable'
                    onChangeText={(value) => handleInputChange('contactComment', value)}
                  />
                </View>
              </View>
              <View style={styles.bottom}>
                <TouchableOpacity style={styles.savebutton} onPress={validateInput}>
                  <Text style={styles.savebuttonText}>Create</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelbutton} onPress={props.cancel}>
                  <Text style={styles.cancelbuttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  commentInput: {
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E6EBF2',
    height: 90,
    width: Dimensions.get('window').width * 0.95,
    marginBottom: 10,
    paddingLeft: 20,
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
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH * 0.95,
    bottom: -50, //to make the buttons appear above the keyboard 
  },
  savebuttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Urbanist-Bold',
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
    margin: 20,
    textAlign: 'center',
  },
});