import React from 'react';
import { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { TextInput } from 'react-native-paper';


export default function FieldChange(props) {

  const [type, setType] = React.useState();
  const [value, setValue] = React.useState(props.value);
  const [userId, setUserId] = React.useState(props.userId);


  useEffect(() => {
    setType(props.type);
    setUserId(props.userId);
  }, [])

  const validatePhoneNum = (phoneNum) => {
    //only numbers allowed in phone number input - no spaces or dashes - 10 digits - starts with 0
    const phoneNumRegex = /^(0)[0-9]{9}$/
    return phoneNumRegex.test(phoneNum)
  }

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/ //at least 8 characters, 1 letter, 1 number
    return passwordRegex.test(password);
  }


  const save = () => {
    if (type === 'Password') {
      if (validatePassword(value)) {
        props.Save(type, value);
      }
      else {
        return alert('Password must be at least 8 characters, 1 letter, 1 number');
      }
    }
    if (type === 'Phone Number') {
      console.log('phone number')
      if (validatePhoneNum(value)) {
        console.log('phone number is valid')
        props.Save(type, value);
      }
      else {
        return alert('Phone number must be 10 digits and start with 0');
      }

    } 
    props.Save(type, value);
  }

    



    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Change {type}</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, styles.firstNameInput]}
            value={value}
            onChangeText={text => setValue(text)}
            keyboardType={type === 'Phone Number' ? 'phone-pad' : 'default'}
          />
        </View>
        <View style={styles.bottom}>
          <TouchableOpacity onPress={save} style={styles.button}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={props.cancel} style={styles.cancelbutton}>
            <Text style={styles.cancelbuttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    button: {
      width: Dimensions.get('window').width * 0.85,
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
      height: 55,
    },
    buttonText: {
      color: 'white',
      fontWeight: '600',
      fontSize: 16,
    },
    cancelbutton: {
      width: Dimensions.get('window').width * 0.85,
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
      height: 55,
    },
    cancelbuttonText: {
      color: '#548DFF',
      fontWeight: '600',
      fontSize: 16,
    },
    input: {
      width: Dimensions.get('window').width * 0.85,
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
    firstNameInput: {
      marginRight: 10,
      width: Dimensions.get('window').width * 0.85,
    },
    inputContainer: {
      alignItems: 'center',

    },
    header: {
      marginTop: 20,
      marginBottom: 20,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 2,
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      color: '#000',
    },
    bottom: {
      flex: 5,
    }
  });
