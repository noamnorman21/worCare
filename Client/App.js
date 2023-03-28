import { StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import SettingScreen from './Component/SettingScreen';
import NavigateSignUp from './Component/SignUpComponents/NavigateSignUp';
import * as Font from 'expo-font'; // Import Font from expo-font package

export default function App() {
  const [isReady, setIsReady] = useState(false); // Set state for font loading

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        'Urbanist-Regular': require('./assets/fonts/Urbanist-Regular.ttf'),
        'Urbanist-Bold': require('./assets/fonts/Urbanist-Bold.ttf'),
        'Urbanist-Medium': require('./assets/fonts/Urbanist-Medium.ttf'),
        'Urbanist-Light': require('./assets/fonts/Urbanist-Light.ttf'),
        'Urbanist-SemiBold': require('./assets/fonts/Urbanist-SemiBold.ttf'),
      });
      setIsReady(true);
    }
    loadFont();
  }, []);

  if (!isReady) {
    return null;
  }      
  return (
    <NavigationContainer independent={true} >
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
