import { View, Text, SafeAreaView, StyleSheet, Alert, TouchableOpacity, Dimensions, Image } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Modal } from 'react-native';
import FieldChange from './FieldChange';
import GenderChange from './GenderChange';
import { useUserContext } from '../../UserContext';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../config/firebase';
import { Octicons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function Profile(props) {
  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [Gender, setGender] = useState(null);
  const [Phonenum, setPhonenum] = useState(null);
  const [userImg, setUserImg] = useState(null);
  const [Email, setEmail] = useState(null);
  const [userType, setUserType] = useState(null);
  const [password, setPassword] = useState(null);
  const [ImageChange, setImageChange] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalValue, setModalValue] = useState('');
  const [modal2Visible, setModal2Visible] = useState(false);
  const { updateUserContext, userContext, setUserContext, updateUserProfile } = useUserContext();
  const [isChanged, setIsChanged] = useState(false);




  
  const displayGender = () => {
    if (Gender == "M") {
      return "Male"
    }
    else if (Gender == "F") {
      return "Female"
    }
    else {
      return "Other"
    }
  }

  const openModal = (type, value) => {
    setModalType(type);
    setModalValue(value);
    setModalVisible(true);
  }

  const openModal2 = (value) => {
    setModal2Visible(true);
  }

  const Update = (Field, value) => {
    setModalVisible(false);
    if (Field == "First Name") {
      setFirstName(value)
      props.updateUser("FirstName", value)
    }
    else if (Field == "Last Name") {
      setLastName(value);
      props.updateUser("LastName", value)
    }
    else if (Field == "Phone Number") {
      setPhonenum(value);
      props.updateUser("phoneNum", value)
    }
    else if (Field == "Gender") {
      setGender(value);
      props.updateUser("gender", value)
    }
    if (!isChanged) {
      setIsChanged(true);
    }
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setUserImg(result.assets[0].uri);
      props.updateUser("userUri", result.assets[0].uri)
      setImageChange(true)
    }
  }

  const cancel = () => {
    console.log('cancel');
    navigation.goBack();
  }

  const setNavigation = async () => navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity style={styles.headerButton} onPress={() => isChanged ? (ImageChange ? sendToFirebase(userImg) : sendDataToNextDB()) : Alert.alert("No Changes")}>
        <Octicons name="check" size={22} />
      </TouchableOpacity>
    ),
  });

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

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => pickImage()}>
        <Image style={styles.image} source={{ uri: userImg }} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => pickImage()}>
        <Text style={styles.imageTxt}>Change image</Text>
      </TouchableOpacity>
      <View style={styles.FieldContainer}>
        {/* <TouchableOpacity underlayColor={'lightgrey'} style={styles.fields} onPress={() => openModal("Email", Email)}>
          <Text style={styles.fieldTxt}>{Email}</Text>
        </TouchableOpacity> */}
        <View style={styles.fieldView} >
          <Text style={styles.fieldHeader}>First Name</Text>
          <TouchableOpacity underlayColor={'lightgrey'} style={styles.fields} onPress={() => openModal("First Name", firstName)}>
            <Text style={styles.fieldTxt}>{firstName}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.fieldView} >
          <Text style={styles.fieldHeader}>Last Name</Text>
          <TouchableOpacity underlayColor={'lightgrey'} style={styles.fields} onPress={() => openModal("Last Name", lastName)}>
            <Text style={styles.fieldTxt}>{lastName}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.fieldView} >
          <Text style={styles.fieldHeader}>Phone Number</Text>
          <TouchableOpacity underlayColor={'lightgrey'} style={styles.fields} onPress={() => openModal("Phone Number", Phonenum)}>
            <Text style={styles.fieldTxt}>{Phonenum}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.fieldView} >
          <Text style={styles.fieldHeader}>Gender</Text>
          <TouchableOpacity underlayColor={'lightgrey'} style={styles.fields} onPress={() => openModal2(Gender)}>
            <Text style={styles.fieldTxt}>{displayGender()}</Text>
          </TouchableOpacity>
        </View>
        <Modal animationType="slide" visible={modalVisible}>
          <FieldChange userId={userId} type={modalType} value={modalValue} cancel={() => setModalVisible(false)} Save={(Field, value) => Update(Field, value)} />
        </Modal>
        <Modal animationType="slide" visible={modal2Visible}>
          <GenderChange userId={userId} Gender={Gender} cancel={() => setModal2Visible(false)} Save={(Gender) => { setModal2Visible(false); Update("Gender",Gender) }} />
        </Modal>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 5,
    alignItems: 'center',
  },
  header: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 35,
    color: '#000',
    fontFamily: 'Urbanist-Bold',
  },
  fields: {
    justifyContent: 'center',
    flex: 5,
    borderRadius: 16,
    borderBottomWidth: 1,
    borderColor: 'lightgrey',
    padding: 10,
  },  
  headerButton: {
    width: SCREEN_WIDTH * 0.1,
    height: SCREEN_HEIGHT * 0.05,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100,
    marginTop: 20,
  },
  imageTxt: {
    color: '#548DFF',
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
    marginTop: 10,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH * 0.95,
    flex: 1,
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#548DFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    height: 45,
    width: SCREEN_WIDTH * 0.45,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 1,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
  },
  cancelbutton: {
    backgroundColor: '#F5F8FF',
    borderRadius: 16,
    height: 45,
    width: SCREEN_WIDTH * 0.45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#548DFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 1,
  },
  cancelbuttonText: {
    color: '#548DFF',
    textAlign: 'center',
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
  },
  fieldTxt: {
    fontSize: 18,
    color: '#000',
    fontFamily: 'Urbanist-Medium',
  },
  FieldContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldHeader: {
    fontSize: 16,
    fontFamily: 'Urbanist-Bold',
    color: '#000',
    marginLeft: SCREEN_WIDTH * 0.03,
    flex:2,
    marginTop: 10,
  },
  fieldView: {   
    flexDirection: 'row',
  },
  personalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: SCREEN_WIDTH * 1,
    // paddingVertical: SCREEN_HEIGHT * 0.04,
},

})