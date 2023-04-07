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

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
    });
    // const { canceled, assets } = result;
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      const { uri } = result.assets[0];
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      props.onImgChange(result.assets[0].uri)
    }
  };

  return (
    <View style={{ position: 'absolute' }}>
      <TouchableOpacity onPress={pickImage} >
        {!image && <Image source={require('../../images/Avatar.png')} style={styles.imgUser} />}
        {image && <Image source={{ uri: image }} style={styles.imgUser} />}
      </TouchableOpacity>
      {image && <Icon name="edit" size={28} color="#548DFF" style={styles.icon} />}
    </View>
  );
}
const styles = StyleSheet.create({
  imgUser: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  icon: {
    position: 'absolute',
    right: 3,
    bottom: 5,
  }
});
