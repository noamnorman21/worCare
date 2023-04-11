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
import { Ionicons, Octicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';

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
  const [placeHolder, setPlaceHolder] = useState(null);
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
        <Text style={styles.headerButtonText}>Done</Text>
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
        <Text style={styles.imageTxt}>Edit profile picture</Text>
      </TouchableOpacity>
      <View style={styles.FieldContainer}>
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
          <View style={styles.fields}>
            <TextInput
              style={styles.fieldTxt}
              placeholder={Phonenum}
              onChangeText={text => setPhonenum(text)}
              value={Phonenum}
            />
          </View>
        </View>
        <View style={styles.fieldView} >
          <Text style={styles.fieldHeader}>Gender</Text>
          <TouchableOpacity underlayColor={'lightgrey'} style={styles.fields} onPress={() => openModal2(Gender)}>
            <Text style={styles.fieldTxt}>{displayGender()}</Text>
            <Ionicons style={styles.arrowLogoStyle} name="chevron-forward" size={24} color="grey" />
          </TouchableOpacity>
        </View>
        <Modal animationType="slide" visible={modalVisible}>
          <FieldChange userId={userId} type={modalType} value={modalValue} cancel={() => setModalVisible(false)} Save={(Field, value) => Update(Field, value)} />
        </Modal>
        <Modal animationType="slide" visible={modal2Visible}>
          <GenderChange userId={userId} Gender={Gender} cancel={() => setModal2Visible(false)} Save={(Gender) => { setModal2Visible(false); Update("Gender", Gender) }} />
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
  logoStyle: {
    marginLeft: SCREEN_WIDTH * 0.03,
    marginRight: SCREEN_WIDTH * 0.06
  },
  arrowLogoStyle: {
    position: 'absolute',
    right: SCREEN_WIDTH * 0.03,
  },
  header: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fields: {
    justifyContent: 'center',
    flex: 3.75,
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
  headerButtonText: {
    color: '#548DFF',
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
  },
  fieldTxt: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Urbanist-Light',
  },
  FieldContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldHeader: {
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
    color: '#000',
    marginLeft: SCREEN_WIDTH * 0.03,
    flex: 2,
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
  },
})