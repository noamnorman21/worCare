import { StyleSheet, LogBox } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import SettingScreen from './Component/SettingScreen';
import NavigateSignUp from './Component/SignUpComponents/NavigateSignUp';
import * as Font from 'expo-font'; // Import Font from expo-font package
import { UserProvider } from './UserContext';
import * as Notifications from 'expo-notifications';

// Ignore specific warning logs
LogBox.ignoreLogs(["AsyncStorage has been extracted from react-native core and will be removed in a future release."]);
LogBox.ignoreLogs(['Sending `onAnimatedValueUpdate` with no listeners registered.']);
LogBox.ignoreLogs(['Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`']);
LogBox.ignoreLogs(['Warning: componentWillReceiveProps has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.']);
LogBox.ignoreLogs([`Key "cancelled" in the image picker result is deprecated and will be removed in SDK 48, use "canceled" instead`]);
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
