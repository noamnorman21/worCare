import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import AppbarDown from './Component/AppBarDown';
import LogIn from './Component/LogIn';
import Welcome from './Component/Welcome';
import { NavigationContainer } from '@react-navigation/native';
import AppBarUp from './Component/AppBarUp';
import SettingScreen from './Component/SettingScreen';
export default function App() {
  return (
    // <View style={styles.container}>
    //   {/* <LogIn />       */}
      <NavigationContainer style={styles.NavBar}>
        {/* <AppBarUp /> */}
        <AppbarDown />
      </NavigationContainer>
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  NavBar: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'row-reverse'
  },
});
