import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View, Dimensions } from 'react-native';
import { useState } from 'react';
import Welcome from './Component/Welcome';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { CustomHeader } from './Component/AppBarUp';
import SettingScreen from './Component/SettingScreen';
import NavigateSignUp from './Component/SignUpComponents/NavigateSignUp';
import ForgotPassword from './Component/ForgotPasswordComponents/CreateNewPassword';
import FCTest from './Component/HelpComponents/FCTest';

export default function App() {
  return (
    <NavigationContainer independent={true}>
      <NavigateSignUp />
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
