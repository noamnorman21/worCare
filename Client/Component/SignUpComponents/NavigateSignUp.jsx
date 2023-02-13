import React from 'react'
import SignUp from './SignUp';
import LogIn from './LogIn';
import SignUpLvl2 from './SignUpLvl2';
import SignUpLvl3 from './SignUpLvl3';
import ForgotPassword from './ForgotPassword';
import { createStackNavigator } from '@react-navigation/stack';
import {CustomHeader} from '../../Component/AppBarUp';

const Stack= createStackNavigator();

export default function NavigateSignUp() {
  return (
    <Stack.Navigator initialRouteName="LogIn" screenOptions={{headerShown:false}}>
      <Stack.Screen name="LogIn" component={LogIn} />
      <Stack.Screen name="SignUp" component={SignUp} />   
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />

      <Stack.Screen name="SignUpLvl2" component={SignUpLvl2} />
      <Stack.Screen name="SignUpLvl3" component={SignUpLvl3} />
      
      <Stack.Screen name="CustomHeader" component={CustomHeader} />
    </Stack.Navigator>
  )
}