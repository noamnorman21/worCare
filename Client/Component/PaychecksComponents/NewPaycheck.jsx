import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, SafeAreaView, Alert, StyleSheet, TouchableOpacity, Dimensions, Keyboard, LayoutAnimation } from 'react-native';
import { storage } from '../../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import * as DocumentPicker from 'expo-document-picker';
import { useUserContext } from '../../UserContext';

export default function NewPaycheck(props) { 
  const { userContext } = useUserContext();
  const [PayCheck, setPayCheck] = useState({
    paycheckMonth: '',
    paycheckYear:'',
    paycheckSummary: '',
    paycheckComment: '',    
    userId: userContext.userId
  })
  const [animation, setAnimation] = useState({});
  

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        LayoutAnimation.configureNext({
          update: {
            type: LayoutAnimation.Types.easeIn,
            duration: 200,
            useNativeDriver: true,
          },
        });
        setAnimation({ marginBottom: Dimensions.get('window').height * 0.3 });
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        LayoutAnimation.configureNext({
          update: {
            type: LayoutAnimation.Types.easeOut,
            duration: 200,
            useNativeDriver: true,
          },
        });
        setAnimation({ marginBottom: 0 });
      }
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    }

  }, []);

 
  
  const pickDocument = async () => {

    let result = await DocumentPicker.getDocumentAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
    });    
    alert(result.uri);    
    console.log(result);
    // changeIMG(result.uri);
    
  };

  const changeIMG = (imageFromUser) => {
   setPayment({ ...PayCheck, requestProofDocument: imageFromUser });
  }

  const handleInputChange = (name, value) => {
    setPayCheck({ ...PayCheck, [name]: value });
  };

  const sendToFirebase = async (image) => {   
    // if the user didn't upload an image, we will use the default image
    if (payment.requestProofDocument === '' || payment.requestProofDocument === undefined) {
      //זה תמונה מכוערת -נועם תחליף אותה
      // let defultImage="https://png.pngtree.com/element_our/20200610/ourmid/pngtree-character-default-avatar-image_2237203.jpg"
      // sendDataToDB(defultImage);
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
            savePayment(downloadURL);
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
      paycheckDate: new Date(PayCheck.paycheckYear, PayCheck.paycheckMonth,1),
      paycheckSummary: PayCheck.paycheckSummary,
      paycheckComment: PayCheck.paycheckComment,   
      userId: PayCheck.userId
    }   
    console.log("Newcheck", Newcheck); 
    if (PayCheck.paycheckMonth === '') {
      Alert.alert('Please enter paycheckMonth');
      return;
    }
    if (PayCheck.paycheckYear === '') {
      Alert.alert('Please enter paycheckYear');
      return;
    }
    if (Newcheck.paycheckSummary === '') {
      Alert.alert('Please enter paycheckSummary');
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
        <View style={styles.header}>
          <Text style={styles.title}>New Paycheck</Text>
        </View>
        <View style={[styles.inputContainer, animation]}>
          <TextInput
            style={styles.input}
            placeholder='month'
            keyboardType='decimal-pad'
            onChangeText={(value) => handleInputChange('paycheckMonth', value)}
          />
          <TextInput
            style={[styles.input]}
            placeholder='year'
            keyboardType='decimal-pad'
            onChangeText={(value) => handleInputChange('paycheckYear', value)}
            inputMode='decimal'
          />
            <TextInput
            style={[styles.input]}
            placeholder='summary'
            keyboardType='decimal-pad'
            onChangeText={(value) => handleInputChange('paycheckSummary', value)}
            inputMode='decimal'
          />
          <TextInput
            style={[styles.input, styles.comment] }
            placeholder='Add comment'
            keyboardType='ascii-capable'
            onChangeText={(value) => handleInputChange('paycheckComment', value)}
          />
          <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
            <Text style={styles.buttonText}>Upload document</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadButton} onPress={()=> savePaycheck()}>
            <Text style={styles.buttonText}>Upload Paycheck</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cnlButton} onPress={props.cancel}>
            <Text style={styles.closeTxt}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
  
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }, 
  title: {
    color: '#000',
    fontSize: 24,
    padding: 20,
    fontFamily:'Urbanist-Bold'
  },
  inputContainer: {
    padding: 20,
    backgroundColor: '#fff',
    
  },
  input: {
    height: Dimensions.get('window').height *0.07,
    backgroundColor: '#fff',
    marginBottom: 20,
    color: '#000',
    paddingHorizontal: 10,
    borderColor: '#E6EBF2',
    borderRadius: 16,
    borderWidth: 1,
    fontFamily:'Urbanist-Regular'
  }, 
  Savebutton: {
    backgroundColor: '#000',
    paddingVertical: 15,
  },
  uploadButton: {
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor:'#548DFF'
  },
  cnlButton: {
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginBottom: 20,
    borderRadius: 16,
    borderWidth: 1.5,
    backgroundColor:'#F5F8FF',
    borderColor:'#548DFF',
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',    
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,  
  },
   closeTxt: {
    color: '#548DFF',
    textAlign: 'center',
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
 },
  comment: { height: 200, textAlignVertical: 'top', padding:10 },
});
