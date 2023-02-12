import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

// Big Image and 2 Buttons that will navigate to 2 different screens
// First Button will navigate to Payment screen - [Pending, History] 
// Second Button will navigate to Paycheck screen - [History]
export default function Finance() {
  return (
    <NavigationContainer independent={true} zIndex='0' initialRouteName='choice'  >
    <Stack.Navigator initialRouteName='choice'>
      <Stack.Screen name='choice' component={Choice} options={() => ({
        headerShown: false,
      })} />
      <Stack.Screen name='Payments' component={Payments} options={() => ({
        headerShown: false,
        presentation: 'stack',
       
        cardOverlayEnabled: true,
        style: {
          flex: 1,
        },

      })} />
      <Stack.Screen name='Paychecks' component={Paycheck} options={() => ({
        headerShown: false,
        presentation: 'stack',
        cardOverlayEnabled: true,
      })} />
    </Stack.Navigator>

  </NavigationContainer>
  );
}


function Choice({ navigation }) {

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
      <View style={styles.imageContainer}>
        <Image
          
          source={require('../images/logo_New.png')}
        />
      </View>
      <TouchableOpacity activeOpacity={1} onPress={() => { navigation.navigate('Payments') }} style={styles.Button}>
        <Text style={styles.text}>
          Payments
        </Text>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={1} onPress={() => { navigation.navigate('Paychecks') }} style={styles.button2}>
        <Text style={styles.text}>
        Paychecks
        </Text>
      </TouchableOpacity>

    </SafeAreaView>
  )

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
  Button: {
    width: 265,
    height:54,    
    backgroundColor: '#548DFF',
    opacity: 0.75,
    borderRadius: 25,
    alignContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',    
    TouchableOpacity: 1,
    padding:10 ,
    marginHorizontal: 'auto',
   
  },
  button2 : {
    width: 265,
    height:54,
    opacity: 0.75,    
    backgroundColor: '#548DFF',
    borderRadius: 25,
    alignContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    TouchableOpacity: 1,
    padding:10 ,
    marginHorizontal: 'auto',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',    
    marginBottom:-60,
    marginTop:-120,
  },
   image: {
    paddingBottom:0,
    resizeMode: 'contain',
   
},
text: {
  color: 'white',
  fontSize: 15,
  padding:0,
  flex:0,
  alignItems:'center',
  justifyContent:'center',
  fontFamily:'Roboto',
  fontWeight:'700',
  opacity:1,
}
})





