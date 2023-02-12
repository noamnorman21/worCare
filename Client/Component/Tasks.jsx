import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

export default function Tasks() {
  return (
    <Tab.Navigator 
    initialRouteName="Main"  
    tabBarOptions={{
      pressColor: '#548DFF',
      pressOpacity: 0.5,
      labelStyle: {
        fontSize: 16, // <-- change this size to 18 when we have the font family 'Urbanist'
        fontWeight: 'bold',
        color: '#9E9E9E',
        textTransform: 'none',
        alignItems: 'center',
      },
      style: {
        backgroundColor: 'transparent',
        marginTop: 25,
        height: 50,
      },
      indicatorStyle: {
        backgroundColor: '#548DFF',
        height: 4,
      },
      tabStyle: { width: 'auto', marginLeft: 10, alignItems: 'center' },
    }} >
      <Tab.Screen style={styles.container2} name="Main" component={Main} />
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
  },
  container2: {
    flex: 1,
    flexDirection: 'column',
    fontFamily: 'sans-serif',
    backgroundColor: 'none',
    fontWeight: 'bold',
  }

})