import { useState, useEffect } from 'react'
import { StyleSheet, Alert } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Importing the screens that will be used in the stack navigator
import { CustomHeader } from '../AppBar';
import LogIn from './LogIn';
import SignUp from './SignUp';
import SignUpLvl2 from './SignUpLvl2';
import SignUpLvl3 from './SignUpLvl3';
import ForgotPassword from '../ForgotPasswordComponents/ForgotPassword';
import ForgotPasswordLvl2 from '../ForgotPasswordComponents/ForgotPasswordLvl2';
import CreateNewPassword from '../ForgotPasswordComponents/CreateNewPassword';
import SignUpCaregiverLVL4 from './CareGiver/SignUpCaregiverLVL4';
import SignUpCaregiverLVL5 from './CareGiver/SignUpCaregiverLVL5';
import SignUpUserLVL4 from './User/SignUpUserLVL4';
import SignUpUserLVL5 from './User/SignUpUserLVL5';
import SignUpHobbies from './User/SignUpHobbies';
import SignUpLimitations from './User/SignUpLimitations';
import SignUpFinish from './User/SignUpFinish'
import Welcome from '../Welcome';
import { useUserContext } from '../../UserContext';

const Stack = createStackNavigator();

export default function NavigateSignUp() {
  const { updateUserContext,getUserChats, updateuserNotifications, fetchUserContacts,GetUserPending,GetUserHistory,logInFireBase } = useUserContext();
  const [isSigned, setIsSigned] = useState('bla');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      const storageUser = await AsyncStorage.getItem("user");
      if (storageUser == null) {
        setIsSigned(false);
      } else { // if the user is signed in- if he is, update the context
        setIsSigned(true);
        const storageUser2 = await AsyncStorage.getItem("userData");
        updateUserContext(JSON.parse(storageUser2))
        let notifications = await AsyncStorage.getItem("userNotifications");
        if (notifications !== null) {
          notifications = {
            emailNotifications: true,
            financeNotifications: true,
            chatNotifications: true,
            tasksNotifications: true,
            contactNotifications: true,
            allNotifications: true,
          }
        } else {
          notifications = JSON.parse(notifications)
        }
        updateuserNotifications(notifications)
        fetchUserContacts(JSON.parse(storageUser2));
        GetUserPending(JSON.parse(storageUser2));
        GetUserHistory(JSON.parse(storageUser2));
        let fireBaseUser= JSON.parse(storageUser)
        console.log(fireBaseUser)
        logInFireBase(fireBaseUser.Email,fireBaseUser.Password)
      }
    }
    catch (error) {
      console.log(error)
    }
    finally {
      setIsLoaded(true);
    }
  }

  if (!isLoaded) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={!isSigned ? "LogIn" : "CustomHeader"}>
      <>
        <Stack.Screen name="LogIn" component={LogIn} />
        <Stack.Screen name="CustomHeader" component={CustomHeader} />

        {/* שלבי שחזור סיסמה */}
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="ForgotPasswordLvl2" component={ForgotPasswordLvl2} options={{ headerShown: true, headerTitle: 'Back' }} />
        <Stack.Screen name="CreateNewPassword" component={CreateNewPassword} options={{ headerShown: true, headerTitle: 'Back' }} />

        {/* מסך לקישור המטפל למשפחת המטופל*/}
        <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} />

        {/* שלבים 1-3 בתהליך ההרשמה משותפים לשני סוגי המשתמשים */}
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: true, headerTitle: 'Back' }} />
        <Stack.Screen name="SignUpLvl2" component={SignUpLvl2} options={{ headerShown: true, headerTitle: 'Back' }} />
        <Stack.Screen name="SignUpLvl3" component={SignUpLvl3} options={{ headerShown: true, headerTitle: 'Back' }} />

        {/* שלבי המשך עבור הרשמת המטפל */}
        <Stack.Screen name="SignUpCaregiverLVL4" component={SignUpCaregiverLVL4} options={{ headerShown: true, headerTitle: 'Back' }} />
        <Stack.Screen name="SignUpCaregiverLVL5" component={SignUpCaregiverLVL5} options={{ headerShown: true, headerTitle: 'Back' }} />

        {/* שלבי המשך עבור הרשמת מעורב בטיפול */}
        <Stack.Screen name="SignUpUserLVL4" component={SignUpUserLVL4} options={{ headerShown: true, headerTitle: 'Back' }} />
        <Stack.Screen name="SignUpUserLVL5" component={SignUpUserLVL5} options={{ headerShown: true, headerTitle: 'Back' }} />
        <Stack.Screen name="SignUpHobbies" component={SignUpHobbies} options={{ headerShown: true, headerTitle: 'Back' }} />
        <Stack.Screen name="SignUpLimitations" component={SignUpLimitations} options={{ headerShown: true, headerTitle: 'Back' }} />
        <Stack.Screen name="SignUpFinish" component={SignUpFinish} options={{ headerShown: true, headerTitle: 'Back' }} />
        {/* כניסה למערכת */}
      </>

    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});