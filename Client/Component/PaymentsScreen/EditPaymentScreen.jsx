import { useIsFocused } from "@react-navigation/native";
import { View,Text, StyleSheet, Alert, SafeAreaView, animation, TouchableOpacity, Dimensions, Keyboard, LayoutAnimation} from "react-native";
import { useEffect } from "react";
import { useState } from "react";
import { TextInput } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import * as DocumentPicker from 'expo-document-picker';

export default function EditPaymentScreen(props) {

  
  const [animation, setAnimation] = useState({});
  const [imageChanged, setimageChanged] = useState(false);  
  const [Payment, setPayment] = useState({
    amountToPay:props.data.amountToPay,
    requestId:props.data.requestId,
    requestSubject:props.data.requestSubject,
    requestDate :props.data.requestDate,
    requestProofDocument : props.data.requestProofDocument,
    requestComment : props.data.requestComment,
    requestStatus:props.data.requestStatus,  
    userId:props.data.userId
  })

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
        setAnimation({ marginBottom: Dimensions.get('window').height * 0.425 });
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
          onPress: () => {let res= fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Payments/DeletePayment/' + Payment.requestId, {
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
    if(imageChanged) {
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
        props.cancel();
      },
      (error) => {
        console.log("err post=", error);
      });
  }
  
  return (    
    <ScrollView>
     <SafeAreaView style={styles.container}>
     <View style={styles.header}>
          <Text style={styles.title}>Edit Payment {Payment.requestId}</Text>
        </View>
        <View style={[styles.inputContainer, animation]}>
          <TextInput
            style={styles.input}
            value={Payment.requestSubject}
            placeholder='Reason'
            keyboardType='ascii-capable'
            onChangeText={(value) => handleInputChange('requestSubject', value)}
          />
          <TextInput
            style={[styles.input]}
            placeholder='Amount'
            value={Payment.amountToPay}
            keyboardType='ascii-capable'
            onChangeText={(value) => handleInputChange('amountToPay', value)}
            inputMode='decimal'
          />
          <TextInput
            style={styles.input}
            placeholder='Enter comment'
            value={Payment.requestComment}
            keyboardType='ascii-capable'
            onChangeText={(value) => handleInputChange('requestComment', value)}
          />
          <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
            <Text style={styles.buttonText}>Upload document</Text>
          </TouchableOpacity>
         
        </View>

      <View style={styles.bottom}>
        <TouchableOpacity style={styles.savebutton} onPress={()=> sendToFirebase(Payment.requestProofDocument)}>
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
    </ScrollView> 
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5', 
    height: Dimensions.get('window').height *1     
  },
   inputContainer: {
    padding: 20,  
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
    width: Dimensions.get('window').width * 0.9,
    underlindColorAndroid: 'transparent',
  },
  numInput: {
    width: Dimensions.get('window').width * 0.455,
  },
  savebutton: {
    width: Dimensions.get('window').width * 0.4,
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
    height: 45,
  },
  cancelbutton: {
    width: Dimensions.get('window').width * 0.4,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#548DFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 1,
    margin: 7,
    height: 45,
  },
  Deletebutton: {
    width: Dimensions.get('window').width * 0.85,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#548DFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 1,
    margin: 7,
    height: 45,
  },
  bottom: {
    flexDirection: 'row',
    margin: 0,
  },
  savebuttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelbuttonText: {
    color: '#548DFF',
    fontWeight: '600',
    fontSize: 16,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Urbanist-Bold',
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
    backgroundColor:'#548DFF'
  },

});
