<<<<<<< HEAD
import { View, Text, SafeAreaView, StyleSheet, Alert, TouchableOpacity, Dimensions, Modal, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
=======

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, LayoutAnimation, Modal, Image } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import NewPaycheck from './NewPaycheck';
import EditPaycheck from './EditPaycheck';
>>>>>>> 4f6e175412df3bd4f8b1b55dea50235efe34eea7
import { useUserContext } from '../../UserContext';
import { AddBtn } from '../HelpComponents/AddNewTask';
import { MaterialCommunityIcons, AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-navigation';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger, renderers } from "react-native-popup-menu";

const SCREEN_HEIGHT = Dimensions.get('window').height;
<<<<<<< HEAD
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
    if (Email == null && validateEmail(Email)) {    
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
    else{
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
=======
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Paychecks({ navigation, route }) {
  const { userContext } = useUserContext();
  const [History, setHistory] = useState()
  const [arr, setArr] = useState()
  const isFocused = useIsFocused()
  const [modal1Visible, setModal1Visible] = useState(false);
 

  useEffect(() => {
    if (isFocused && modal1Visible == false) {
      getPaychecks()
    }
  }, [isFocused, modal1Visible])

  const getPaychecks = async () => {
    const user = {
      userId: userContext.userId,
      userType: userContext.userType,
    }

    try {
      const response = await fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/PayChecks/GetPaychecks/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
>>>>>>> 4f6e175412df3bd4f8b1b55dea50235efe34eea7
        body: JSON.stringify(user)
      });
      const data = await response.json();
      setArr(data)
      if (data != null && data.length != undefined) {
        let arr = data.map((item) => {
          return (
            <Paycheck key={item.payCheckNum} getPaychecks={getPaychecks} data={item} />
          )
        })
        setHistory(arr)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const Notification = (id) => {
    Alert.alert(
      "Notification",
      "Are you sure you want to send a notification to the user?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
    );
  }

  return (
    <> 
        <View style={styles.headerText}>
          <Text style={styles.header}>Paychecks History</Text>
          <View style={styles.line}></View>
        </View>
        <ScrollView contentContainerStyle={styles.pending}>
        {History}
        <Modal animationType='slide' transparent={true} visible={modal1Visible}>
          <NewPaycheck cancel={() => { setModal1Visible(false); getPaychecks() }} userId={userContext.userId} />
        </Modal>
      </ScrollView>
      <View style={styles.addBtnView}><AddBtn onPress={() => setModal1Visible(true)} /></View>
    </>
  );
}

function Paycheck(props) {
  const [expanded, setExpanded] = useState(false);
  // const animationController = useRef(new LayoutAnimation.Value(0)).current;
  const [modal1Visible, setModal1Visible] = useState(false);
  const [temp, setTemp] = useState({
    paycheckDate: props.data.paycheckDate,
    paycheckSummary: props.data.paycheckSummary,
    paycheckComment: props.data.paycheckComment,
    payCheckNum: props.data.payCheckNum,
    UserId: props.data.UserId,
    payCheckProofDocument: props.data.payCheckProofDocument,
  })
  const [modal2Visible, setModal2Visible] = useState(false);
  const date = new Date(temp.paycheckDate);
  const year = date.getFullYear();
  const newYear = year.toString().substr(-2);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dateString = day + "/" + month + "/" + newYear;
  const paycheckNum = props.data.paycheckNum;
  const [DownloadProgress,setDownloadProgress] = useState(0);

  const toggle = () => {
    const config = {
      toValue: expanded ? 0 : 1,
      duration: 2000,
      useNativeDriver: true,
    }
    LayoutAnimation.easeInEaseOut(setExpanded(!expanded));
    
  };

  const openModal = async (value) => {
    if (value == 1) {
      console.log("Nottification")
    }
    else if (value == 2) {
      setModal1Visible(true)
    }
    else if (value == 3) {
      setModal2Visible(true)
    }
    else if (value == 4) {
      deletePaycheck(props.data.payCheckNum)
    }
  }

  const deletePaycheck = async () => {
    console.log("Delete Paycheck: " + temp.payCheckNum);
    Alert.alert(
      'Delete Paycheck',
      'are you sure you want to Delete the Paycheck?',
      [
        { text: "Dont Delete", style: 'cancel', onPress: () => { } },
        {
          text: 'Delete',
          style: 'destructive',
          // If the user confirmed, then we dispatch the action we blocked earlier
          // This will continue the action that had triggered the removal of the screen
          onPress: () => {
            let res = fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Paychecks/DeletePaycheck/' + temp.payCheckNum, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
            })
              .then(res => {
                console.log("res.ok", res.ok);
                if (!res.ok) {
                  console.log("res.status", res.status);
                  throw Error("Error " + res.status);
                }
                return res.json();
              })
              .then(
                (result) => {
<<<<<<< HEAD
                  console.log("fetch POST= ", result);
                  Alert.alert('Password Updated', 'Your Password has been changed successfully');
                  if (Notifications != userNotifications) {
                    updateNotifications();
                  }
                  else {
                  navigation.goBack();
                  }
=======
                  console.log("fetch DELETE= ", result);
                  Alert.alert("Delete Paycheck: " + temp.payCheckNum);
                  props.getPaychecks()
                },
                (error) => {
                  console.log("err post=", error);
>>>>>>> 4f6e175412df3bd4f8b1b55dea50235efe34eea7
                }
              );
          }
<<<<<<< HEAD
          else {
            setSaving(false);
            console.log("blaa",saving);
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
=======
        },
      ]
    );
  }

  const callback = downloadProgress => {
    const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
    setDownloadProgress(progress);
  }

  const downloadFile = async () => {
    const url = props.data.payCheckProofDocument;
    const dot = url.lastIndexOf(".");
    const questionMark = url.lastIndexOf("?");
    const type = url.substring(dot, questionMark);
    console.log("Type", type)
    const id = props.data.payCheckNum;
    const fileName = "Paycheck_" + id+type;
    const fileUri = FileSystem.documentDirectory + fileName;
    const directoryInfo = await FileSystem.getInfoAsync(fileUri);
        if (!directoryInfo.exists) {
          FileSystem.makeDirectoryAsync(fileUri, { intermediates: true });
        }
    const DownloadedFile = await FileSystem.downloadAsync(url,fileUri,{},callback);
    if (DownloadedFile.status == 200) {
      saveFile(DownloadedFile.uri, fileName, DownloadedFile.headers['content-type']);
    }
    else {
      console.log("File not Downloaded")
    }
  }

  const saveFile = async (res, fileName, type) => {
    if (Platform.OS == "ios") {
      Sharing.shareAsync(res)
    }
    else { //ios download with share
      try {
        const permission = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permission.granted) {
          const base64 = await FileSystem.readAsStringAsync(res, { encoding: FileSystem.EncodingType.Base64 });
          await FileSystem.StorageAccessFramework.createFileAsync(permission.directoryUri, fileName, type)
            .then(async (res) => {
              console.log("File", res)
              await FileSystem.writeAsStringAsync(res, base64, { encoding: FileSystem.EncodingType.Base64 });
              return Alert.alert("File Saved")
            })
            .catch(error => { console.log("Error", error) })
        }
      }
      catch (error) {
        console.log("Error", error)
      }
>>>>>>> 4f6e175412df3bd4f8b1b55dea50235efe34eea7
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
<<<<<<< HEAD
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
            {/* <Text style={styles.fieldTxt}>{Email}</Text> */}
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
          <Text style={styles.notificationSmallHeader}>Finance Notifications</Text>
          <Switch
            trackColor={{ false: "#E6EBF2", true: "#81b0ff" }}
            thumbColor={Notifications.financeNotifications ? "#548DFF" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => toggleNotifications('Finance')}
            value={Notifications.financeNotifications}
          />
        </View>
        {/*Tasks notifications toggle */}
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationSmallHeader}>Tasks Notifications</Text>
          <Switch
            trackColor={{ false: "#E6EBF2", true: "#81b0ff" }}
            thumbColor={Notifications.tasksNotifications ? "#548DFF" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => toggleNotifications('Tasks')}
            value={Notifications.tasksNotifications}
          />
        </View>
        {/* Chat notification toggle */}
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationSmallHeader}>Chat Notifications</Text>
          <Switch
            trackColor={{ false: "#E6EBF2", true: "#81b0ff" }}
            thumbColor={Notifications.chatNotifications ? "#548DFF" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => toggleNotifications('Chat')}
            value={Notifications.chatNotifications}
          />
        </View>
        {/* Contact notification toggle */}
        <View style={styles.notificationContainer}>
          <Text style={styles.notificationSmallHeader}>Contacts Notifications</Text>
          <Switch
            trackColor={{ false: "#E6EBF2", true: "#81b0ff" }}
            thumbColor={Notifications.contactNotifications ? "#548DFF" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => toggleNotifications('Contact')}
            value={Notifications.contactNotifications}
          />
        </View>
        {/* Email notification toggle */}
        <View style={styles.notificationContainer}> 
          <Text style={styles.notificationSmallHeader}>Email Notifications</Text>
          <Switch
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
=======
    <SafeAreaView>
      <View>
        {expanded ?
          <View style={styles.requestOpen}>
            <View style={styles.requestItemHeaderOpen}>
              <TouchableOpacity onPress={toggle} style={styles.request}>
                <View style={styles.requestItemLeft}>
                  <Text style={styles.requestItemText}>{dateString}</Text>
                </View>
              </TouchableOpacity>
              <Menu style={{ flexDirection: 'column', marginVertical: 0 }} onSelect={value => openModal(value)} >
                <MenuTrigger
                  children={<View>
                    <MaterialCommunityIcons name="dots-horizontal" size={28} color="gray" />
                  </View>}
                />
                <MenuOptions customStyles={{
                  optionsWrapper: styles.optionsWrapperOpened,
                }}  >
                  <MenuOption style={{ borderRadius: 16 }} value={1} children={<View style={styles.options}><MaterialCommunityIcons name='bell-ring-outline' size={20} /><Text style={styles.optionsText}> Send Notification</Text></View>} />
                  <MenuOption style={{ borderRadius: 16 }} value={2} children={<View style={styles.options}><Feather name='eye' size={20} /><Text style={styles.optionsText}> View Document</Text></View>} />
                  <MenuOption style={{ borderRadius: 16 }} value={3} children={<View style={styles.options}><Feather name='edit' size={20} /><Text style={styles.optionsText}> Edit Paycheck</Text></View>} />
                  <MenuOption style={styles.deleteTxt} value={4} children={<View style={styles.options}><Feather name='trash-2' size={20} color='#FF3C3C' /><Text style={styles.deleteTxt}> Delete Paycheck</Text></View>} />
                </MenuOptions>
              </Menu>
              <Modal animationType='slide' transparent={true} visible={modal1Visible} onRequestClose={() => setModal1Visible(false)}>
                <View style={styles.documentview}>
                  <TouchableOpacity style={styles.closeBtn} onPress={() => setModal1Visible(false)}>
                    <AntDesign name="close" size={24} color="black" />
                  </TouchableOpacity>
                  <Image source={{ uri: props.data.payCheckProofDocument }} style={styles.documentImg} />
                  <TouchableOpacity style={styles.documentDownloadButton} onPress={downloadFile} >
                    <Text style={styles.documentButtonText}>Download</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
              <Modal animationType='slide' transparent={true} visible={modal2Visible}>
                <EditPaycheck cancel={(value) => { setModal2Visible(false); setExpanded(true); props.getPaychecks() }} save={(value) => { setModal2Visible(false); setExpanded(false); props.getPaychecks(); setTemp(value) }} data={props.data} />
              </Modal>
            </View>
            <View style={styles.requestItemBody}>
              <View style={styles.requestItemBodyLeft}>
                <Text style={styles.requestItemText}>Date: </Text>
                <Text style={styles.requestItemText}>Amount: </Text>
                <Text style={[styles.requestItemText, temp.paycheckComment == null || temp.paycheckComment == '' && { display: 'none' }]}>Comment: </Text>

              </View>
              <View style={styles.requestItemBodyRight}>
                <Text style={styles.requestItemText}>{dateString}</Text>
                <Text style={styles.requestItemText}>{temp.paycheckSummary}</Text>
                <Text style={[styles.requestItemText, temp.paycheckComment == null || temp.paycheckComment == "" && { display: 'none' }]}>{temp.paycheckComment}</Text>

              </View>
            </View>
          </View>
          :
          <View>
            <View style={styles.requestItemHeader}>
              <TouchableOpacity onPress={toggle} style={styles.request}>
                <View style={styles.requestItemLeft}>
                  <Text style={styles.requestItemText}>{dateString}</Text>
                </View>
                <View style={styles.requestItemMiddle}>
                  <Text style={styles.requestItemText}>{props.subject}</Text>
                </View>
              </TouchableOpacity>
              <Menu style={{ flexDirection: 'column', marginVertical: 0 }} onSelect={value => openModal(value)} >
                <MenuTrigger
                  children={<View>
                    <MaterialCommunityIcons name="dots-horizontal" size={28} color="gray" />
                  </View>}
                />
                <MenuOptions customStyles={{
                  optionsWrapper: styles.optionsWrapper,
                }}
                >
                  <MenuOption style={{ borderRadius: 16 }} value={1} children={<View style={styles.options}><MaterialCommunityIcons name='bell-ring-outline' size={20} /><Text style={styles.optionsText}> Send Notification</Text></View>} />
                  <MenuOption style={{ borderRadius: 16 }} value={2} children={<View style={styles.options}><Feather name='eye' size={20} /><Text style={styles.optionsText}> View Document</Text></View>} />
                  <MenuOption style={{ borderRadius: 16 }} value={3} children={<View style={styles.options}><Feather name='edit' size={20} /><Text style={styles.optionsText}> Edit Paycheck</Text></View>} />
                  <MenuOption style={styles.deleteTxt} value={4} children={<View style={styles.options}><Feather name='trash-2' size={20} color='#FF3C3C' /><Text style={styles.deleteTxt}> Delete Paycheck</Text></View>} />
                </MenuOptions>
              </Menu>
              <Modal animationType='slide' transparent={true} visible={modal1Visible} onRequestClose={() => setModal1Visible(false)}>
                <View style={styles.documentview}>
                  <TouchableOpacity style={styles.closeBtn} onPress={() => setModal1Visible(false)}>
                    <AntDesign name="close" size={24} color="black" />
                  </TouchableOpacity>
                  <Image source={{ uri: props.data.payCheckProofDocument }} style={styles.documentImg} />
                  <TouchableOpacity style={styles.documentDownloadButton} onPress={downloadFile} >
                    <Text style={styles.documentButtonText}>Download</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
              <Modal animationType='slide' transparent={true} visible={modal2Visible}>
                <EditPaycheck cancel={(value) => { setModal2Visible(false); setExpanded(true); props.getPaychecks() }} save={(value) => { setModal2Visible(false); setExpanded(false); props.getPaychecks(); setTemp(value) }} data={props.data} />
              </Modal>
            </View>
          </View>
        }
      </View>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
>>>>>>> 4f6e175412df3bd4f8b1b55dea50235efe34eea7
  line: {
    borderBottomColor: '#E6EBF2',
    borderBottomWidth: 1.5,
  },
<<<<<<< HEAD
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
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
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
=======
  closeBtn: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: Dimensions.get('window').width * 0.9,
    marginVertical: 30,
  },
  requestItemHeader: {
    justifyContent: 'space-between',
    width: Dimensions.get('screen').width * 0.9,
    height: 60,
>>>>>>> 4f6e175412df3bd4f8b1b55dea50235efe34eea7
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E6EBF2',
    marginVertical: 10,
    backgroundColor: '#FFF',
    padding: 12,
    flexDirection: 'row',
  },
<<<<<<< HEAD
  notificationContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  emailContainer: {
    width: '100%',
=======
  requestItemBodyEdit: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 5,
    width: Dimensions.get('screen').width * 0.9,
  },
  requestItemHeaderOpen: {
    // justifyContent: 'flex-start',
    width: Dimensions.get('screen').width * 0.9,
    height: 60,
    alignItems: 'center',
    paddingHorizontal: 12,
    flexDirection: 'row',
    borderRadius: 10,
    borderBottomColor: '#7DA9FF',
    borderBottomWidth: 1.5,
  },
  requestOpen: {
    width: Dimensions.get('screen').width * 0.9,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#7DA9FF',
    marginVertical: 10,
    backgroundColor: '#F5F8FF',
    padding: 5,
  },
  requestItemBody: {
    justifyContent: 'space-between',
    width: Dimensions.get('screen').width * 0.9,
    alignItems: 'flex-start',
    padding: 12,
    flexDirection: 'row',
    flex: 1,
  },
  request: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    flex: 1,
  },
  requestItemRight: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 54,
    height: 54,
    borderRadius: 16,
  },
  requestItemMiddle: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 2,
  },
  requestItemLeft: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 2,
  },
  requestItemText: {
    fontSize: 18,
    color: '#000000',
    fontFamily: 'Urbanist-SemiBold',
  },
  options: {
    flexDirection: 'row',
    borderBottomColor: '#80808080',
    borderBottomWidth: 0.2,
    padding: 7,
    fontFamily: 'Urbanist-Medium',
  },
  optionsText: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 16,
  },
  optionsWrapper: {
    position: 'absolute',
    flexDirection: 'column',
    top: -120,
    backgroundColor: '#fff',
    borderRadius: 10,
    left: SCREEN_WIDTH * 0.09,
    elevation: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  optionsWrapperOpened: {
    position: 'absolute',
    bottom: -56,
    backgroundColor: '#fff',
    borderRadius: 10,
    left: SCREEN_WIDTH * 0.09,
    elevation: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  deleteTxt: {
    color: '#FF3C3C',
    fontFamily: 'Urbanist-Medium',
    fontSize: 16,
  },
  requestItemBodyLeft: {
    flex: 2,
  },
  requestItemBodyRight: {
    flex: 3,
    alignItems: 'flex-start',
  },
  documentview: {
>>>>>>> 4f6e175412df3bd4f8b1b55dea50235efe34eea7
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'white',
    flex: 1,
  },
  documentImg: {
    height: SCREEN_HEIGHT * 0.5,
    width: SCREEN_WIDTH * 0.9,
    borderRadius: 16,
    marginVertical: 20,
  },
<<<<<<< HEAD
  headerButtonText: {
    color: '#548DFF',
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
=======
  documentDownloadButton: {
    fontSize: 16,
    borderRadius: 16,
    backgroundColor: '#548DFF',
    fontFamily: 'Urbanist-Bold',
    alignItems: 'center',
    justifyContent: 'center',
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.06,
    marginBottom: 10,
  },
  documentCancelButton: {
    fontSize: 16,
    borderRadius: 16,
    borderColor: '#7DA9FF',
    borderWidth: 1,
    fontFamily: 'Urbanist-Bold',
    alignItems: 'center',
    justifyContent: 'center',
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.06,
    borderWidth: 1.5,
    backgroundColor: '#F5F8FF',
    borderColor: '#548DFF',
  },
  documentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Urbanist-Bold',
    alignItems: 'center',
  },
  documentCancelText: {
    color: '#7DA9FF',
    fontSize: 16,
    fontFamily: 'Urbanist-Bold',
    alignItems: 'center',
  },
  pending: {
    backgroundColor: 'white',
    flexGrow: 1,
    paddingTop: 10,
    alignItems: 'center',
  },
  headerText: {
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 30,
    fontFamily: 'Urbanist-Bold',
    textAlign: 'center'
  },
  addBtnView: {
    position: 'absolute',
    bottom: 20,
    right: 20,
>>>>>>> 4f6e175412df3bd4f8b1b55dea50235efe34eea7
  },
})