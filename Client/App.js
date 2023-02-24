import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View } from 'react-native';
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


export default function App() {
  return (
    // <NavigationContainer independent={true}>
    //   {/* <CustomHeader /> */}
    //   {/* <SettingScreen /> */}
    //   <NavigateSignUp />
    // </NavigationContainer>

    <View style={styles.container}>
      {/* <CreateUser /> */}
      {/* <LogIn />       */}
      {/* <ForgotPassword /> */}
      {/* <SignUpCareGiverLVL5 /> */}
      <FCTest />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff ',
    alignItems: 'center',
    justifyContent: 'center',
  },

});
