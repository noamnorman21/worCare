import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

export default function Tasks() {
  return (
    <Tab.Navigator
      initialRouteName="Main"
      tabBarOptions={{
        justifyContent: 'center',
        pressColor: '#548DFF',
        activeTintColor: '#548DFF',
        inactiveTintColor: '#9E9E9E',
        labelStyle: {
          fontSize: 15, // <-- change this size to 18 when we have the font family 'Urbanist'
          fontWeight: 'bold',          
          textTransform: 'none',
          alignItems: 'center',
          justifyContent: 'space-between',
          
        },
        style: {
          backgroundColor: 'transparent',
          
          
        },
        indicatorStyle: {
          backgroundColor: '#548DFF',
          height: 3,
          borderRadius: 25,
        },
        
      }} >
      <Tab.Screen name="Main" component={Main} />
      <Tab.Screen name="General" component={General} />
      <Tab.Screen name="Shop" component={Shop} />
      <Tab.Screen name="Medicine" component={Medicine} />
    </Tab.Navigator>
  );
}

function Main() {
  return (
    <View>
      <Text>Main</Text>
    </View>
  );
}

function General() {
  return (
    <View >
      <Text>General</Text>
    </View>
  );
}

function Shop() {
  return (
    <View >
      <Text>Shop</Text>
    </View>
  );
}

function Medicine() {
  return (
    <View >
      <Text>Medicine</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    fontFamily: 'sans-serif',
    backgroundColor: 'none',
  }
})