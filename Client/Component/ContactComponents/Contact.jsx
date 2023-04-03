// Path: Client\Component\Contact.jsx
// Contact Page
import { View, Keyboard, LayoutAnimation, Text, TouchableOpacity, StyleSheet, Dimensions, Alert, TextInput, LogBox } from 'react-native'
import { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Contact({ route, navigation }) {
  const [animation, setAnimation] = useState({});
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
    patientId: route.params.contact.patientId // will change when we finish context to get the patient id
  })

   LogBox.ignoreLogs([
        'Non-serializable values were found in the navigation state',
    ]);


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
        setAnimation({ marginBottom: Dimensions.get('window').height * 0.3 });
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
  const validateEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/
    return emailRegex.test(email)
  }

  const validatePhoneNum = (phoneNum) => {
    //only numbers allowed in phone number input - no spaces or dashes - 10 digits - starts with 0
    const phoneNumRegex = /^(0)[0-9]{9}$/
    return phoneNumRegex.test(phoneNum)
  }


  const handleInputChange = (field, value) => {
    setContact({ ...Contact, [field]: value });
    if (!isChanged) {
      setIsChanged(true);
    }
  }
  const validateInput = () => {
    const { email, mobileNo, contactName } = Contact
    if (!mobileNo || !contactName) {
      return Alert.alert('Error', 'Email and Mobile Number are required')
    }
    if (!email) {
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
  const SaveChanges = (Contact) => {
    let urlContact = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Contacts/UpdateContact/' + Contact.contactId;
    fetch(urlContact, {
      method: 'PUT',
      body: JSON.stringify(Contact),
      headers: new Headers({ 'Content-Type': 'application/json; charset=UTF-8', })
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
            // fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Contacts/DeleteContact/', {
            //   method: 'DELETE',
            //   body: JSON.stringify(Contact),
            //   headers: new Headers({
            //     'Content-Type': 'application/json; charset=UTF-8',
            //   })
            // })
            //   .then(res => {
            //     return res.json()
            //   })
            //   .then(
            //     (result) => {
            //       console.log("fetch POST= ", result);
            //       navigation.goBack();
            //     },
            //     (error) => {
            //       console.log("err post=", error);
            //     });
            navigation.goBack();           
          }
        },
      ]
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Contact Details</Text>
      </View>
      <View style={[styles.inputContainer, animation]}>
        <Text style={styles.contactheader}>Name:</Text>
        <TextInput
          style={styles.input}
          value={Contact.contactName}
          keyboardType='ascii-capable'
          onChangeText={(value) => handleInputChange('contactName', value)}
        />
        <View style={styles.numbersInput}>
          <View>
            <Text style={styles.contactheader}>Phone number:</Text>
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
        </View>
        <Text style={styles.contactheader}>Role:</Text>
        <TextInput
          style={styles.input}
          value={Contact.role}
          keyboardType='ascii-capable'
          onChangeText={(value) => handleInputChange('role', value)}
        />
        <Text style={styles.contactheader}>Email:</Text>
        <TextInput
          style={styles.input}
          value={Contact.email}
          keyboardType='ascii-capable'
          onChangeText={(value) => handleInputChange('email', value)}
        />
        <Text style={styles.contactheader}>Comment:</Text>
        <TextInput
          style={styles.input}
          value={Contact.contactComment}
          keyboardType='ascii-capable'
          onChangeText={(value) => handleInputChange('contactComment', value)}
        />
      
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
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    marginTop: -50, // NEVER DO THIS !!!!
  },
  inputContainer: {
    width: Dimensions.get('window').width * 1,
    height: Dimensions.get('window').height * 1,
    flex: 4,
    textAlign: 'left',
    marginTop: -20, // NEVER DO THIS !!!!
  },
  input: {
    width: Dimensions.get('window').width * 0.95,
    padding: 10,
    margin: 7,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: 'lightgray',
    shadowColor: '#000',
    height: 45,
    fontFamily: 'Urbanist-Regular',
  },
  numInput: {
    width: Dimensions.get('window').width * 0.455,
  },
  savebutton: {    
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
    flex: 3,
  },
  cancelbutton: {
    flex: 3,
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
    marginRight: 12,
    marginTop: 7,
    height: 45,
  },
  Deletebutton: {
    width: Dimensions.get('window').width * 0.95,
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
    fontWeight: '600',
    fontSize: 16,
    fontFamily: 'Urbanist-Bold',
  },
  cancelbuttonText: {
    color: '#548DFF',
    fontSize: 18,
    fontFamily: 'Urbanist-Bold',
  },
  title: {
    fontSize: 26,
    fontFamily: 'Urbanist-Bold',
  },
  header: {
    flex: 1,
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
  }
});