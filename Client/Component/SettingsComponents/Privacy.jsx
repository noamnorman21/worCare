import { View, Text, SafeAreaView, StyleSheet, Alert, TouchableOpacity, Dimensions, Modal } from 'react-native'
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FieldChange from './FieldChange';
import { useUserContext } from '../../UserContext';
import { TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons'
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
import { Ionicons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';

export default function Privacy({ navigation, route }) {
  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [Gender, setGender] = useState(null);
  const [Phonenum, setPhonenum] = useState(null);
  const [userImg, setUserImg] = useState(null);
  const [Email, setEmail] = useState(null);
  const [userType, setUserType] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalValue, setModalValue] = useState('');
  const { userContext, updateUserContext } = useUserContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [passwordChanged, setpasswordChanged] = useState(false);

  const CheckEmailInDB = () => {
    console.log('CheckEmailInDB', Email);
    let checkMail = 'https://proj.ruppin.ac.il/cgroup94/test1/api/User/GetEmail';
    let userDto = {
      Email: Email,
    }
    console.log('userDto', userDto);
    fetch(checkMail, {
      method: 'POST',
      body: JSON.stringify(userDto),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      }
    })
      .then(res => {
        if (res.ok) {

        }
        else {
          sendDataToNextDB();
        }
      })
      .catch((error) => {
        console.log("err=", error);
      });
  }


  const sendDataToNextDB = () => {
    const userToUpdate = {
      Email: Email,
      userUri: userImg,
      phoneNum: Phonenum,
      gender: Gender,
      FirstName: firstName,
      LastName: lastName,
      userId: userId,
      userType: userType
    }

    console.log('userToUpdate', userToUpdate)

    fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Settings/UpdateUserEmail', {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json; charset=UTF-8',
      }),
      body: JSON.stringify(userToUpdate)
    })
      .then(res => {
        if (res.ok) {
          return res.json()
            .then(
              (result) => {
                console.log("fetch POST= ", result);
                Alert.alert('Email Updated', 'Your Email has been changed successfully');
                updateUserContext(userToUpdate);
                const jsonValue = JSON.stringify(userToUpdate)
                AsyncStorage.setItem('userData', jsonValue);
                route.params.updateUser("Email", userToUpdate.Email)
                if (passwordChanged) {
                  checkPassowrd();
                }
                else {
                  navigation.goBack();
                }
              }
            )
        }
        else {
          return Alert.alert('Email Alreay Exists', 'Sorry, there was an error updating your email. Please try again later.');
        }
      }
      )
      .catch((error) => {
        console.log('Error:', error.message);
      }
      );
  }

  const openModal = (type, value) => {
    setModalType(type);
    setModalValue(value);
    setModalVisible(true);
  }

  const Update = (Field, value) => {
    setModalVisible(false);
    if (Field == "Email") {
      setEmail(value)
    }

  }

  const cancel = () => {
    console.log('cancel');
    setEmail(userContext.Email);
  }

  const SaveAllChanges = () => {
    if (Email != userContext.Email) {
      CheckEmailInDB();
    }
    else if (Email == userContext.Email && passwordChanged) {
      checkPassowrd();
    }
    else if (Email == userContext.Email && !passwordChanged) {
      navigation.goBack();
    }

  }

  useEffect(() => {
    const getData = async () => {
      try {
        setUserId(userContext.userId);
        setFirstName(userContext.FirstName);
        setLastName(userContext.LastName);
        setGender(userContext.gender)
        setUserImg(userContext.userUri)
        setPhonenum(userContext.phoneNum)
        setEmail(userContext.Email)
        setUserType(userContext.userType)
      } catch (e) {
        console.log('error', e);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const setNavigation = async () => navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButton}>
          <TouchableOpacity
            onPress={() => {
              SaveAllChanges();
            }}
          >
            <Text style={styles.headerButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

      ),
      headerLeft: () => (
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => Alert.alert(
              "Cancel Changes",
              "Are you sure you want to cancel your changes?",
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                },
                { text: "OK", onPress: () => navigation.goBack() }
              ],
              { cancelable: false }
            )}
          >
            <Ionicons name="chevron-back" size={28} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
    console.log("setnavigations")
    setNavigation();
  }, [Email, password1, password2]);

  const DeleteProfile = () => {
    fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/User/DeleteUser', {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
      }),
      body: JSON.stringify({
        userId: userId,
        Email: Email,
      })
    })
      .then(res => {
        console.log('res.ok', res.ok);
        if (res.ok) {
          return res.json();
        }
        else {
          console.log('error');
        }
      })
      .then(
        (result) => {
          console.log("fetch DELETE= ", result);
          if (result == 1) {
            route.params.logout();
          }
        })
      .catch((error) => {
        console.log('Error:', error.message);
      });

  }

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/ //at least 8 characters, 1 letter, 1 number
    return passwordRegex.test(password);
  }
  const checkPassowrd = () => {
    if (password1 === password2 && validatePassword(password1)) {
      let user = {
        userId: userContext.userId,
        password: password1
      }
      fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Settings/SetNewPassword', {
        method: 'PUT',
        headers: new Headers({
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json; charset=UTF-8',
        }),
        body: JSON.stringify(user)
      })
        .then(res => {
          if (res.ok) {
            return res.json()
              .then(
                (result) => {
                  console.log("fetch POST= ", result);
                  Alert.alert('Password Updated', 'Your Password has been changed successfully');
                  navigation.goBack();
                }
              )
          }
          else {
            return Alert.alert('Password Change Failed', 'Sorry, there was an error updating your password. Please try again later.');
          }
        }
        )
    }
    else if (password1 !== password2) {
      Alert.alert('Password Change Failed', 'Sorry, your passwords do not match. Please try again.');
      // throw new Error('Passwords do not match')
      //   .catch((error) => {
      //     console.log('Error:', error.message);
      //   }
      //   )

    }
    else if (!validatePassword(password1)) {
      Alert.alert('Password Change Failed', 'Sorry, your password must be at least 8 characters long, and contain at least one letter and one number. Please try again.');
    }
    else if (password1 === '' || password2 === '') {
      Alert.alert('Password Change Failed', 'Sorry, you must enter Both passwords. Please try again.');
    }

  }

  return (
    <View style={styles.container}>
      <View style={styles.fieldContainer}>
        <View style={styles.emailContainer}>
          <View style={styles.lineContainer}>
            <View style={styles.line} />
          </View>
          <Text style={styles.emailHeader}>Set new Email</Text>
          <View style={styles.lineContainer}>
            <View style={styles.line} />
          </View>
          <View style={styles.fieldView}>
            <Text style={styles.fieldHeader}>Email Address</Text>
            <TouchableOpacity underlayColor={'lightgrey'} style={styles.fields} onPress={() => openModal("Email", Email)}>
              <Text style={styles.fieldTxt}>{Email}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.passwordView}>
          <View style={styles.lineContainer}>
            <View style={styles.line} />
          </View>
          <Text style={styles.passwordHeader}>Set new password</Text>
          <View style={styles.lineContainer}>
            <View style={styles.line} />
          </View>
          <View style={styles.passwordContainer}>
            <Text style={styles.passwordSmallHeader}>Password</Text>
            {/* password */}
            <TextInput
              style={styles.input}
              placeholderTextColor={'#9E9E9E'}
              secureTextEntry={!showPassword}
              value={password1}
              autoCapitalize='none'
              autoCorrect={false}
              keyboardType='ascii-capable'
              onChangeText={text => { setPassword1(text); setpasswordChanged(true) }}
            />
            {/* password visibility button */}
            <TouchableOpacity style={styles.passwordButton} onPress={() => setShowPassword(!showPassword)}>
              {/* Icon button For changing password input visibility */}
              <Icon name={showPassword ? 'visibility' : 'visibility-off'} size={20} color='#000' />
            </TouchableOpacity>
          </View>
          <View style={styles.passwordContainer}>
            {/* password */}
            <Text style={styles.passwordSmallHeader}>Repeat Password</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor={'#9E9E9E'}
              secureTextEntry={!showPassword2}
              value={password2}
              autoCapitalize='none'
              autoCorrect={false}
              keyboardType='ascii-capable'
              onChangeText={text => { setPassword2(text); setpasswordChanged(true) }}
            />
            {/* password visibility button */}
            <TouchableOpacity style={styles.passwordButton} onPress={() => setShowPassword2(!showPassword2)}>
              {/* Icon button For changing password input visibility */}
              <Icon name={showPassword2 ? 'visibility' : 'visibility-off'} size={20} color='#000' />
            </TouchableOpacity>
          </View>
        </View>
        <Modal animationType="slide" visible={modalVisible}>
          <FieldChange userId={userId} type={modalType} value={modalValue} cancel={() => setModalVisible(false)} Save={(Field, value) => Update(Field, value)} />
        </Modal>
      </View>
      <View style={styles.accountView}>
        <View style={styles.lineContainer}>
          <View style={styles.line} />
        </View>
        <Text style={styles.emailHeader}>Account</Text>
        <View style={styles.lineContainer}>
          <View style={styles.line} />
        </View>
        <TouchableOpacity style={styles.logoutBtn}
          onPress={() => {
            Alert.alert("Add Account")
            AsyncStorage.removeItem("user");
            AsyncStorage.removeItem("userData");
            Alert.alert('Log Out', 'You have been logged out', [
              {
                text: 'OK',
                onPress: () => {
                  route.params.AddNewAccount();
                }
              },
            ]);
          }}
        >
          <Text style={styles.btnText1}>Add Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutBtn}
          onPress={() => {
            AsyncStorage.removeItem("user");
            AsyncStorage.removeItem("userData");
            Alert.alert('Log Out', 'You have been logged out', [
              {
                text: 'OK',
                onPress: () => {
                  route.params.logout();
                }
              },
            ]);
          }}
        >
          <Text style={styles.btnText1}>Log Out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton}
          onPress={() => {
            Alert.alert('Delete Account', 'Are you sure you want to delete your account?', [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
              },
              {
                text: 'OK',
                onPress: () => {
                  DeleteProfile();
                }
              },
            ]);
          }}
        >
          <Text style={styles.btnText2}>Delete Account</Text>
        </TouchableOpacity>


      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  headerButton: {
    width: SCREEN_WIDTH * 0.1,
    height: SCREEN_HEIGHT * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fields: {
    justifyContent: 'center',
    flex: 5,
    borderRadius: 16,
    borderBottomWidth: 1.5,
    borderColor: '#E6EBF2',
    padding: 10,
  },
  lineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E6EBF2',
    marginVertical: 5,
  },
  fieldTxt: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Urbanist',
  },
  logoutBtn: {
    width: SCREEN_WIDTH * 0.95,
    height: SCREEN_HEIGHT * 0.05,
  },
  deleteButton: {
    width: SCREEN_WIDTH * 0.95,
    height: SCREEN_HEIGHT * 0.05,
  },
  btnText1: {
    fontSize: 16,
    color: '#548DFF',
    paddingLeft: 10,
    fontFamily: 'Urbanist-SemiBold',
  },
  btnText2: {
    fontSize: 16,
    color: 'red',
    paddingLeft: 10,
    fontFamily: 'Urbanist-SemiBold',
  },
  fieldContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passwordSmallHeader: {
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
    color: '#000',
    paddingLeft: 10,
    flex: 2,
  },
  fieldHeader: {
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
    color: '#000',
    paddingLeft: 10,
    flex: 2,
    // marginVertical: 5,
  },
  fieldView: {
    flexDirection: 'row',
  },
  passwordHeader: {
    fontSize: 20,
    fontFamily: 'Urbanist-Bold',
    color: '#000',
    marginVertical: 10,
    paddingLeft: 10,
  },
  emailHeader: {
    fontSize: 20,
    fontFamily: 'Urbanist-Bold',
    color: '#000',
    marginVertical: 10,
    textAlign: 'left',
    paddingLeft: 10,
    width: SCREEN_WIDTH * 1,
  },
  passwordView: {
    marginVertical: 10,
  },
  input: {
    flex: 5,
    marginVertical: 5,
    paddingLeft: 10,
    alignItems: 'center',
    borderRadius: 16,
    borderBottomWidth: 1.5,
    borderBottomColor: '#E6EBF2',
    shadowColor: '#000',
    height: 54,
    fontFamily: 'Urbanist-Light',
    fontSize: 16,
  },
  passwordContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  emailContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  passwordButton: {
    position: 'absolute',
    right: SCREEN_WIDTH * 0.05,
    top: 25,
  },
  passwordButtonText: {
    color: '#000',
    fontFamily: 'Urbanist-Bold',
    fontSize: 14,
  },
  headerButton: {
    width: SCREEN_WIDTH * 0.11,
    height: SCREEN_HEIGHT * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
   
},
headerButtonText: {
  color: '#548DFF',
  fontFamily: 'Urbanist-SemiBold',
  fontSize: 16,
},
})