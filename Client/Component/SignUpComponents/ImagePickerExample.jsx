import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Image, View, Platform, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerExample() {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={{ flex: 0.5, alignItems: 'center', justifyContent: 'space-between' }}>
      <TouchableOpacity onPress={pickImage} >
        {!image && <Image source={require('../../images/upload.png')} style={styles.imgUser} />}
        {image && <Image source={{ uri: image }} style={styles.imgUser} />}
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  imgUser: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
