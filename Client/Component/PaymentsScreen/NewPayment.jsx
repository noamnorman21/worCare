import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, SafeAreaView, Alert, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { storage } from '../../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserContext } from '../../UserContext';
import moment from "moment";
import { AntDesign } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function NewPayment(props) {
  const { userContext } = useUserContext();
  const [payment, setPayment] = useState({
    amountToPay: '',
    requestSubject: '',
    requestDate: moment().format('YYYY-MM-DD'),
    requestProofDocument: '',
    requestComment: '',
    requestStatus: 'P',
    userId: null // will be changed to current user id,
  })

  useEffect(() => {
    AsyncStorage.getItem('userData').then((value) => {
      const data = JSON.parse(value);
      setPayment({ ...payment, userId: userContext.userId });
    })
  }, []);

  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("You've refused to allow this appp to access your camera!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync(
      {
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 0.1,
      }
    );
    // Explore the result
    console.log(result);
    if (!result.canceled) {
      changeIMG(result.assets[0].uri)
    }
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.1,
    });
    // Explore the result
    console.log(result);
    if (!result.canceled) {
      changeIMG(result.assets[0].uri)
    }
  };

  const pickOrTakeImage = async () => {
    Alert.alert(
      'Choose an option',
      'Choose an option to upload an image',
      [
        {
          text: 'Take a photo',
          onPress: () => openCamera(),
        },
        {
          text: 'Choose from gallery',
          onPress: () => pickImage(),
        },
      ],
    );
  }

  const changeIMG = (imageFromUser) => {
    setPayment({ ...payment, requestProofDocument: imageFromUser });
  }

  const handleInputChange = (name, value) => {
    setPayment({ ...payment, [name]: value });
  };

  const sendToFirebase = async (image) => {
    // if the user didn't upload an image, we will use the default image
    if (payment.requestProofDocument === '' || payment.requestProofDocument === undefined) {
      return Alert.alert('Please upload an image');
    }
    if (payment.amountToPay === '') {
      Alert.alert('Please enter amount');
      return;
    }
    if (payment.requestSubject === '') {
      Alert.alert('Please enter subject');
      return;
    }
    const filename = image.substring(image.lastIndexOf('/') + 1);
    const storageRef = ref(storage, "requests/" + filename);
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
            setPayment({ ...payment, requestProofDocument: downloadURL });
            savePayment(downloadURL);
          });
        }
      );
    }
    catch (error) {
      console.error(error);
      Alert.alert('Upload Error', 'Sorry, there was an error uploading your image. Please try again later.');
    }
  };

  const savePayment = async (downloadURL) => {
    const NewPayment = {
      amountToPay: payment.amountToPay,
      requestSubject: payment.requestSubject,
      requestDate: payment.requestDate,
      requestProofDocument: downloadURL,
      requestComment: payment.requestComment,
      requestStatus: payment.requestStatus,
      userId: payment.userId
    }
    console.log('NewPayment', NewPayment);
    fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Payments/NewRequest', {
      method: 'POST',
      body: JSON.stringify(NewPayment),
      headers: new Headers({
        'Content-Type': 'application/json; charset=UTF-8',
      })
    })
      .then(res => {
        return res.json()
      })
      .then(
        (result) => {
          console.log("fetch POST= ", result);
          props.cancel();
        },
        (error) => {
          console.log("err post=", error);
        });
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
          <View style={styles.centeredView}>
            <TouchableOpacity style={styles.cancelbutton} onPress={props.cancel}>
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.title}>Add New Request</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder='Subject'
                keyboardType='ascii-capable'
                onChangeText={(value) => handleInputChange('requestSubject', value)}
              />
              <TextInput
                style={[styles.input]}
                placeholder='Amount'
                keyboardType='decimal-pad'
                onChangeText={(value) => handleInputChange('amountToPay', value)}
                inputMode='decimal'
              />
              <TextInput
                style={[styles.input, { height: 150, textAlignVertical: 'top' }]}
                editable
                multiline
                numberOfLines={4}
                maxLength={300}
                placeholder='Add comment ( Optional )'
                keyboardType='ascii-capable'
                onChangeText={(value) => handleInputChange('requestComment', value)}
              />
              <TouchableOpacity style={styles.uploadButton} onPress={pickOrTakeImage}>
                <Text style={styles.buttonText}>Upload document</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.uploadButton} onPress={() => sendToFirebase(payment.requestProofDocument)}>
                <Text style={styles.savebuttonText}>Send request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontFamily: 'Urbanist-Bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  inputContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    width: Dimensions.get('window').width * 0.95,
    marginVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E6EBF2',
    shadowColor: '#000',
    height: 54,
    fontFamily: 'Urbanist-Medium',
    fontSize: 16,
  },
  uploadButton: {
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginVertical: 10,
    borderRadius: 16,
    backgroundColor: '#548DFF'
  },
  savebutton: {
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
  cancelbutton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: Dimensions.get('window').width * 0.9,
    marginVertical: 30,
  },
  savebuttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH * 0.95,
  },
});