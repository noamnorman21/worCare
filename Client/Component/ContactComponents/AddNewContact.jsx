import { Alert, View, Keyboard, StyleSheet, Text, SafeAreaView, TextInput, Dimensions, TouchableOpacity, LayoutAnimation } from "react-native"
import { useState, useEffect } from "react"

export default function AddNewContact(props) {
  const [animation, setAnimation] = useState({});
  const [Contact, setContact] = useState({
    contactName: '',
    phoneNo: '',
    mobileNo: '',
    email: null,
    role: '',
    contactComment: '',
    patientId: 779355403 // will change when we finish context to get the patient id
  })

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        LayoutAnimation.configureNext({
          update: {
            type: LayoutAnimation.Types.easeIn,
            duration: 200,
            useNativeDriver: true,
          },
        });
        setAnimation({ marginBottom: Dimensions.get('window').height * 0.32 });
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        LayoutAnimation.configureNext({
          update: {
            type: LayoutAnimation.Types.easeOut,
            duration: 200,
            useNativeDriver: true,
          },
        });
        setAnimation({ marginBottom: 0 });
      }
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    }

  }, []);

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
      <View style={styles.header}>
        <Text style={styles.title}>Add New Contact</Text>
      </View>
      <View style={[styles.inputContainer, animation]}>
        <View>
          <TextInput
            style={styles.input}
            placeholder="Contact Name"
            keyboardType='ascii-capable'
            onChangeText={(value) => handleInputChange('contactName', value)}
          />
          <View style={styles.numbersInput}>
            <TextInput
              style={[styles.input, styles.numInput]}
              placeholder="Phone Numner"
              keyboardType='decimal-pad'
              onChangeText={(value) => handleInputChange('phoneNo', value)}
              returnKeyType='done'
              inputMode='numeric'
            />
            <TextInput
              style={[styles.input, styles.numInput]}
              placeholder="Mobile Numner"
              keyboardType='decimal-pad'
              onChangeText={(value) => handleInputChange('mobileNo', value)}
              returnKeyType='done'
              inputMode='numeric'
            />
          </View>
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
            style={styles.input}
            placeholder="Comment"
            keyboardType='ascii-capable'
            onChangeText={(value) => handleInputChange('contactComment', value)}
          />
        </View>
      </View>
      <View style={styles.bottom}>
        <TouchableOpacity style={styles.savebutton} onPress={validateInput}>
          <Text style={styles.savebuttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelbutton} onPress={props.cancel}>
          <Text style={styles.cancelbuttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  inputContainer: {
    width: Dimensions.get('window').width * 1,
    height: Dimensions.get('window').height * 1,
    alignItems: 'center',
    flex: 4,
  },
  input: {
    width: Dimensions.get('window').width * 0.9,
    padding: 10,
    margin: 7,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: '#F5F5F5',
    borderColor: 'lightgray',
    shadowColor: '#000',
    height: 45,
    fontFamily: 'Urbanist',
  },
  numInput: {
    width: Dimensions.get('window').width * 0.43,
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
  },
  savebuttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Urbanist-Bold',
  },
  cancelbuttonText: {
    color: '#548DFF',
    fontFamily: 'Urbanist-Bold',
    fontSize: 16,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Urbanist-Bold',
    marginBottom: 7,
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numbersInput: {
    flexDirection: 'row',
  },
});