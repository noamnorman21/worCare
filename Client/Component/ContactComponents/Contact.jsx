// Path: Client\Component\Contact.jsx
// Contact Page

import { View, Keyboard, LayoutAnimation, Text, TouchableOpacity, StyleSheet, Dimensions, Alert, TextInput } from 'react-native'
import { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';


export default function Contact({ route, navigation }) {
  const [animation, setAnimation] = useState({});
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

  const { contact } = route.params;
  const Cancel = () => {
    Alert.alert(
      'Cancel Changes',
      'are you sure you want to alose the app?',
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
  }
  const SaveChanges = () => {
      fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Contacts/UpdateContact/' + Contact.contactId, {
      method: 'PUT',
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

  return (
    <SafeAreaView style={styles.contact}>
      <Text style={styles.contactheader}>{Contact.contactName}</Text>
      <View style={styles.details}>
        <Text style={styles.detailsheader}>Phone number:</Text>
        <TextInput
          onChangeText={(value) => handleInputChange('phoneNo', value)}
          style={styles.contacttext}>
          {Contact.phoneNo}
        </TextInput>        
        <Text style={styles.detailsheader}>Mobile number: </Text>
        <TextInput
          onChangeText={(value) => handleInputChange('mobileNo', value)}
          style={styles.contacttext}>{Contact.mobileNo}</TextInput>
        <Text style={styles.detailsheader}>Email: </Text>
        <TextInput
          onChangeText={(value) => handleInputChange('email', value)}
          style={styles.contacttext}>
          {Contact.email}
        </TextInput>
        <Text style={styles.detailsheader}>Role: </Text>
        <TextInput
          onChangeText={(value) => handleInputChange('role', value)}
          style={styles.contacttext}>{Contact.role}</TextInput>
        <Text style={styles.detailsheader}>Comment: </Text>
        <TextInput
        onChangeText={(value) => handleInputChange('contactComment', value)}
        style={styles.contacttext}>{Contact.contactComment}</TextInput>
        <View style={styles.bottom}>
          <TouchableOpacity style={styles.savebutton} onPress={SaveChanges}>
            <Text style={styles.savebuttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelbutton} onPress={Cancel}>
            <Text style={styles.cancelbuttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
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
    padding: 10,
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
  },
  number: {
    fontSize: 14,
    color: '#8A8A8D',
  },
  searchBar: {
    margin: 10,
    borderRadius: 16,
    backgroundColor: '#EEEEEE',
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
    fontWeight: '600',
    fontSize: 16,
  },
  cancelbuttonText: {
    color: '#548DFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

