import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, SafeAreaView, Alert, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { storage } from '../../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import { useUserContext } from '../../UserContext';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign, Octicons } from '@expo/vector-icons';
import DatePicker from 'react-native-datepicker';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function NewPaycheck(props) {
  const [PlatformType, setPlatformType] = useState(Platform.OS);
  const { userContext } = useUserContext();
  const [PayCheck, setPayCheck] = useState({
    paycheckDate: null,
    paycheckSummary: '',
    paycheckComment: '',
    userId: userContext.userId,
    paycheckProofDocument: null,
  })

  const [show, setShow] = useState(false);
  const [dateSelected, setDateSelected] = useState(false);
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
    setDateSelected(true);
    handleInputChange('paycheckDate', currentDate);
  };

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
      setPayCheck({ ...PayCheck, paycheckProofDocument: result.assets[0].uri })
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
      setPayCheck({ ...PayCheck, paycheckProofDocument: result.assets[0].uri })
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

  const handleInputChange = (name, value) => {
    setPayCheck({ ...PayCheck, [name]: value });
  };

  const sendToFirebase = async (image) => {
    // if the user didn't upload an image, we will use the default image
    if (PayCheck.paycheckProofDocument === null) {
      Alert.alert('Please select an image');
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
            setPayCheck({ ...PayCheck, paycheckProofDocument: downloadURL });
            savePaycheck(downloadURL);
          });
        }
      );
    } catch (error) {
      console.error(error);
      Alert.alert('Upload Error', 'Sorry, there was an error uploading your image. Please try again later.');
    }
  };

  const savePaycheck = async (downloadURL) => {
    const Newcheck = {
      paycheckDate: PayCheck.paycheckDate,
      paycheckSummary: PayCheck.paycheckSummary,
      paycheckComment: PayCheck.paycheckComment,
      userId: PayCheck.userId,
      paycheckProofDocument: downloadURL
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
    fetch('https://proj.ruppin.ac.il/cgroup94/prod/api/PayChecks/NewPayCheck', {
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
              <Text style={styles.title}>Add New Paycheck</Text>
            </View>
            {PlatformType !== 'ios' ? <TouchableOpacity style={styles.datePicker} onPress={showDatepicker}>
              {!dateSelected ? <Text style={styles.dateInputTxt}>
                {PayCheck.paycheckDate ? PayCheck.paycheckDate : 'Date'}
              </Text> :
                <Text style={styles.dateInputTxtSelected}>
                  {PayCheck.paycheckDate ? PayCheck.paycheckDate : 'Date'}
                </Text>}
              {/* <Octicons style={{ textAlign: 'right' }} name="calendar" size={22} /> */}
            </TouchableOpacity> :
              <DatePicker
                useNativeDriver={'true'}
                showIcon={false}
                style={styles.inputFull}
                date={PayCheck.paycheckDate}
                mode="date"
                placeholder="Date"
                format="YYYY-MM-DD"
                minDate="2000-01-01"
                maxDate={new Date()}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    marginLeft: 0.2
                  },
                  dateInput: {
                    marginLeft: 0,
                    alignItems: 'flex-start', //change to center for android
                    borderWidth: 0,
                  },
                  placeholderText: {
                    color: 'gray',
                    fontFamily: 'Urbanist',
                    fontSize: 16,
                    textAlign: 'left',
                  },
                  dateText: {
                    color: 'black',
                    fontFamily: 'Urbanist-Medium',
                    fontSize: 16,
                    textAlign: 'left',
                  }
                }}
                onDateChange={(value) =>   handleInputChange('paycheckDate', value)}
              />}

            {show && (
              <DateTimePicker
                //testID="dateTimePicker"
                value={new Date(PayCheck.paycheckDate)}
                // mode={"date"}
                is24Hour={true}
                placeholder="Date"
                minimumDate={new Date(2020, 0, 1)}
                maxDate={new Date()}
                onChange={(value) => onChangeDate(value)}
                display="default"
                maximumDate={new Date()}
              />
            )}
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input]}
                placeholder='Summary'
                keyboardType='decimal-pad'
                onChangeText={(value) => handleInputChange('paycheckSummary', value)}
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
                onChangeText={(value) => handleInputChange('paycheckComment', value)}
              />
              <TouchableOpacity style={styles.uploadButton} onPress={pickOrTakeImage}>
                <Text style={styles.buttonText}>Upload document</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.uploadButton} onPress={() => sendToFirebase(PayCheck.paycheckProofDocument)}>
                <Text style={styles.savebuttonText}>Send request</Text>
              </TouchableOpacity>
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
    padding: 10,
    backgroundColor: '#fff',
  },
  closeBtn: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: Dimensions.get('window').width * 0.9,
    marginVertical: 30,
  },
  inputFull: {
    width: Dimensions.get('window').width * 0.95,
    marginBottom: 10,
    paddingLeft: 10,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E6EBF2',
    shadowColor: '#000',
    height: 54,
    fontFamily: 'Urbanist-Light',
    fontSize: 16,
    justifyContent: 'center',
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
  datePicker: {
    flexDirection: 'row',
    // justifyContent: 'center',
    marginBottom: 0,
    width: Dimensions.get('window').width * 0.95,
    paddingLeft: 10,
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
    color: '#9E9E9E',
    fontSize: 16,
    fontFamily: 'Urbanist-Medium',
  },
  dateInputTxtSelected: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'Urbanist-Medium',
  },
});

