import { TextInput, View, Text, StyleSheet, Alert, SafeAreaView, TouchableOpacity, Dimensions } from "react-native";
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useState } from "react";
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Octicons } from '@expo/vector-icons';
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function EditPaycheck(props) {

  const [isChanged, setisChanged] = useState(false);
  const [imageChanged, setimageChanged] = useState(false);
  const [Paycheck, setPaycheck] = useState({
    paycheckDate: props.data.paycheckDate,
    paycheckSummary: props.data.paycheckSummary,
    paycheckComment: props.data.paycheckComment,
    payCheckNumber: props.data.payCheckNum,
    userId: props.data.UserId,
  })
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date');


 

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    alert(result.uri);
    changeIMG(result.uri);

  };

  const changeIMG = (imageFromUser) => {
    setPaycheck({ ...Paycheck, requestProofDocument: imageFromUser });
    if (!imageChanged) {
      setimageChanged(true);
    }
  }




  const showMode = (currentMode) => {
    if (Platform.OS === 'android') {
      setShow(true);
      // for iOS, add a button that closes the picker
    }
    if (Platform.OS === 'ios') {
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
    handleInputChange('paycheckDate', currentDate);
  };






  const handleInputChange = (name, value) => {

    setPaycheck({ ...Paycheck, [name]: value })
    if (name == 'paycheckDate') {
      setShow(false);
      console.log('date changed');
    }
    if (!isChanged) {
      setisChanged(true);
    }
  }
  const Cancel = () => {
    if (isChanged) {
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
    } else {
      props.cancel();
    }
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
            let res = fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Paychecks/DeletePaycheck/' + Paycheck.payCheckNumber, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            console.log("Delete Paycheck: " + Paycheck.payCheckNumber);
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
              setPaycheck({ ...Paycheck, requestProofDocument: downloadURL });
              savePaycheck(downloadURL);
            });
          }
        );
      } catch (error) {
        console.error(error);
        Alert.alert('Upload Error', 'Sorry, there was an error uploading your image. Please try again later.');
      }
    } else {
      savePaycheck(Paycheck.requestProofDocument);
    }

  }

  const savePaycheck = async (downloadURL) => {

    const temp = {
      paycheckDate: Paycheck.paycheckDate,
      paycheckSummary: Paycheck.paycheckSummary,
      paycheckComment: Paycheck.paycheckComment,
      payCheckNum: Paycheck.payCheckNumber,
      userId: Paycheck.userId,
    }
    console.log(temp);

    fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Paychecks/UpdatePayCheck', {
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
          props.save(temp);
        },
        (error) => {
          console.log("err post=", error);
        });
  }




  return (

      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
          <SafeAreaView style={styles.container}>
          <TouchableOpacity style={styles.cancelbutton} onPress={Cancel}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>Edit Paycheck {Paycheck.payCheckNumber}</Text>
            <View style={styles.inputContainer}>
              <TouchableOpacity style={styles.datePicker} onPress={showDatepicker}>
                <Octicons name="calendar" size={22} />
                <Text style={styles.dateInputTxt}>{Paycheck.paycheckDate.substring(0, 10)}</Text>
              </TouchableOpacity>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={new Date(Paycheck.paycheckDate)}
                  mode={"date"}
                  minimumDate={new Date(2020, 0, 1)}
                  is24Hour={true}
                  onChange={(value) => onChangeDate(value)}
                  display="default"
                  maximumDate={new Date()}
                />
              )} 
                        
              <TextInput
                style={styles.input}
                value={Paycheck.paycheckSummary}
                keyboardType='decimal-pad'
                onChangeText={(value) => handleInputChange('paycheckSummary', value)}
              />
              <TextInput
                style={styles.input}
                value={Paycheck.paycheckComment}
                keyboardType='ascii-capable'
                placeholder="Comment"
                onChangeText={(value) => handleInputChange('paycheckComment', value)}
              />
              <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
                <Text style={styles.uploaddbuttonText}>Upload document</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.bottom}>
              <TouchableOpacity style={styles.savebutton} onPress={() => sendToFirebase(Paycheck.requestProofDocument)}>
                <Text style={styles.savebuttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelbutton} onPress={Cancel}>
                <Text style={styles.cancelbuttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.Deletebutton} onPress={Delete}>
              <Text style={styles.cancelbuttonText}>Delete</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>


  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    height: Dimensions.get('window').height * 1
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
    backgroundColor: '#fff',
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
    position: 'absolute',
    top:0,
    right: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
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
    backgroundColor: '#fff',
  },
  dateInputTxt: {
    color: '#000',
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: 'Urbanist-Regular',
    paddingRight: 10,
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
