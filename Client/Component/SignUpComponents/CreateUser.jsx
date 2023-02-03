import { Image, Keyboard, LayoutAnimation, View, Text, TextInput, Dimensions, SafeAreaView, Alert, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import ImagePickerExample from './ImagePickerExample'

export default function CreateUser() {
  const [showPassword, setShowPassword] = useState(false);//for password visibility
  const [keyboardOpen, setKeyboardOpen] = useState(false);//for keyboard visibility
  const [animation, setAnimation] = useState({});
  const [user, setUser] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNum: '',
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
        setAnimation({ marginBottom: Dimensions.get('window').height * 0.6 });
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

  const handleCreateUser = () => {
    const { email, password, firstName, lastName, phoneNum } = user
    if (!email || !password || !firstName || !lastName || !phoneNum) {
      return Alert.alert('Error', 'All fields are required')
    }

    if (!validateEmail(email)) {
      return Alert.alert('Invalid Email', 'Please enter a valid email')
    }

    if (!validatePassword(password)) {
      return Alert.alert('Invalid Password', 'Please enter a password with at least 8 characters, including 1 uppercase letter, 1 lowercase letter and 1 number')
    }

    if (!validateFirstName(firstName)) {
      return Alert.alert('Invalid First Name', 'Please enter a valid first name')
    }

    if (!validateLastName(lastName)) {
      return Alert.alert('Invalid Last Name', 'Please enter a valid last name')
    }

    if (!validatePhoneNum(phoneNum)) {
      return Alert.alert('Invalid Phone Number', 'Please enter a valid phone number')
    }

    // Add logic to post user data to your server here
    return Alert.alert(
      firstName,
      'User Created',
      'Your account has been created successfully',
      [
        {
          text: 'Ok',
          onPress: () => {
            console.log('User created successfully')
          },
        },
      ],
      { cancelable: false },
    )
  }

  const validatePhoneNum = (phoneNum) => {
    const phoneNumRegex = /^[0-9\b]+$/
    return phoneNumRegex.test(phoneNum)
  }

  const validateEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/
    return emailRegex.test(email)
  }

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
    return passwordRegex.test(password)
  }

  const validateFirstName = (firstName) => {
    const nameRegex = /^[a-zA-Z\u0590-\u05FF]+$/
    return nameRegex.test(firstName)
  }

  const validateLastName = (lastName) => {
    const nameRegex = /^[a-zA-Z\u0590-\u05FF]+$/
    return nameRegex.test(lastName)
  }

  const handleInputChange = (field, value) => {
    setUser({ ...user, [field]: value });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.inputContainer, animation]}>
        <View style={styles.imageContainer}>
          {/* <Image
          style={styles.image}
          source={require('../../images/logo_New.png')}
        /> */}
          <ImagePickerExample style={styles.image} />
        </View>
        <View style={styles.nameContainer}>
          <TextInput
            style={[styles.input, styles.firstNameInput]}
            placeholder="First Name"
            onChangeText={(value) => handleInputChange('firstName', value)}
          />
          <TextInput
            style={[styles.input, styles.lastNameInput]}
            placeholder="Last Name"
            onChangeText={(value) => handleInputChange('lastName', value)}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(value) => handleInputChange('email', value)}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            input
            style={styles.input}
            placeholder="Password"
            secureTextEntry={!showPassword}
            autoCapitalize='none'
            autoCorrect={false}
            keyboardType='ascii-capable'
            onChangeText={(value) => handleInputChange('password', value)}
          />
          <TouchableOpacity
            style={styles.passwordButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            {/* Icon button For changing password input visibility */}
            <Icon
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={20}
              color='#979797'
            />
          </TouchableOpacity>
        </View>
        <View style={styles.phoneContainer}>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            onChangeText={(value) => handleInputChange('phoneNum', value)}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleCreateUser} >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  passwordButton: {
    position: 'absolute',
    right: 10,
    padding: 5,
    borderRadius: 5,
    marginLeft: 5,
  },
  passwordContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    flexDirection: 'column',
  },
  inputContainer: {
    width: '80%',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  passwordContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  image: {
    width: Dimensions.get('window').width * 0.85,
    height: Dimensions.get('window').width * 0.85,
    resizeMode: 'contain',
  },
  input: {
    width: Dimensions.get('window').width * 0.85,
    padding: 15,
    margin: 5,
    alignItems: 'left',
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: '#F5F5F5',
    borderColor: 'lightgray',
    shadowColor: '#000',
    height: 54,
  },
  button: {
    width: Dimensions.get('window').width * 0.9,
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
    margin: 15,
    height: 54,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  nameContainer: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  firstNameInput: {
    marginRight: 10,
    width: Dimensions.get('window').width * 0.4,
  },
  lastNameInput: {
    marginLeft: 10,
    width: Dimensions.get('window').width * 0.4,
  },
});
