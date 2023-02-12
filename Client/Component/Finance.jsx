

import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

// Big Image and 2 Buttons that will navigate to 2 different screens
// First Button will navigate to Payment screen - [Pending, History] 
// Second Button will navigate to Paycheck screen - [History]
export default function Finance() {
  return (
    <View>
      <Image source={require('../images/logo_New.png')} style={styles.BigIMG} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('Payments')
        }}
      >
        <Text>Payment</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('Paycheck')
        }}
      >
        <Text>Paycheck</Text>
      </TouchableOpacity>
    </View>
  );
}

function Payments() {
  return (
    <Tab.Navigator initialRouteName="Pending" >
      <Tab.Screen name="Pending" component={Pending} />
      <Tab.Screen name="History" component={History} />
    </Tab.Navigator>
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

function Paycheck() {
  return (
    <View>
      <Text>History</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  BigIMG: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    height: 54,
    margin: 10,
  },

})

