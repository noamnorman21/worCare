import { StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import SettingScreen from './Component/SettingScreen';
import NavigateSignUp from './Component/SignUpComponents/NavigateSignUp';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [defaultScreen, setDefaultScreen] = useState("");
  //function to get user email and password from async storage, it called when the app starts using useEffect
  const _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('user');
      if (value !== null& value !== undefined& value !== '') {
        // We have data!!
        console.log(value);
        setDefaultScreen("CustomHeader");
      }
      else {
        setDefaultScreen("LogIn");
      }
    } catch (error) {
      // Error retrieving data
    }
  }
  useEffect(() => {
    _retrieveData();
  }, []);

  return (
    <NavigationContainer independent={true}>
      <NavigateSignUp defaultScreen={defaultScreen} />
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
