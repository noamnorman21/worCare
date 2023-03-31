import { View, Text, StyleSheet } from 'react-native'
import { useEffect, useState } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import Main from './TasksComponents/MainTasks';
import General from './TasksComponents/GeneralTasks';
import Shop from './TasksComponents/ShopTasks';
import Medicine from './TasksComponents/MedicineTasks';

const Tab = createMaterialTopTabNavigator();

export default function Tasks() {

  return (
    <Tab.Navigator
      initialRouteName="Main"
      screenOptions={{
        tabBarStyle: { backgroundColor: 'transparent', width: 'auto' },
        tabBarPressColor: '#548DFF',
        tabBarPressOpacity: 0.5,
        tabBarLabelStyle: {
          marginTop: 15,
          height: 25,
          fontSize: 15, // <-- change this size to 18 when we have the font family 'Urbanist'
          color: '#9E9E9E',
          fontFamily: 'Urbanist-SemiBold',
          alignItems: 'center',
          textTransform: 'none',
        },
        tabBarIndicatorStyle: {
          backgroundColor: '#548DFF',
          height: 3,
          borderRadius: 50,
        },
        //  WARN  Sending `onAnimatedValueUpdate` with no listeners registered.        

      }}
    >
      <Tab.Screen name="Main" component={Main} options={{ tabBarLabel: 'Main' }} />
      <Tab.Screen name="General" component={General} />
      <Tab.Screen name="Shop" component={Shop} />
      <Tab.Screen name="Medicine" component={Medicine} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'none',
    fontFamily: 'Urbanist',
  }
})