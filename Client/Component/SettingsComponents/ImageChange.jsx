import { View, Text, SafeAreaView, StyleSheet, Dimensions, Alert } from 'react-native'
import { useEffect, useState } from 'react'
import ImagePickerExample from '../HelpComponents/ImagePickerExample'
import { TouchableHighlight } from 'react-native-gesture-handler'

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../config/firebase';

export default function ImageChange({ route }) {
   const [userImg, setUserImg] = useState(null)
   useEffect(() => {
      console.log(route.params.userImg)
      setUserImg(route.params.userImg)
   }, [])

   const sendToFirebase = async (image) => {
      // if the user didn't upload an image, we will use the default image
      if (userImg === null) {
         //זה תמונה מכוערת -נועם תחליף אותה
         let defultImage = "https://png.pngtree.com/element_our/20200610/ourmid/pngtree-character-default-avatar-image_2237203.jpg"
         sendDataToNextLVL(defultImage);
      }
      const filename = image.substring(image.lastIndexOf('/') + 1);
      const storageRef = ref(storage, "images/" + filename);
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
                  sendDataToNextLVL(downloadURL);
               });
            }
         );
      } catch (error) {
         console.error(error);
         Alert.alert('Upload Error', 'Sorry, there was an error uploading your image. Please try again later.');

      }
   }

   const sendDataToNextLVL = (downloadURL) => {
      const userToUpdate = {
         Email: route.params.email,
         userUri: downloadURL,
         Id: route.params.userId
      }

      fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar1/api/User/UpdateUserImage', {
         method: 'PUT',
         headers: new Headers({
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json; charset=UTF-8',
         }),
         body: JSON.stringify(userToUpdate)
      })
         .then(res => {
            return res.json()
         }
         )
         .then(
            (result) => {
               console.log("fetch POST= ", result);
               Alert.alert('Image Changed', 'Your image has been changed successfully');
            }
         )
         .catch((error) => {
            console.log('Error:', error.message);
         }
         );

   }
   const changeIMG = (img) => {
      console.log("image changed")
      setUserImg(img)
   }

   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.header}>
            <Text style={styles.title}>Change Image</Text>
         </View>
         <View style={styles.imageContainer}>
            <ImagePickerExample style={styles.image} onImgChange={changeIMG} userImg={userImg} />
         </View>
         <View style={styles.inputContainer}>
            <TouchableHighlight onPress={() => sendToFirebase(userImg)} style={styles.button}>
               <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableHighlight>
         </View>
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
   },
   header: {
      marginTop: 20,
      marginBottom: 20,
      alignItems: 'center',
      justifyContent: 'center',
   },
   title: {
      fontSize: 30,
      fontWeight: 'bold',
      color: '#000',
   },
   smallTitle: {
      fontSize: 15,
      color: '#000',
   },
   imageContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
   },
   image: {
      width: Dimensions.get('window').width * 0.85,
      height: Dimensions.get('window').width * 0.85,
      resizeMode: 'contain',
   },
   imageContainer: {
      flex: 2,
      alignItems: 'center',
      justifyContent: 'center',
   },
   inputContainer: {
      width: '80%',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 6,
   },
   button: {
      width: Dimensions.get('window').width * 0.85,
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
   buttonText: {
      color: 'white',
      fontWeight: '600',
      fontSize: 16,
   },
})