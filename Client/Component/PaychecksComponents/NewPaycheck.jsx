import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, SafeAreaView, Alert, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { storage } from '../../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import * as DocumentPicker from 'expo-document-picker';
import { useUserContext } from '../../UserContext';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign, Octicons } from '@expo/vector-icons';



const SCREEN_WIDTH = Dimensions.get('window').width;

export default function NewPaycheck(props) {
  const { userContext } = useUserContext();
  const [PayCheck, setPayCheck] = useState({
    paycheckDate: null,
    paycheckSummary: '',
    paycheckComment: '',
    userId: userContext.userId
  })
  
  const [show, setShow] = useState(false);

  const showMode = (currentMode) => {
    if (Platform.OS === 'android') {
      setShow(true);
      // for iOS, add a button that closes the picker
    }
    else {
      setShow(true);
    }

  };

  const showDatepicker = () => {
    showMode('date');
  };

  const onChangeDate = (selectedDate) => {
    const currentDate = new Date(selectedDate.nativeEvent.timestamp).toISOString().substring(0, 10);
    setShow(false);
    handleInputChange('paycheckDate', currentDate);
  };





  const pickDocument = async () => {

    let result = await DocumentPicker.getDocumentAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
    });

    // changeIMG(result.uri);

  };



  const handleInputChange = (name, value) => {
    setPayCheck({ ...PayCheck, [name]: value });
  };

  const sendToFirebase = async (image) => {
    // if the user didn't upload an image, we will use the default image
   
    if (PayCheck.paycheckDate === null) {
      Alert.alert('Please select date');
      return;
    }    
    console.log('image', image);
    const filename = image.substring(image.lastIndexOf('/') + 1);
    const storageRef = ref(storage, "Paychecks/" + filename);
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
            savePaycheck(downloadURL);
          });
        }
      );
    } catch (error) {
      console.error(error);
      Alert.alert('Upload Error', 'Sorry, there was an error uploading your image. Please try again later.');
    }
  };

  const savePaycheck = async () => {
    const Newcheck = {
      paycheckDate: PayCheck.paycheckDate,
      paycheckSummary: PayCheck.paycheckSummary,
      paycheckComment: PayCheck.paycheckComment,
      userId: PayCheck.userId
    }
    console.log("Newcheck", Newcheck);
   if (Newcheck.paycheckDate === null) {
      Alert.alert('Please select date');
      return;
    }
    if (Newcheck.paycheckSummary === '') {
      Alert.alert('Please enter paycheck Summary');
      return;
    }
    console.log("Newcheck", Newcheck);

    fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/PayChecks/NewPayCheck', {
      method: 'POST',
      body: JSON.stringify(Newcheck),
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
          <TouchableOpacity style={styles.closeBtn} onPress={props.cancel}>
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.header}>
              <Text style={styles.title}>New Paycheck</Text>
            </View>
            <TouchableOpacity style={styles.datePicker} onPress={showDatepicker}>
              <Octicons name="calendar" size={22} />
              <Text style={styles.dateInputTxt}>{PayCheck.paycheckDate}</Text>
            </TouchableOpacity>
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={new Date(PayCheck.paycheckDate)}
                mode={"date"}
                minimumDate={new Date(2020, 0, 1)}
                is24Hour={true}
                onChange={(value) => onChangeDate(value)}
                display="default"
                maximumDate={new Date()}
              />
            )}
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input]}
                placeholder='summary'
                keyboardType='decimal-pad'
                onChangeText={(value) => handleInputChange('paycheckSummary', value)}
                inputMode='decimal'
              />
              <TextInput
                style={styles.commentInput}
                placeholder='Add comment'
                keyboardType='ascii-capable'
                onChangeText={(value) => handleInputChange('paycheckComment', value)}
              />
              <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
                <Text style={styles.buttonText}>Upload document</Text>
              </TouchableOpacity>
              <View style={styles.bottom}>
                <TouchableOpacity style={styles.savebutton} onPress={() => savePaycheck()}>
                  <Text style={styles.savebuttonText}>Upload Paycheck</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelbutton} onPress={props.cancel}>
                  <Text style={styles.cancelbuttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>

  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  title: {
    color: '#000',
    fontSize: 24,
    padding: 20,
    fontFamily: 'Urbanist-Bold'
  },
  inputContainer: {
    width: SCREEN_WIDTH * 0.95,
    marginTop: 10,
  },
  closeBtn: {
    position: 'absolute',
    top: 100,
    right: 30,
  },
  input: {
    width: Dimensions.get('window').width * 0.95,
    marginBottom: 10,
    paddingLeft: 20,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E6EBF2',
    shadowColor: '#000',
    height: 54,
    fontFamily: 'Urbanist-Light',
    fontSize: 16,
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
  uploadButton: {
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: '#548DFF'
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
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
  },
  savebuttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
  },
  cancelbuttonText: {
    color: '#548DFF',
    textAlign: 'center',
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
  },
  commentInput: {
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E6EBF2',
    height: 90,
    width: Dimensions.get('window').width * 0.95,
    marginBottom: 10,
    paddingLeft: 20,
    fontFamily: 'Urbanist-Light',
    fontSize: 16,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH * 0.95,
    bottom: -50, //to make the buttons appear above the keyboard 
  },
  datePicker: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: Dimensions.get('window').width * 0.95,
    marginBottom: 10,
    paddingLeft: 20,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E6EBF2',
    shadowColor: '#000',
    height: 54,
    fontFamily: 'Urbanist-Light',
    fontSize: 16,

  },
  dateInputTxt: {
    color: '#000',
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: 'Urbanist-Regular',
    paddingRight: 10,
  },
  Deletebutton: {
    width: Dimensions.get('window').width * 0.95,
    backgroundColor: '#F5F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#548DFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 1,
    marginTop: 10,
    height: 45,
  },

});
