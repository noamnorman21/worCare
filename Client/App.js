import { StyleSheet } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import SettingScreen from './Component/SettingScreen';
import NavigateSignUp from './Component/SignUpComponents/NavigateSignUp';
import * as Font from 'expo-font'; // Import Font from expo-font package
import { UserProvider } from './UserContext';

import * as Notifications from 'expo-notifications';
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [isReady, setIsReady] = useState(false); // Set state for font loading
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();


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

  // useEffect(() => {
  //   const subscription = Notifications.addNotificationReceivedListener(notification => {
  //     console.log(notification);
  //   });

  //   return () => {
  //     subscription.remove();
  //   }
  // }, []);

  useEffect(() => {
    // registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);


  if (!isReady) {
    return null;
  }
  return (
    <NavigationContainer independent={true} >
      <UserProvider>
        <NavigateSignUp />
      </UserProvider>
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
