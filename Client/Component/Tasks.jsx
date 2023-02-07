import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import CustomHeader from './AppBarUp';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();



export default function Tasks() {
  return (
    <Tab.Navigator initialRouteName="Main" tabBarPosition='top' tabBarOptions={{
      pressColor: 'blue',
      pressOpacity: 0.5,
      labelStyle: {
        fontSize: 17,
        color: 'grey',
        textTransform: 'none',       
        alignItems: 'center',
      },
      style: {
        marginTop:30,
        backgroundColor: 'transparent',
        height: 50,
        
      
        
       
        
      },
      indicatorStyle: {
        backgroundColor: 'blue',
        height: 4,
      },
      tabStyle: {width: 'auto', marginLeft: 10, alignItems: 'center'},
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

const styles= StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    flexDirection: 'column',    
    fontFamily:'sans-serif',
    backgroundColor: 'none',
    
    
    },
    container2: {
      flex: 1,
      paddingTop: 30,
      flexDirection: 'column',
      fontFamily:'sans-serif',
      backgroundColor: 'none',
fontWeight: 'bold',      }

})
     






 