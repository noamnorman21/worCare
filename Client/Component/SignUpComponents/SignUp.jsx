import { View, Text, Dimensions, SafeAreaView, Alert, StyleSheet, TouchableOpacity } from 'react-native'
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState, useEffect } from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import ImagePickerExample from '../HelpComponents/ImagePickerExample'
import { OrLine, HaveAccount } from './FooterLine'
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
import { TextInput } from 'react-native-paper';
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

    console.log(route.params.userType)
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
                  mode='outlined'
                  label={<Text style={{ fontFamily: "Urbanist-Medium" }}>First Name</Text>}
                  outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
                  contentStyle={{ fontFamily: 'Urbanist-Regular' }}
                  activeOutlineColor="#548DFF"
                  outlineColor='#E6EBF2'
                  placeholderTextColor={'#9E9E9E'}
                  keyboardType='ascii-capable'
                  autoCorrect={false}
                  onChangeText={(value) => handleInputChange('firstName', value.trim())}
                />
                <TextInput
                  style={[styles.input, styles.lastNameInput]}
                  mode='outlined'
                  label={<Text style={{ fontFamily: "Urbanist-Medium" }}>Last Name</Text>}
                  outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
                  contentStyle={{ fontFamily: 'Urbanist-Regular' }}
                  activeOutlineColor="#548DFF"
                  outlineColor='#E6EBF2'
                  placeholder="Last Name"
                  placeholderTextColor={'#9E9E9E'}
                  keyboardType='ascii-capable'
                  onChangeText={(value) => handleInputChange('lastName', value.trim())}
                />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor={'#9E9E9E'}
                keyboardType='ascii-capable'
                onChangeText={(value) => handleInputChange('email', value.trim())}
                autoCapitalize='none'
                autoCorrect={false}
                mode='outlined'
                label={<Text style={{ fontFamily: "Urbanist-Medium" }}>Email Address</Text>}
                outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
                contentStyle={{ fontFamily: 'Urbanist-Regular' }}
                activeOutlineColor="#548DFF"
                outlineColor='#E6EBF2'
                onBlur={() => { CheckEmailInDB() }}
              />

              <View style={styles.phoneContainer}>
                <TextInput
                  style={styles.input}
                  placeholderTextColor={'#9E9E9E'}
                  placeholder="Phone Number"
                  keyboardType='phone-pad'
                  returnKeyType='done'
                  onChangeText={(value) => handleInputChange('phoneNum', value)}
                  onBlur={() => { CheckPhoneInDB() }}
                  mode='outlined'
                  label={<Text style={{ fontFamily: "Urbanist-Medium" }}>Phone Number</Text>}
                  outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
                  contentStyle={{ fontFamily: 'Urbanist-Regular' }}
                  activeOutlineColor="#548DFF"
                  outlineColor='#E6EBF2'
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
                  mode='outlined'
                  label={<Text style={{ fontFamily: "Urbanist-Medium" }}>Password  (8+ characters)</Text>}
                  outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
                  contentStyle={{ fontFamily: 'Urbanist-Regular' }}
                  activeOutlineColor="#548DFF"
                  outlineColor='#E6EBF2'
                />
                <TouchableOpacity style={styles.passwordButton} onPress={() => setShowPassword(!showPassword)} >
                  <Icon
                    name={showPassword ? 'visibility' : 'visibility-off'}
                    size={24}
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
    right: SCREEN_WIDTH * 0.1,
    marginLeft: 5,
    top: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
  },
  inputContainer: {
    width: SCREEN_WIDTH * 1,
    height: SCREEN_HEIGHT * 1,
    alignItems: 'center',
    flex: 4.5,
  },
  imageContainer: {
    flex: 1,
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
    width: SCREEN_WIDTH * 0.925,
    height: 54,
    fontFamily: 'Urbanist-Regular',
    fontSize: 16,
    color: '#808080',
    backgroundColor: '#fff',
    marginVertical: 7,
    justifyContent: 'center',
    padding: 0,
  },
  button: {
    width: SCREEN_WIDTH * 0.925,
    backgroundColor: '#548DFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    marginTop: 7,
    height: 54,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Urbanist-Bold',
  },
  nameContainer: {
    flexDirection: 'row',
    width: SCREEN_WIDTH * 0.925,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  firstNameInput: {
    // marginRight: 10,
    width: SCREEN_WIDTH * 0.45,
  },
  lastNameInput: {
    width: SCREEN_WIDTH * 0.45,
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
    fontFamily: 'Urbanist-Regular',
    fontSize: 14,
    marginBottom: 5,
  },
});