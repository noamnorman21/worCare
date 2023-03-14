import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, SafeAreaView, Alert, StyleSheet, TouchableOpacity, Dimensions, Keyboard, LayoutAnimation } from 'react-native';
import { storage } from '../../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import * as DocumentPicker from 'expo-document-picker';

export default function NewPayment({navigation}) {
  const [animation, setAnimation] = useState({});

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        LayoutAnimation.configureNext({
          update: {
            type: LayoutAnimation.Types.easeIn,
            duration: 300,
            useNativeDriver: true,
          },
        });
        setAnimation({ marginBottom: Dimensions.get('window').height * 0.32 });
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        LayoutAnimation.configureNext({
          update: {
            type: LayoutAnimation.Types.easeOut,
            duration: 300,
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

  const [payment, setPayment] = useState({
    amountToPay: '',
    requestSubject: '',
    requestDate: new Date(),
    requestProofDocument: '',
    requestComment: '',
    requestStatus: 'R',
    userId: 1// will be changed to current user id,
  })
  
  const pickDocument = async () => {

    let result = await DocumentPicker.getDocumentAsync({});    
    alert(result.uri);    
    console.log(result);
    changeIMG(result.uri);
    
  };

  const changeIMG = (imageFromUser) => {
   setPayment({ ...payment, requestProofDocument: imageFromUser });
  }

  const handleInputChange = (name, value) => {
    setPayment({ ...payment, [name]: value });
  };

  const sendToFirebase = async (image) => {   
    // if the user didn't upload an image, we will use the default image
    if (payment.requestProofDocument === '' || payment.requestProofDocument === undefined) {
      //זה תמונה מכוערת -נועם תחליף אותה
      // let defultImage="https://png.pngtree.com/element_our/20200610/ourmid/pngtree-character-default-avatar-image_2237203.jpg"
      // sendDataToDB(defultImage);
      return Alert.alert('Upload Error', '.');
    }
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
           setPayment({ ...payment, requestProofDocument: downloadURL });
           savePayment();
 
          });
        }
      );
    } catch (error) {
      console.error(error);
      Alert.alert('Upload Error', 'Sorry, there was an error uploading your image. Please try again later.');
      savePayment();
    }
  };

  const savePayment = async () => {
    if (payment.amountToPay === '') {
      alert('Please enter amount');
      return;
    }
    if (payment.requestSubject === '') {
      alert('Please enter subject');
      return;
    } else {
      fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Payments/NewRequest', {
      method: 'POST',
      body: JSON.stringify(payment),
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
          
          navigation.popToTop();
        },
        (error) => {
          console.log("err post=", error);
        });
    }
  };

  
  return (  
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>New Payment</Text>
        </View>
        <View style={[styles.inputContainer, animation]}>
          <TextInput
            style={styles.input}
            placeholder='Reason'
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
            style={styles.input}
            placeholder='Enter comment'
            keyboardType='ascii-capable'
            onChangeText={(value) => handleInputChange('requestComment', value)}
          />
          <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
            <Text style={styles.buttonText}>Upload document</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadButton} onPress={()=> sendToFirebase(payment.requestProofDocument)}>
            <Text style={styles.buttonText}>Upload request</Text>
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
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    color: '#000',
    fontSize: 18,
    padding: 20,
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
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700',
   
  },
});
