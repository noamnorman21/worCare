import React from 'react'
import { StyleSheet} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { CustomHeader } from '../../Component/AppBarUp';

// Importing the screens that will be used in the stack navigator
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

const Stack = createStackNavigator();

export default function NavigateSignUp() {
  return (
    <Stack.Navigator initialRouteName="LogIn" screenOptions={{ headerShown: false }}>

      <Stack.Screen name="CustomHeader" component={CustomHeader} />
      <Stack.Screen name="LogIn" component={LogIn} />

      {/* שלבי שחזור סיסמה */}
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ForgotPasswordLvl2" component={ForgotPasswordLvl2} options={{ headerShown: true, headerTitle: '' }} />
      <Stack.Screen name="CreateNewPassword" component={CreateNewPassword} options={{ headerShown: true, headerTitle: '' }} />

      {/* שלבים 1-3 בתהליך ההרשמה משותפים לשני סוגי המשתמשים */}
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="SignUpLvl2" component={SignUpLvl2} options={{ headerShown: true, headerTitle: '' }} />
      <Stack.Screen name="SignUpLvl3" component={SignUpLvl3} options={{ headerShown: true, headerTitle: '' }} />

      {/* שלבי המשך עבור הרשמת המטפל */}
      <Stack.Screen name="SignUpCaregiverLVL4" component={SignUpCaregiverLVL4} options={{ headerShown: true, headerTitle: '' }} />
      <Stack.Screen name="SignUpCaregiverLVL5" component={SignUpCaregiverLVL5} options={{ headerShown: true, headerTitle: '' }} />

      {/* שלבי המשך עבור הרשמת מעורב בטיפול */}
      <Stack.Screen name="SignUpUserLVL4" component={SignUpUserLVL4} options={{ headerShown: true, headerTitle: '' }} />
      <Stack.Screen name="SignUpUserLVL5" component={SignUpUserLVL5} options={{ headerShown: true, headerTitle: '' }} />
      <Stack.Screen name="SignUpHobbies" component={SignUpHobbies} options={{ headerShown: true, headerTitle: '' }} />
      <Stack.Screen name="SignUpLimitations" component={SignUpLimitations} options={{ headerShown: true, headerTitle: '' }} />
      <Stack.Screen name="SignUpFinish" component={SignUpFinish} options={{ headerShown: true, headerTitle: '' }} />
      {/* כניסה למערכת */}
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