import { Button, Text, View, TouchableOpacity, SafeAreaView, Image, Dimensions, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import AppBarDown from './AppBarDown';
import SettingScreen from './SettingScreen';
import Contacts from './Contacts';
import PushNotifications from './PushNotifications';
import PaymentsInner from './PaymentsInner';
import Paychecks from './Paychecks';

const Stack = createStackNavigator();

export default function Payments() {
  return (
    <NavigationContainer independent={true} zIndex='0'   >
      <Stack.Navigator>
        <Stack.Screen name='choice' component={Choice} options={() => ({
          headerShown: false,
        })} />
        <Stack.Screen name='PaymentsInner' component={PaymentsInner} options={() => ({
          headerShown: false,
          presentation: 'stack',
          cardOverlayEnabled: true,
          style: {
            flex: 1,
          },

        })} />
        <Stack.Screen name='Paychecks' component={Paychecks} options={() => ({
          headerShown: false,
          presentation: 'stack',
          cardOverlayEnabled: true,
        })} />

      </Stack.Navigator>

    </NavigationContainer>
  )
}


function Choice({ navigation }) {

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
      <View>
        <Image
          
          source={require('../images/logo_New.png')}
        />
      </View>
      <TouchableOpacity onPress={() => { navigation.navigate('PaymentsInner') }} style={styles.Button}>
        <Text style={styles.text}>
          Payments
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { navigation.navigate('Paychecks') }} style={styles.Button}>
        <Text style={styles.text}>
        Paychecks
        </Text>
      </TouchableOpacity>

    </SafeAreaView>
  )

}

const styles = StyleSheet.create({
  Button: {
    width: 200,
    color: 'red',
    backgroundColor: '#7DA9FF',
    borderRadius: 25,
    alignContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    marginVertical: 10,
    TouchableOpacity: 1,
    paddingBottom:10 ,
    marginHorizontal: 'auto',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',    
    marginBottom:-20,
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
  fontFamily:'Roboto'
}
})
