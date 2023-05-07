import { TextInput, View, Text, StyleSheet, Alert, SafeAreaView, TouchableOpacity, Dimensions } from "react-native";
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useState } from "react";
import { AntDesign, Octicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-datepicker';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
// import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../config/firebase';
import { useUserContext } from '../../UserContext';


const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function EditPaymentScreen(props) {
  const [imageChanged, setimageChanged] = useState(false);
  const [show, setShow] = useState(false);
  const [Payment, setPayment] = useState({
    amountToPay: props.data.amountToPay,
    requestId: props.data.requestId,
    requestSubject: props.data.requestSubject,
    requestDate: props.data.requestDate,
    requestProofDocument: props.data.requestProofDocument,
    requestComment: props.data.requestComment,
    requestStatus: props.data.requestStatus,
    userId: props.data.userId
  })
  const [valueChanged, setValueChanged] = useState(false);
  const [PlatformType, setPlatformType] = useState(Platform.OS);
  const {GetUserPending } = useUserContext();

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
      setPayment({ ...Payment, ['requestProofDocument']: result.assets[0].uri })
      setimageChanged(true);

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
      setPayment({ ...Payment, ['requestProofDocument']: result.assets[0].uri })
      setimageChanged(true);
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



  const showDatepicker = () => {
    // showMode('date');
    setShow(true);
  };

  const onChangeDate = (selectedDate) => {
    setValueChanged(true);
    const currentDate = new Date(selectedDate.nativeEvent.timestamp).toISOString().substring(0, 10);
    setShow(false);
    handleInputChange('requestDate', currentDate);
  };

  const handleInputChange = (name, value) => {
    setValueChanged(true);
    setPayment({ ...Payment, [name]: value })
  }

  const Cancel = () => {
    if (valueChanged) {
      Alert.alert(
        'Cancel Changes',
        'are you sure you want to Exit the Page? All changes will be lost',
        [
          { text: "Don't leave", style: 'cancel', onPress: () => { } },
          {
            text: 'Leave',
            style: 'destructive',
            // If the user confirmed, then we dispatch the action we blocked earlier
            // This will continue the action that had triggered the removal of the screen
            onPress: () => props.cancel()
          },
        ]
      );
    }
    else {
      props.cancel();
    }
  }

  //removed from page
  // const Delete = () => {
  //   Alert.alert(
  //     'Delete request',
  //     'are you sure you want to Delete? All changes will be lost',
  //     [
  //       { text: "Don't leave", style: 'cancel', onPress: () => { } },
  //       {
  //         text: 'Leave',
  //         style: 'destructive',
  //         // If the user confirmed, then we dispatch the action we blocked earlier
  //         // This will continue the action that had triggered the removal of the screen
  //         onPress: () => {
  //           let res = fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Payments/DeletePayment/' + Payment.requestId, {
  //             method: 'DELETE',
  //             headers: {
  //               'Content-Type': 'application/json',
  //             },
  //           });
  //           console.log(res);
  //           props.cancel();
  //         }
  //       },
  //     ]
  //   );
  // }

  const sendToFirebase = async (image) => {
    // if the user didn't upload an image, we will use the default image
    if (imageChanged) {
      console.log('image', image);
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
              setPayment({ ...Payment, requestProofDocument: downloadURL });
              savePayment(downloadURL);
            });
          }
        );
      } catch (error) {
        console.error(error);
        Alert.alert('Upload Error', 'Sorry, there was an error uploading your image. Please try again later.');
      }
    } else {
      savePayment(Payment.requestProofDocument);
    }

  }

  const savePayment = async (downloadURL) => {
    const temp = {
      requestId: Payment.requestId,
      amountToPay: Payment.amountToPay,
      requestSubject: Payment.requestSubject,
      requestDate: Payment.requestDate,
      requestProofDocument: downloadURL,
      requestComment: Payment.requestComment,
      requestStatus: Payment.requestStatus,
      userId: Payment.userId
    }
    console.log(temp);
    fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Payments/UpdateRequest', {
      method: 'PUT',
      body: JSON.stringify(temp),
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
          GetUserPending()
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
          <View>
            <View style={styles.centeredView}>
              <TouchableOpacity style={styles.closeBtn} onPress={Cancel}>
                <AntDesign name="close" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.title}>Edit Payment #{Payment.requestId}</Text>
              {/* close btn icon */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={Payment.requestSubject}
                  placeholder='Reason'
                  keyboardType='ascii-capable'
                  onChangeText={(value) => handleInputChange('requestSubject', value)}
                />
                {PlatformType !== 'ios' ? <TouchableOpacity style={styles.datePicker} onPress={showDatepicker}>
                  <Text style={styles.dateInputTxt}>
                    {Payment.requestDate.substring(0, 10)}
                  </Text>
                  {/* <Octicons style={{ textAlign: 'right' }} name="calendar" size={22} /> */}
                </TouchableOpacity> : <DatePicker
                  useNativeDriver={'true'}
                  showIcon={false}
                  style={styles.inputFull}
                  date={Payment.requestDate}
                  mode="date"
                  placeholder="Date"
                  format="YYYY-MM-DD"
                  minDate="2000-01-01"
                  maxDate={new Date()}
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
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
                  onDateChange={(value) => handleInputChange('requestDate', value)}
                />}

                {show && (
                  <DateTimePicker
                    //testID="dateTimePicker"
                    value={new Date(Payment.requestDate)}
                    // mode={"date"}
                    is24Hour={true}
                    onChange={(value) => onChangeDate(value)}
                    display="default"
                    maximumDate={new Date()}
                  />
                )}
                <TextInput
                  style={[styles.input]}
                  placeholder='Amount'
                  value={`${Payment.amountToPay}`}
                  keyboardType='ascii-capable'
                  onChangeText={(value) => handleInputChange('amountToPay', value)}
                  inputMode='decimal'
                />
                <TextInput
                  style={[styles.input, { height: 150, textAlignVertical: 'top' }]}
                  editable
                  multiline
                  numberOfLines={4}
                  maxLength={200}
                  placeholder='Enter comment ( optional )'
                  value={Payment.requestComment}
                  keyboardType='ascii-capable'
                  onChangeText={(value) => handleInputChange('requestComment', value)}
                />
                <View style={styles.bottom}>
                  <TouchableOpacity style={styles.cancelbutton} onPress={pickOrTakeImage}>
                    <Text style={styles.cancelbuttonText}>Pick Document</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.savebutton} onPress={() => sendToFirebase(Payment.requestProofDocument)}>
                    <Text style={styles.savebuttonText}>Update</Text>
                  </TouchableOpacity>
                </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    backgroundColor: '#fff'
  },
  inputContainer: {
    padding: 20,
  },
  closeBtn: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: Dimensions.get('window').width * 1,
  },
  input: {
    width: Dimensions.get('window').width * 0.95,
    marginBottom: 10,
    paddingLeft: 10,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E6EBF2',
    shadowColor: '#000',
    height: 54,
    fontFamily: 'Urbanist-Medium',
    fontSize: 16,
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
    fontFamily: 'Urbanist-Medium',
    fontSize: 16,
    justifyContent: 'center',    
  },
  datePicker: {
    flexDirection: 'row',
    // justifyContent: 'center',
    width: Dimensions.get('window').width * 0.95,
    marginBottom: 10,
    // paddingLeft: 10,
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
  savebutton: {
    backgroundColor: '#548DFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    height: 54,
    width: SCREEN_WIDTH * 0.45,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 1,
  },
  cancelbutton: {
    backgroundColor: '#F5F8FF',
    borderRadius: 16,
    height: 54,
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
    height: 54,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH * 0.95,
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
  title: {
    fontSize: 26,
    fontFamily: 'Urbanist-Bold',
    margin: 20,
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  contactheader: {
    fontFamily: 'Urbanist-Bold',
    marginLeft: 7,
    textAlign: 'left',
  },
  numbersInput: {
    flexDirection: 'row',
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
  uploaddbuttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
  },
});