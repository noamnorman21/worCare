import { Image, Keyboard, LayoutAnimation, View, Text, TextInput, Dimensions, SafeAreaView, Alert, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import ImagePickerExample from './ImagePickerExample'
import { OrLine, HaveAccount } from './FooterLine'

// Sign up Screen - level 1 - first + last name, email, phone number, password, image 
// On submit, user is taken to SignUpLvl2 Screen - address, city, state, zip code, country

export default function CreateUser() {
  const [showPassword, setShowPassword] = useState(false);//for password visibility
  const [keyboardOpen, setKeyboardOpen] = useState(false);//for keyboard visibility
  const [animation, setAnimation] = useState({});
  const [image, setUserImage] = useState('')
  const [user, setUser] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNum: '',
    image: '',
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
        setAnimation({ marginBottom: Dimensions.get('window').height * 0.325 });
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
    const { email, password, firstName, lastName, phoneNum, image } = user
    if (!email || !password || !firstName || !lastName || !phoneNum) {
      return Alert.alert('Error', 'All fields are required')
    }

    if (!validateEmail(email)) {
      return Alert.alert('Invalid Email', 'Please enter a valid email')
    }

    if (!validatePassword(password)) {
      return Alert.alert('Invalid Password', 'Please enter a password with at least 8 characters, 1 letter, and 1 number')
    }

    if (firstName === '') {
      return Alert.alert('Invalid First Name', 'Please enter a valid first name')
    }
    if (lastName === '') {
      return Alert.alert('Invalid Last Name', 'Please enter a valid last name')
    }

    if (!validatePhoneNum(phoneNum)) {
      return Alert.alert('Invalid Phone Number', 'Please enter a valid phone number')
    }
    if (image === '') {
      image = '../../images/Avatar.pngs';
      return;
    }

    let userData = {
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNum: user.phoneNum,
      image: user.image,
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

  const changeIMG = (image) => {
    setUserImage(image)
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

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/ //at least 8 characters, 1 letter and 1 number
    return passwordRegex.test(password)
  }

  const handleInputChange = (field, value) => {
    setUser({ ...user, [field]: value });
  }

  return (

    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fill your profile</Text>
        <Text style={styles.smallTitle}>Don’t worry, you can always change it later</Text>
      </View>
      <View style={styles.imageContainer}>
        <ImagePickerExample style={styles.image} onImgChange={changeIMG} />
      </View>

      <View style={[styles.inputContainer, animation]}>
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

        <View style={styles.phoneContainer}>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType='phone-pad'
            onChangeText={(value) => handleInputChange('phoneNum', value)}
          />
        </View>
        <View style={styles.passwordContainer}>
          <TextInput
            input
            style={styles.input}
            placeholder="Password (8+ characters)"
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

        <TouchableOpacity style={styles.button} onPress={handleCreateUser} >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
      <OrLine />
      <HaveAccount />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  passwordButton: {
    position: 'absolute',
    right: Dimensions.get('window').width * 0.1,
    padding: 5,
    borderRadius: 5,
    marginLeft: 5,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    flexDirection: 'column',
  },
  inputContainer: {
    width: Dimensions.get('window').width * 1,
    height: Dimensions.get('window').height * 1,
    alignItems: 'center',
    flex: 4,
  },
  imageContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passwordContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: Dimensions.get('window').width * 0.85,
    height: Dimensions.get('window').width * 0.85,
    resizeMode: 'contain',
  },
  input: {
    width: Dimensions.get('window').width * 0.85,
    padding: 10,
    margin: 7,
    alignItems: 'left',
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: '#F5F5F5',
    borderColor: 'lightgray',
    shadowColor: '#000',
    height: 45,
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
    height: 45,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
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
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 7,
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallTitle: {
    fontSize: 14,
    marginBottom: 7,
  },
});