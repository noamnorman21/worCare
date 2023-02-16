import { StatusBar } from 'expo-status-bar';
import { Dimensions, TouchableOpacity, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import LogIn from './Component/SignUpComponents/LogIn';
import Welcome from './Component/Welcome';
import { Octicons, Ionicons, AntDesign } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Contacts from './Component/Contacts';
import CreateUser from './Component/SignUpComponents/SignUp';
import ForgotPassword from './Component/SignUpComponents/ForgotPassword';
import { CustomHeader } from './Component/AppBarUp';
import SettingScreen from './Component/SettingScreen';
import NavigateSignUp from './Component/SignUpComponents/NavigateSignUp';
import { useEffect } from 'react';

export default function App() {
  const LoadFonts = async () => {
    await useFonts();
  };

  useEffect (() => {
    LoadFonts();
  }, []);

  return (
    <NavigationContainer independent={true}>
      {/* <CustomHeader /> */}
      <NavigateSignUp />
      {/* <SettingScreen /> */}

    </NavigationContainer>

    // <View style={styles.container}>
    //   {/* <CreateUser /> */}
    //   {/* <LogIn /> */}
    //   {/* <ForgotPassword/> */}
    // </View>
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
