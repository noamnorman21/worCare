import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import CustomHeader from './AppBarUp';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();



export default function PaymentsInner() {
  return ( 
      <Tab.Navigator initialRouteName="Pending"  >
      <Tab.Screen name="Pending" component={Pending} />
      <Tab.Screen name="History" component={History} />
      
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

function Pending() {
  return (
    <View style={styles.container} >
      <Text>Pending</Text>
    </View>
  );
}

function History() {
  return (
    <View style={styles.container} >
      <Text>History</Text>
    </View>
  );
}



const styles= StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    
    
    },
    

})
     






 