import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, Dimensions, SafeAreaView } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

const SCREEN_WIDTH = Dimensions.get('window').width;

const LastLvl = () => {
  

  return (
    <SafeAreaView style={styles.container}>
  
      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonBox}
          onPress={NavigateToNextLVL} >
          <Text style={styles.button}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
});
export default LastLvl;