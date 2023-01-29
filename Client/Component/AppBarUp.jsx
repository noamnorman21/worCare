import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingScreen from './SettingScreen';
import NotifactionsScreen from './NotifactionsScreen';

const Stack = createNativeStackNavigator();
export default function AppBarUp() {
  return (
    <Stack.Navigator initialRouteName="SettingScreen">
      <Stack.Screen name="SettingScreen" component={SettingScreen} />
      <Stack.Screen name="Notifications" component={NotifactionsScreen} />

    </Stack.Navigator>
    );
}