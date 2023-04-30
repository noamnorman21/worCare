import { Alert, View, StyleSheet, Text, SafeAreaView, Dimensions, TouchableOpacity } from "react-native"
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useState, useEffect } from "react"
import { useUserContext } from "../../UserContext";
import { TextInput } from "react-native-paper";

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function AddNewContact(props) {
  const { userContext } = useUserContext()
  const [Contact, setContact] = useState({
    contactName: null,
    phoneNo: null,
    mobileNo: null,
    email: null,
    role: null,
    contactComment: null,
    patientId: userContext.patientId // will change when we finish context to get the patient id
  })

  const handleInputChange = (field, value) => {
    setContact({ ...Contact, [field]: value });
  }

  //validate that phone contains only digits
  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]*$/
    return phoneRegex.test(phone)
  }

  const validateInput = () => {
    if (!Contact.contactName) {
      return Alert.alert('Error', 'Name is required')
    }
    if (Contact.email !== null && Contact.email !== '' && !validateEmail(Contact.email)) {
      return Alert.alert('Invalid Email', 'Please enter a valid email')
    }
    if (!Contact.mobileNo && !Contact.phoneNo) {
      return Alert.alert('Invalid numbers', 'a phone number or a mobile number is required')
    }
    if (Contact.mobileNo && !validatePhone(Contact.mobileNo)) {
      return Alert.alert('Invalid Mobile number', 'mobile number must contain only digits')
    }
    if (Contact.phoneNo && !validatePhone(Contact.phoneNo)) {
      return Alert.alert('Invalid Telephone number', 'Telephone number must contain only digits')
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
          props.closeModal();
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

  const closeModal = () => {
    console.log("closeModal");
    if (props.contacts.length==0){
       props.closeModal();
      props.goBack();
    }
    else{
      props.closeModal();
      props.cancel();
    }
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
                <TextInput style={styles.inputTxt}
                mode='outlined'
                label='Full Name'
                value={Contact.contactName}
                onChangeText={(value) => handleInputChange('contactName', value)}
                placeholder="Type Something..."
                contentStyle={{ fontFamily: 'Urbanist-Regular' }}
                outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
                activeOutlineColor="#548DFF"
                outlineColor='#E6EBF2' />
                <TextInput style={styles.inputTxt}
                mode='outlined'
                label='Mobile Number'
                value={Contact.mobileNo}
                keyboardType='decimal-pad'
                onChangeText={(value) => handleInputChange('mobileNo', value)}
                placeholder="Type Something..."
                contentStyle={{ fontFamily: 'Urbanist-Regular' }}
                outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
                activeOutlineColor="#548DFF"
                outlineColor='#E6EBF2'
                inputMode="numeric" />
                <TextInput style={styles.inputTxt}
                mode='outlined'
                label='Telephone Number'
                keyboardType='decimal-pad'
                value={Contact.phoneNo}
                onChangeText={(value) => handleInputChange('phoneNo', value)}
                placeholder="Type Something..."
                contentStyle={{ fontFamily: 'Urbanist-Regular' }}
                outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
                activeOutlineColor="#548DFF"
                outlineColor='#E6EBF2'
                inputMode="numeric" />
                 <TextInput style={styles.inputTxt}
                mode='outlined'
                label='Role (optional)'
                value={Contact.role}
                onChangeText={(value) => handleInputChange('role', value)}
                placeholder="Type Something..."
                contentStyle={{ fontFamily: 'Urbanist-Regular' }}
                outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
                activeOutlineColor="#548DFF"
                outlineColor='#E6EBF2' />
                <TextInput style={styles.inputTxt}
                mode='outlined'
                label='Email Address (optional)'
                value={Contact.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder="Type Something..."
                contentStyle={{ fontFamily: 'Urbanist-Regular' }}
                outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
                activeOutlineColor="#548DFF"
                outlineColor='#E6EBF2' />
                 <TextInput style={styles.inputTxt}
                mode='outlined'
                label='Comment (optional)'
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
                </View>
              </View>
              <View style={styles.bottom}>
                <TouchableOpacity style={styles.savebutton} onPress={validateInput}>
                  <Text style={styles.savebuttonText}>Create</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelbutton} onPress={closeModal}>
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
  inputTxt: {
    fontFamily: 'Urbanist-Light',
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
    marginVertical: 10,
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
    bottom: -20, //to make the buttons appear above the keyboard 
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
    margin: 20,
    textAlign: 'center',
  },
});