import { View, Text, TextInput, Dimensions, SafeAreaView, Alert, StyleSheet, TouchableOpacity } from 'react-native'
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import ImagePickerExample from '../HelpComponents/ImagePickerExample'
import { OrLine, HaveAccount } from './FooterLine'

// Sign up Screen - level 1 - first + last name, email, phone number, password, image 
// On submit, user is taken to SignUpLvl2 Screen - address, city, state, zip code, country
export default function CreateUser({ navigation, route }) {
  const [showPassword, setShowPassword] = useState(false);//for password visibility
  const [userImage, setUserImage] = useState(null)
  const [user, setUser] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNum: '',
  })
  const [patientId, setPatientId] = useState('');
  const [validateEmailInDB, setValidateEmailInDB] = useState(false);
  const [validatePhoneInDB, setValidatePhoneInDB] = useState(false);

  useEffect(() => {
    setPatientId(route.params.patientId);
  }, []);

  const CheckEmailInDB = () => {
    console.log('CheckEmailInDB', user.email);
    let checkMail = 'https://proj.ruppin.ac.il/cgroup94/test1/api/User/GetEmail';
    let userDto = {
      Email: user.email,
    }
    fetch(checkMail, {
      method: 'POST',
      body: JSON.stringify(userDto),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      }
    })
      .then(res => {
        if (res.ok) {
          setValidateEmailInDB(true);
          return res.json()
        }
        else {
          setValidateEmailInDB(false);
        }
      })
      .catch((error) => {
        console.log("err=", error);
      });
  }
  const CheckPhoneInDB = () => {
    console.log('CheckPhoneInDB', user.phoneNum);
    let checkPhone = 'https://proj.ruppin.ac.il/cgroup94/test1/api/User/GetPhoneNum';
    let userDto = {
      phoneNum: user.phoneNum,
    }
    fetch(checkPhone, {
      method: 'POST',
      body: JSON.stringify(userDto),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      }
    })
      .then(res => {
        if (res.ok) {
          setValidatePhoneInDB(true);
          return res.json()
        }
        else {
          setValidatePhoneInDB(false);
        }
      })
      .catch((error) => {
        console.log("err=", error);
      });
  }
  const handleCreateUser = () => {
    const { email, password, firstName, lastName, phoneNum } = user
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
    if (!validateEmailInDB) {
      return Alert.alert('Email already exists', 'Please enter a different email')
    }
    if (!validatePhoneInDB) {
      return Alert.alert('Phone Number already exists', 'Please enter a different phone number')
    }

    const userData = {
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNum: user.phoneNum,
      imagePath: userImage,
    }

    console.log(userData)
    if (route.params.userType === 'User') {
      navigation.navigate('SignUpLvl2', { user: userData, userType: route.params.userType })
    }
    else {
      navigation.navigate('SignUpLvl2', { user: userData, userType: route.params.userType, patientId: patientId })
    }
  }
  const changeIMG = (imageFromUser) => {
    setUserImage(imageFromUser)
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
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/ //at least 8 characters, 1 letter, 1 number
    return passwordRegex.test(password)
  }
  const handleInputChange = (field, value) => {
    setUser({ ...user, [field]: value });
  }
  const NavigateToLogIn = () => {
    navigation.navigate('LogIn')
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
          <View>
            <View style={styles.header}>
              <Text style={styles.title}>Fill your profile</Text>
              <Text style={styles.smallTitle}>Don't worry, you can always change it later</Text>
            </View>

            <View style={styles.imageContainer}>
              <ImagePickerExample style={styles.image} onImgChange={changeIMG} />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.nameContainer}>
                <TextInput
                  style={[styles.input, styles.firstNameInput]}
                  placeholder="First Name"
                  placeholderTextColor={'#9E9E9E'}
                  keyboardType='ascii-capable'
                  autoCorrect={false}
                  onChangeText={(value) => handleInputChange('firstName', value)}
                />
                <TextInput
                  style={[styles.input, styles.lastNameInput]}
                  placeholder="Last Name"
                  placeholderTextColor={'#9E9E9E'}
                  keyboardType='ascii-capable'
                  onChangeText={(value) => handleInputChange('lastName', value)}
                />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor={'#9E9E9E'}
                keyboardType='ascii-capable'
                onChangeText={(value) => handleInputChange('email', value)}
                autoCapitalize='none'
                autoCorrect={false}
                onBlur={() => {
                  CheckEmailInDB()
                }}
              />

              <View style={styles.phoneContainer}>
                <TextInput
                  style={styles.input}
                  placeholderTextColor={'#9E9E9E'}
                  placeholder="Phone Number"
                  keyboardType='phone-pad'
                  // return button type in keyboard for ios devices
                  returnKeyType='done'
                  onChangeText={(value) => handleInputChange('phoneNum', value)}
                  onBlur={() => {
                    CheckPhoneInDB()
                  }}
                />
              </View>
              <View style={styles.passwordContainer}>
                <TextInput
                  input
                  style={styles.input}
                  placeholderTextColor={'#9E9E9E'}
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
                    color='#000000'
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.button} onPress={handleCreateUser} >
                <Text style={styles.buttonText}>Get Started</Text>
              </TouchableOpacity>

              <View style={styles.footerContainer}>
                {/* footer line */}
                <OrLine />
                <HaveAccount NavigateToLogIn={NavigateToLogIn} />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
  },
  inputContainer: {
    width: Dimensions.get('window').width * 1,
    height: Dimensions.get('window').height * 1,
    alignItems: 'center',
    flex: 4.5,
  },
  imageContainer: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passwordContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: Dimensions.get('window').width * 0.85,
    padding: 10,
    margin: 7,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E6EBF2',
    fontFamily: 'Urbanist-Medium',
    height: 48,
  },
  button: {
    width: Dimensions.get('window').width * 0.85,
    backgroundColor: '#548DFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    margin: 7,
    height: 48,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Urbanist-Bold',
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
    fontSize: 24,
    fontFamily: 'Urbanist-Bold',
    marginBottom: 7,
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallTitle: {
    fontFamily: 'Urbanist',
    fontSize: 14,
    marginBottom: 5,
  },
});