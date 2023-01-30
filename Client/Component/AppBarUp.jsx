import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons ,Feather, Ionicons, FontAwesome5, AntDesign} from '@expo/vector-icons';
import SettingScreen from './SettingScreen';
import NotifactionsScreen from './NotifactionsScreen';
import Contacts from './Contacts';


const Tab = createBottomTabNavigator();
export default function AppBarUp() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'SettingScreen') {
            return <FontAwesome5 name="user-cog" size={size} color={color} />
          } else if (route.name === 'NotifactionsScreen') {
            return <MaterialCommunityIcons name="bell-badge-outline" size={size} color={color} />
          } else if (route.name === 'Contacts') {
            return <AntDesign name="contacts" size={size} color={color} />
          } 
        },
      })}
      tabBarOptions={{
        activeTintColor: '#548DFF',
        inactiveTintColor: '#808080',
        style: styles.tabBar,
      }}
      initialRouteName="SettingScreen"
    >
      <Tab.Screen name='Settings' component={SettingScreen}  />
      <Tab.Screen name='Notifactions' component={NotifactionsScreen}  />
      <Tab.Screen name='Contacts' component={Contacts} options={{
        
      }} />      
    </Tab.Navigator>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    backgroundColor: '#fff',
  },
});