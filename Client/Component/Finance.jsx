import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

// Big Image and 2 Buttons that will navigate to 2 different screens
// First Button will navigate to Payment screen - [Pending, History] 
// Second Button will navigate to Paycheck screen - [History]
export default function Finance() {
  return (
    <View style={styles.container}>
      <Image source={require('../images/logo_New.png')} style={styles.BigIMG} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('Payments')
        }}
      >
        <Text style={styles.txt}>Payment</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('Paycheck')
        }}
      >
        <Text style={styles.txt}>Paycheck</Text>
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
    width: Dimensions.get('screen').width * 1,
    resizeMode: 'contain',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7DA9FF',
    height: 54,
    width: Dimensions.get('screen').width * 0.65,
    margin: 10,
    borderRadius: 25,
  },
  txt: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})







