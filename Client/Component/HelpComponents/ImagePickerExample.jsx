import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Image, View, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../config/firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ImagePickerExample(props) {
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

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
        aspect: [4, 3],
        quality: 0.075,
      }
    );
    // Explore the result
    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      // const { uri } = result.assets[0];
      // const filename = uri.substring(uri.lastIndexOf('/') + 1);
      props.onImgChange(result.assets[0].uri)
    }
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.075,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      props.onImgChange(result.assets[0].uri)
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

  return (
    <View style={styles.imgContainer}>
      <TouchableOpacity onPress={pickOrTakeImage} >
        {!image && <Image source={require('../../images/userAvatar.png')} style={styles.imgUser} />}
        {image && <Image source={{ uri: image }} style={styles.imgUser} />}
      </TouchableOpacity>
      <View style={[styles.iconContainer, image && { backgroundColor: '#fff' }]}>
        {image && <Icon name="edit" size={23} color="#548DFF" style={styles.icon} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imgUser: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imgContainer: {
    position: 'absolute',
  },
  iconContainer: {
    position: 'absolute',
    right: '27.5%',
    top: '75%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    width: 45,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: 2
  },
});