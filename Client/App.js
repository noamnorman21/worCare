import { StatusBar } from 'expo-status-bar';
import { Dimensions, TouchableOpacity, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import LogIn from './Component/SignUpComponents/LogIn';
import Welcome from './Component/Welcome';
import { Octicons, Ionicons, AntDesign } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SettingScreen from './Component/SettingScreen';
import Contacts from './Component/Contacts';
import CreateUser from './Component/SignUpComponents/SignUp';
import ForgotPassword from './Component/SignUpComponents/ForgotPassword';
import {CustomHeader} from './Component/AppBarUp';

export default function App() {
  return (
    <NavigationContainer independent={true}>
      <CustomHeader />
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