
import { TextInput, View, Text, StyleSheet, Alert, SafeAreaView, TouchableOpacity, Dimensions } from "react-native";
import { useState } from "react";
import { Octicons } from '@expo/vector-icons';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import * as DocumentPicker from 'expo-document-picker';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function EditPaymentScreen(props) {
  const [imageChanged, setimageChanged] = useState(false);
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

  const [show, setShow] = useState(false);
  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    alert(result.uri);
    changeIMG(result.uri);
  };

  const changeIMG = (imageFromUser) => {
    setPayment({ ...Payment, requestProofDocument: imageFromUser });
    if (!imageChanged) {
      setimageChanged(true);
    }
  }

  const showMode = (currentMode) => {
    if (Platform.OS === 'android') {
      setShow(true);
      // for iOS, add a button that closes the picker
    }
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const onChangeDate = (selectedDate) => {
    const currentDate = new Date(selectedDate.nativeEvent.timestamp).toISOString().substring(0, 10);

    setShow(false);
    handleInputChange('requestDate', currentDate);
  };

  const handleInputChange = (name, value) => {
    setPayment({ ...Payment, [name]: value })
  }
  const Cancel = () => {
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

  const Delete = () => {
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
          onPress: () => {
            let res = fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Payments/DeletePayment/' + Payment.requestId, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            console.log(res);
            props.cancel();
          }
        },
      ]
    );
  }

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
            <Text style={styles.title}>Edit Payment {Payment.requestId}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={Payment.requestSubject}
                placeholder='Reason'
                keyboardType='ascii-capable'
                onChangeText={(value) => handleInputChange('requestSubject', value)}
              />
              <TouchableOpacity style={styles.datePicker} onPress={showDatepicker}>
                <Octicons name="calendar" size={22} />
                <Text style={styles.dateInputTxt}>{Payment.requestDate.substring(0, 10)}</Text>
              </TouchableOpacity>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={new Date(Payment.requestDate)}
                  mode={"date"}
                  is24Hour={true}
                  onChange={(value) => onChangeDate(value)}
                  display="default"
                  maximumDate={new Date()}
                />
              )}
              <TextInput
                style={[styles.input]}
                placeholder='Amount'
                value={Payment.amountToPay}
                keyboardType='ascii-capable'
                onChangeText={(value) => handleInputChange('amountToPay', value)}
                inputMode='decimal'
              />
              <TextInput
                style={styles.commentInput}
                placeholder='Enter comment'
                value={Payment.requestComment}
                keyboardType='ascii-capable'
                onChangeText={(value) => handleInputChange('requestComment', value)}
              />
              <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
                <Text style={styles.uploaddbuttonText}>Upload document</Text>
              </TouchableOpacity>
              <View style={styles.bottom}>
                <TouchableOpacity style={styles.savebutton} onPress={() => sendToFirebase(Payment.requestProofDocument)}>
                  <Text style={styles.savebuttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelbutton} onPress={Cancel}>
                  <Text style={styles.cancelbuttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.bottom}>
                <TouchableOpacity style={styles.Deletebutton} onPress={Delete}>
                  <Text style={styles.cancelbuttonText}>Delete</Text>
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
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    height: Dimensions.get('window').height * 1,
    backgroundColor: '#fff'
  },
  inputContainer: {
    padding: 20,
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
