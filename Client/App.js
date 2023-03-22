import { StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import SettingScreen from './Component/SettingScreen';
import NavigateSignUp from './Component/SignUpComponents/NavigateSignUp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomHeader } from './Component/AppBarUp';

export default function App() {
  //function to get user email and password from async storage, it called when the app starts using useEffect

  return (
    <NavigationContainer independent={true}>
      {/* <NavigateSignUp /> */}
      <CustomHeader />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
