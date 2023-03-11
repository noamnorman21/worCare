import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View, Dimensions } from 'react-native';
import { useState } from 'react';
import LogIn from './Component/SignUpComponents/LogIn';
import Welcome from './Component/Welcome';
import { Octicons, Ionicons, AntDesign } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Contacts from './Component/Contacts';
import CreateUser from './Component/SignUpComponents/SignUp';
import { CustomHeader } from './Component/AppBarUp';
import SettingScreen from './Component/SettingScreen';
import NavigateSignUp from './Component/SignUpComponents/NavigateSignUp';
import SignUpCareGiverLVL5 from './Component/SignUpComponents/CareGiver/SignUpCaregiverLVL5';
import ForgotPassword from './Component/ForgotPasswordComponents/CreateNewPassword';
import FCTest from './Component/HelpComponents/FCTest';
import Holidays from './Component/HelpComponents/Holidays';
import SignUpLimitations from './Component/SignUpComponents/User/SignUpLimitations';

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
