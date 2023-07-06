import { TextInput, View, Text, StyleSheet, Alert, SafeAreaView, TouchableOpacity, Dimensions } from "react-native";
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign, Octicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../config/firebase';
import DatePicker from 'react-native-datepicker';
const SCREEN_WIDTH = Dimensions.get('window').width;
import { useUserContext } from "../../UserContext";

export default function EditPaycheck(props) {
  const {getPaychecks} = useUserContext();
  const [imageChanged, setImageChanged] = useState(false);
  const [valueChanged, setValueChanged] = useState(false);
  const [Paycheck, setPaycheck] = useState({
    paycheckDate: props.data.paycheckDate,
    paycheckSummary: props.data.paycheckSummary,
    paycheckComment: props.data.paycheckComment,
    payCheckNumber: props.data.payCheckNum,
    UserId: props.data.UserId,
    payCheckProofDocument: props.data.payCheckProofDocument,
  })
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date');
  const [PlatformType, setPlatformType] = useState(Platform.OS);

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
      setPaycheck({ ...Paycheck, payCheckProofDocument: result.assets[0].uri })
      setImageChanged(true);
      setValueChanged(true);
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
      setPaycheck({ ...Paycheck, payCheckProofDocument: result.assets[0].uri })
      setImageChanged(true);
      setValueChanged(true);
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
    handleInputChange('paycheckDate', currentDate);
  };

  const handleInputChange = (name, value) => {
    setValueChanged(true);
    setPaycheck({ ...Paycheck, [name]: value })
    if (name == 'paycheckDate') {
      setShow(false);
      console.log(value);
    }
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

  const sendToFirebase = async (image) => {
    // if the user didn't upload an image, we will use the default image
    if (imageChanged) {
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
              setPaycheck({ ...Paycheck, payCheckProofDocument: downloadURL });
              savePaycheck(downloadURL);
            });
          }
        );
      } catch (error) {
        console.error(error);
        Alert.alert('Upload Error', 'Sorry, there was an error uploading your image. Please try again later.');
      }
    } else {
      savePaycheck(Paycheck.payCheckProofDocument);
    }
  }

  const savePaycheck = async (downloadURL) => {
    const temp = {
      paycheckDate: Paycheck.paycheckDate,
      paycheckSummary: Paycheck.paycheckSummary,
      paycheckComment: Paycheck.paycheckComment,
      payCheckNum: Paycheck.payCheckNumber,
      UserId: Paycheck.UserId,
      payCheckProofDocument: downloadURL,
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
          Alert.alert('Paycheck Updated', 'Your paycheck was updated successfully');
          console.log("fetch POST= ", result);
          getPaychecks();
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
          <TouchableOpacity style={styles.closeBtn} onPress={Cancel}>
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Paycheck #{Paycheck.payCheckNumber}</Text>
          <View style={styles.inputContainer}>
            {PlatformType !== 'ios' ? <TouchableOpacity style={styles.datePicker} onPress={showDatepicker}>
              <Text style={styles.dateInputTxt}>
                {Paycheck.paycheckDate.substring(0, 10)}
              </Text>
              {/* <Octicons style={{ textAlign: 'right' }} name="calendar" size={22} /> */}
            </TouchableOpacity> :
              <DatePicker
                useNativeDriver={"true"}
                showIcon={false}
                style={styles.inputFull}
                date={Paycheck.paycheckDate}
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
                onDateChange={(value) => handleInputChange('paycheckDate', value)}
              />}

            {show && (
              <DateTimePicker
                //testID="dateTimePicker"
                value={new Date(Paycheck.paycheckDate)}
                // mode={"date"}
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
              style={[styles.input, { height: 150, textAlignVertical: 'top' }]}
              editable
              multiline
              numberOfLines={4}
              value={Paycheck.paycheckComment}
              maxLength={300}
              placeholder='Add comment ( Optional )'
              keyboardType='ascii-capable'
              onChangeText={(value) => handleInputChange('paycheckComment', value)}
            />
          </View>
          <View style={styles.bottom}>
            <TouchableOpacity style={styles.cancelbutton} onPress={pickOrTakeImage}>
              <Text style={styles.cancelbuttonText}>Pick Document</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.savebutton} onPress={() => sendToFirebase(Paycheck.payCheckProofDocument)}>
              <Text style={styles.savebuttonText}>Update</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
    marginRight: 30,
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
    fontFamily: 'Urbanist-Light',
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