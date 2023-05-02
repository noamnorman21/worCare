import { View, Text, StyleSheet, Alert, TouchableOpacity, Dimensions, ScrollView, Platform } from 'react-native'
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserContext } from '../../UserContext';
import { TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons'
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
import { Ionicons } from '@expo/vector-icons';
import { Switch } from 'react-native-paper';

export default function Privacy({ navigation, route }) {
  const [Email, setEmail] = useState(null);
  const { userContext, updateUserContext, userNotifications, updateuserNotifications } = useUserContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [passwordChanged, setpasswordChanged] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [Notifications, setNotifications] = useState(userNotifications);

  useEffect(() => {
    const getData = async () => {
      try {
        setEmail(userContext.Email)
      } catch (e) {
        console.log('error', e);
      }
    };
    const setNavigation = async () => navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => {
              setSaving(true);
            }}
          >
            <Text style={styles.headerButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

      ),
      headerLeft: () => (
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => { setCancel(true); }}
          >
            <Ionicons name="chevron-back" size={28} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
    console.log("setnavigations")
    setNavigation();
    getData();
  }, []);

  useEffect(() => {
    console.log("useEffect")
    console.log("saving", saving)
    if (saving) {
      saveAllChanges();
    }
    if (cancel) {
      cancelAllChanges();
    }
  }, [saving, cancel]);

  //checking which fields were changed and updating them in the DB
  const saveAllChanges = (field) => {
    if (Email != userContext.Email) {
      checkEmailInDB();
    }
    else if (Email == userContext.Email && passwordChanged) {
      checkPassowrd();
    }
    else if (Email == userContext.Email && !passwordChanged && Notifications !== userNotifications) {
      console.log('Notifications', Notifications);
      console.log('userContext.Notifications', userNotifications);
      updateNotifications();
    }
    else {
      navigation.goBack();
    }
  }

  const cancelAllChanges = () => {
    if (Email != userContext.Email || passwordChanged) {
      Alert.alert(
        "Cancel Changes",
        "Are you sure you want to cancel your changes?",
        [
          {
            text: "Cancel",
            onPress: () => setCancel(false),
            style: "cancel"
          },
          { text: "OK", onPress: () => navigation.goBack() }
        ],
        { cancelable: false }
      )
    }
    else {
      navigation.goBack();
    }
  }

  // check if email already exists in DB
  const checkEmailInDB = () => {
    console.log('checkEmailInDB', Email);
    if (Email !== null && validateEmail(Email)) {
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
            sendDataToNextDB();
          }
          else {
            Alert.alert('This email is already in use')
          }
        })
        .catch((error) => {
          console.log("err=", error);
        });
    }
    else {
      setSaving(false);
      Alert.alert('Invalid Email', 'Please enter a valid email')
    }
  }

  //save email in DB
  const sendDataToNextDB = () => {
    const userToUpdate = {
      Email: Email,
      userUri: userContext.userImg,
      phoneNum: userContext.phoneNum,
      gender: userContext.gender,
      FirstName: userContext.FirstName,
      LastName: userContext.LastName,
      userId: userContext.userId,
      userType: userContext.userType,
      workerId: userContext.workerId,//if user is a caregiver, this field will be same as userId
      involvedInId: userContext.involvedInId,//if user is a not caregiver, this field will be same as userId
      patientId: userContext.patientId,
      userUri: userContext.userUri,
    }

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
                updateUserContext(userToUpdate);
                const jsonValue = JSON.stringify(userToUpdate)
                AsyncStorage.setItem('userData', jsonValue);
                route.params.updateuserEmail(Email);
                if (passwordChanged) {
                  checkPassowrd();
                }
                else if (Notifications != userNotifications) {
                  updateNotifications();
                }
                else {
                  Alert.alert('Changes Updated Successfully');
                  navigation.goBack();
                }
              }
            )
        }
        else {
          setSaving(false);
          return Alert.alert('Error updating email', 'Sorry, there was an error updating your email. Please try again later.');
        }
      }
      )
      .catch((error) => {
        console.log('Error:', error.message);
      }
      );
  }

  const deleteProfile = () => {
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

  //save new password in DB
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
                  if (Notifications != userNotifications) {
                    updateNotifications();
                  }
                  else {
                    navigation.goBack();
                  }
                }
              )
          }
          else {
            setSaving(false);
            console.log("blaa", saving);
            return Alert.alert('Password Change Failed', 'Sorry, there was an error updating your password. Please try again later.');
          }
        }
        )
    }
    else if (password1 !== password2) {
      setSaving(false);
      Alert.alert('Password Change Failed', 'Sorry, your passwords do not match. Please try again.');
    }
    else if (password1 && !validatePassword(password1)) {
      setSaving(false);
      Alert.alert('Password Change Failed', 'Sorry, your password must be at least 8 characters long, and contain at least one letter and one number. Please try again.');
    }
    else if (password1 === '' && password2 === '' && Notifications != userNotifications) {
      updateNotifications();
    }
    else {
      navigation.goBack();
    }
  }

  //save notifications in DB- for now only in userContext
  const updateNotifications = () => {
    let notificationsUpdate = {
      userId: userContext.userId,
      emailNotifications: Notifications.emailNotifications,
      financeNotifications: Notifications.financeNotifications,
      chatNotifications: Notifications.chatNotifications,
      tasksNotifications: Notifications.tasksNotifications,
      contactNotifications: Notifications.contactNotifications,
      allNotifications: Notifications.allNotifications,
    }
    console.log('notificationsUpdate', notificationsUpdate);
    try {
      updateuserNotifications(notificationsUpdate);
      Alert.alert('Changes Updated Successfully');
    }
    catch (e) {
      console.log('error', e);
    }
    navigation.goBack();
  }

  const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/ //at least 8 characters, 1 letter, 1 number
    return passwordRegex.test(password);
  }

  // operations on notifications
  const toggleNotifications = (field) => {
    if (field == 'Email') {
      if (Notifications.emailNotifications) {
        setNotifications({ ...Notifications, emailNotifications: false });
      }
      else {
        setNotifications({ ...Notifications, emailNotifications: true });
      }
    }
    else if (field == 'Finance') {
      if (Notifications.financeNotifications) {
        setNotifications({ ...Notifications, financeNotifications: false });
      }
      else {
        setNotifications({ ...Notifications, financeNotifications: true });
      }
    }
    else if (field == 'Tasks') {
      if (Notifications.tasksNotifications) {
        setNotifications({ ...Notifications, tasksNotifications: false });
      }
      else {
        setNotifications({ ...Notifications, tasksNotifications: true });
      }
    }
    else if (field == 'Chat') {
      if (Notifications.chatNotifications) {
        setNotifications({ ...Notifications, chatNotifications: false });
      }
      else {
        setNotifications({ ...Notifications, chatNotifications: true });
      }
    }
    else if (field == 'Contact') {
      if (Notifications.contactNotifications) {
        setNotifications({ ...Notifications, contactNotifications: false });
      }
      else {
        setNotifications({ ...Notifications, contactNotifications: true });
      }
    }
    else if (field == 'All') {
      if (Notifications.allNotifications) {
        setNotifications({
          ...Notifications,
          emailNotifications: false,
          financeNotifications: false,
          tasksNotifications: false,
          chatNotifications: false,
          contactNotifications: false,
          allNotifications: false
        })
      }
      else {
        setNotifications({
          ...Notifications,
          emailNotifications: true,
          financeNotifications: true,
          tasksNotifications: true,
          chatNotifications: true,
          contactNotifications: true,
          allNotifications: true
        });
      }
    }
  }

  return (
    <ScrollView alwaysBounceVertical={false} contentContainerStyle={styles.container}>
      <View style={styles.emailContainer}>
        <View style={styles.lineContainer}>
          <View style={styles.line} />
        </View>
        <Text style={styles.sectionHeader}>Set new Email</Text>
        <View style={styles.lineContainer}>
          <View style={styles.line} />
        </View>
        <View style={styles.fieldView}>
          <Text style={styles.emailSmallHeader}>Email Address</Text>
          <TouchableOpacity underlayColor={'lightgrey'} style={styles.fields} >
            <TextInput style={styles.fieldTxt} editable={true} value={Email} onChangeText={text => { setEmail(text) }} />
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
            placeholder='Enter Password'
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
            secureTextEntry={!showPassword2}
            placeholderTextColor={'#9E9E9E'}
            placeholder='Repeat Password'
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
      <View style={styles.notificationsView}>
        <View style={styles.lineContainer}>
          <View style={styles.line} />
        </View>
        <Text style={styles.sectionHeader}>Notifications</Text>
        <View style={styles.lineContainer}>
          <View style={styles.line} />
        </View>
        {/*Finance notifications toggle */}
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationSmallHeader}>Finance</Text>
          <Switch
            style={Platform.OS == 'ios' ? { marginVertical: 5, marginRight: 10, transform: [{ scaleX: .85 }, { scaleY: .85 }] } : { marginRight: 5 }} // ios style
            trackColor={{ false: "#E6EBF2", true: "#81b0ff" }}
            thumbColor={Notifications.financeNotifications ? "#548DFF" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => toggleNotifications('Finance')}
            value={Notifications.financeNotifications}
          />
        </View>
        {/*Tasks notifications toggle */}
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationSmallHeader}>Tasks</Text>
          <Switch
            style={Platform.OS == 'ios' ? { marginVertical: 5, marginRight: 10, transform: [{ scaleX: .85 }, { scaleY: .85 }] } : { marginRight: 5 }} // ios style
            trackColor={{ false: "#E6EBF2", true: "#81b0ff" }}
            thumbColor={Notifications.tasksNotifications ? "#548DFF" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => toggleNotifications('Tasks')}
            value={Notifications.tasksNotifications}
          />
        </View>
        {/* Chat notification toggle */}
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationSmallHeader}>Chat</Text>
          <Switch
            style={Platform.OS == 'ios' ? { marginVertical: 5, marginRight: 10, transform: [{ scaleX: .85 }, { scaleY: .85 }] } : { marginRight: 5 }} // ios style
            trackColor={{ false: "#E6EBF2", true: "#81b0ff" }}
            thumbColor={Notifications.chatNotifications ? "#548DFF" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => toggleNotifications('Chat')}
            value={Notifications.chatNotifications}
          />
        </View>
        {/* Contact notification toggle */}
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationSmallHeader}>Contacts </Text>
          <Switch
            style={Platform.OS == 'ios' ? { marginVertical: 5, marginRight: 10, transform: [{ scaleX: .85 }, { scaleY: .85 }] } : { marginRight: 5 }} // ios style
            trackColor={{ false: "#E6EBF2", true: "#81b0ff" }}
            thumbColor={Notifications.contactNotifications ? "#548DFF" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => toggleNotifications('Contact')}
            value={Notifications.contactNotifications}
          />
        </View>
        {/* Email notification toggle */}
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationSmallHeader}>Email </Text>
          <Switch
            style={Platform.OS == 'ios' ? { marginVertical: 5, marginRight: 10, transform: [{ scaleX: .85 }, { scaleY: .85 }] } : { marginRight: 5 }} // ios style
            trackColor={{ false: "#E6EBF2", true: "#81b0ff" }}
            thumbColor={Notifications.emailNotifications ? "#548DFF" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => toggleNotifications('Email')}
            value={Notifications.emailNotifications}
          />
        </View>
        {/* All notification toggle */}
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationSmallHeader}>All Notifications</Text>
          <Switch
            // transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
            style={Platform.OS == 'ios' ? { marginVertical: 5, marginRight: 10, transform: [{ scaleX: .85 }, { scaleY: .85 }] } : { marginRight: 5 }} // ios style
            trackColor={{ false: "#E6EBF2", true: "#81b0ff" }}
            thumbColor={Notifications.allNotifications ? "#548DFF" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => toggleNotifications('All')}
            value={Notifications.allNotifications}
          />
        </View>
      </View>
      <View style={styles.accountView}>
        <View style={styles.lineContainer}>
          <View style={styles.line} />
        </View>
        <Text style={styles.sectionHeader}>Account</Text>
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
                  deleteProfile();
                }
              },
            ]);
          }}
        >
          <Text style={styles.btnText2}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    justifyContent: 'flex-start'
  },
  headerButton: {
    width: SCREEN_WIDTH * 0.1,
    height: SCREEN_HEIGHT * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fields: {
    justifyContent: 'center',
    flex: 4,
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
  passwordSmallHeader: {
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
    color: '#000',
    paddingLeft: 10,
    flex: 2,
  },
  notificationSmallHeader: {
    fontSize: 18,
    fontFamily: 'Urbanist-Medium',
    color: '#000',
    paddingLeft: 10,
    flex: 2,
  },
  emailSmallHeader: {
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
    color: '#000',
    paddingLeft: 10,
    flex: 2,
  },
  fieldView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordHeader: {
    fontSize: 20,
    fontFamily: 'Urbanist-Bold',
    color: '#000',
    marginVertical: 10,
    paddingLeft: 10,
  },
  sectionHeader: {
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
  notificationsView: {
    marginVertical: 10,
  },
  accountView: {
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
  notificationContainer: {
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
  headerButtonText: {
    color: '#548DFF',
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
  },
})