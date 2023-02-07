import { StatusBar } from 'expo-status-bar';
import { Dimensions, TouchableOpacity, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import AppbarDown from './Component/AppBarDown';
import LogIn from './Component/LogIn';
import Welcome from './Component/Welcome';
import { Octicons, Ionicons, AntDesign } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SettingScreen from './Component/SettingScreen';
import Contacts from './Component/Contacts';
import CustomHeader from './Component/AppBarUp';
import CreateUser from './Component/SignUpComponents/CreateUser';

export default function App() {
  return (
    // <NavigationContainer>
    //   <CustomHeader />
    //   <AppbarDown />
    // </NavigationContainer>
    <View style={styles.container}>
      <CreateUser />
      {/* <LogIn /> */}
    </View>
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
