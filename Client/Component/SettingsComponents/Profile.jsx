import { View, Text, SafeAreaView, StyleSheet, Alert, TouchableOpacity, Dimensions, Image } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Modal } from 'react-native';
import FieldChange from './FieldChange';
import GenderChange from './GenderChange';

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../config/firebase';
import ImageChange from './ImageChange';


export default function Profile({ navigation }) {
  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [Gender, setGender] = useState(null);
  const [Phonenum, setPhonenum] = useState(null);
  const [userImg, setUserImg] = useState(null);
  const [Email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [ImageChange, setImageChange] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalValue, setModalValue] = useState('');
  const [modal2Visible, setModal2Visible] = useState(false);

  const sendToFirebase = async (image) => {

    // if the user didn't upload an image, we will use the default image
    if (userImg === null) {
      //זה תמונה מכוערת -נועם תחליף אותה
      let defultImage = "https://png.pngtree.com/element_our/20200610/ourmid/pngtree-character-default-avatar-image_2237203.jpg"
      sendDataToNextDB(defultImage);
    }
    const filename = image.substring(image.lastIndexOf('/') + 1);
    const storageRef = ref(storage, "images/" + filename);
    const blob = await fetch(image).then(response => response.blob());
    try {
      const uploadTask = uploadBytesResumable(storageRef, blob);
      uploadTask.on('state_changed',
        snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% complete`);
        },
        error => {
          console.error(error);
          Alert.alert('Upload Error', 'Sorry, there was an error uploading your image. Please try again later.');
        },
        () => {
          getDownloadURL(storageRef).then(downloadURL => {
            console.log('File available at', downloadURL);
            sendDataToNextDB(downloadURL);
          });
        }
      );
    } catch (error) {
      console.error(error);
      Alert.alert('Upload Error', 'Sorry, there was an error uploading your image. Please try again later.');
      sendDataToNextDB();
    }
  }

  const sendDataToNextDB = (downloadURL) => {
    const userToUpdate = {
      Email: Email,
      userUri: downloadURL == null ? userImg : downloadURL,
      phoneNum: Phonenum,
      gender: Gender,
      FirstName: firstName,
      LastName: lastName, 
      Id: userId,
      Password: password    
    }
    const jsonValue = JSON.stringify(userToUpdate)
    AsyncStorage.setItem('userData', jsonValue);   
  

    // fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar1/api/Settings/UpdateUser', {
    //   method: 'PUT',
    //   headers: new Headers({
    //     'Content-Type': 'application/json; charset=UTF-8',
    //     'Accept': 'application/json; charset=UTF-8',

    //   }),
    //   body: JSON.stringify(userToUpdate)
    // })
    //   .then(res => {
    //     return res.json()
    //   }
    //   )
    //   .then(
    //     (result) => {
    //       console.log("fetch POST= ", result);
    //       Alert.alert('Image Changed', 'Your image has been changed successfully');
    //     }
    //   )
    //   .catch((error) => {
    //     console.log('Error:', error.message);
    //   }
    //   );

    navigation.goBack();

  }

const displayGender = () => {
  if (Gender=="M"){
    return "Male"
  }
  else if (Gender=="F"){
    return "Female"
  }
  else{
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
    }
    else if (Field == "Last Name") {
      setLastName(value);
    }
    else if (Field == "Phone Number") {
      setPhonenum(value);
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
      setImageChange(true)
    }

  }

  

  const cancel = () => {
    console.log('cancel');
    navigation.goBack();
  }




  useEffect(() => {
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('userData');
        const userData = jsonValue != null ? JSON.parse(jsonValue) : null;
        console.log('Profie', userData);
        setUserId(userData.Id);
        setFirstName(userData.FirstName);
        setLastName(userData.LastName);
        setGender(userData.gender)
        setUserImg(userData.userUri)
        setPhonenum(userData.phoneNum)
        setEmail(userData.Email)
        setPassword(userData.Password)
      } catch (e) {
        console.log('error', e);
      }
    };
    getData();
  }, []);






  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>
      <TouchableOpacity style={styles.imageContainer} onPress={() => pickImage()}>
        <Image style={styles.image} source={{ uri: userImg }} />
      </TouchableOpacity>
      <View style={styles.FieldContainer}>
        <TouchableOpacity underlayColor={'lightgrey'} style={styles.fields} onPress={() => openModal("First Name", firstName)}>
          <Text style={styles.fieldTxt}>{firstName}</Text>
        </TouchableOpacity>
        <TouchableOpacity underlayColor={'lightgrey'} style={styles.fields} onPress={() => openModal("Last Name", lastName)}>
          <Text style={styles.fieldTxt}>{lastName}</Text>
        </TouchableOpacity>
        <TouchableOpacity underlayColor={'lightgrey'} style={styles.fields} onPress={() => openModal("Phone Number", Phonenum)}>
          <Text style={styles.fieldTxt}>{Phonenum}</Text>
        </TouchableOpacity>
        <TouchableOpacity underlayColor={'lightgrey'} style={styles.fields} onPress={() => openModal2(Gender)}>
          <Text style={styles.fieldTxt}>{displayGender()}</Text>
        </TouchableOpacity>
        <View style={styles.bottom}>
          <TouchableOpacity onPress={() => ImageChange ? sendToFirebase(userImg): sendDataToNextDB()} style={styles.button}>
            <Text style={styles.buttonText}>Save to DB</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={cancel} style={styles.cancelbutton}>
            <Text style={styles.cancelbuttonText}>Cancel All Changes</Text>
          </TouchableOpacity>
        </View>
        <Modal animationType="slide" visible={modalVisible}>
          <FieldChange userId={userId} type={modalType} value={modalValue} cancel={() => setModalVisible(false)} Save={(Field, value) => Update(Field, value)} />
        </Modal>
        <Modal animationType="slide" visible={modal2Visible}>
          <GenderChange userId={userId} cancel={() => setModal2Visible(false)} Save={(Gender) => { setModal2Visible(false); setGender(Gender) }} />
        </Modal>
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
  header: {
    marginTop: 20,

    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
  },
  smallTitle: {
    fontSize: 15,
    color: '#000',
  },
  fields: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderBottomWidth: 1,
    borderColor: 'lightgrey',
    padding: 10,

  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Dimensions.get('window').width * 0.0,
    marginTop: Dimensions.get('window').height * 0.02,
    marginBottom: Dimensions.get('window').height * 0.02,
  },
  image: {
    width: Dimensions.get('window').width * 0.3,
    height: Dimensions.get('window').height * 0.15,
    borderRadius: 100,


  },
  bottom: {
    flex: 5,
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
  fieldTxt: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  FieldContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})