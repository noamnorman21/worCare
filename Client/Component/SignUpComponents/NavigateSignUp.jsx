import { View, Text } from 'react-native'
import React from 'react'
import SignUp from './SignUp';
import LogIn from './LogIn';
import SignUpLvl2 from './SignUpLvl2';
import SignUpLvl3 from './SignUpLvl3';
import { createStackNavigator, Header } from '@react-navigation/stack';
import {CustomHeader} from '../../Component/AppBarUp';
import SignUpLvl4Care from './SignUpLvl4Care';
import SingUpLvl4Involved from './SingUpLvl4Involved';

const Stack= createStackNavigator();

export default function NavigateSignUp() {
  return (
    <Stack.Navigator initialRouteName="SignUpLvl3" screenOptions={{headerShown:false}} backBehavior='none' >
      <Stack.Screen name="SignUpLvl3" component={SignUpLvl3} />
      <Stack.Screen name="LogIn" component={LogIn} />
      <Stack.Screen name="SignUp" component={SignUp} />   
      <Stack.Screen name="SignUpLvl2" component={SignUpLvl2} />
      
      <Stack.Screen name="SingUpLvl4Involved" component={SingUpLvl4Involved} />
      <Stack.Screen name="SignUpLvl4Care" component={SignUpLvl4Care} />
      <Stack.Screen name="CustomHeader" component={CustomHeader} />

    </Stack.Navigator>
  )
}