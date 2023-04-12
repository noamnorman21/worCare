import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Pending from './PaymentsScreen/Pending';
import History from './PaymentsScreen/History';
import Paychecks from './PaychecksComponents/Paychecks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

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
          }
        })} />
        <Stack.Screen name='Paychecks' component={Paychecks} options={() => ({
          headerShown: false,
          presentation: 'stack',
          cardOverlayEnabled: true,
        })} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Choice({ navigation }) {
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    AsyncStorage.getItem('userData').then((value) => {
      const data = JSON.parse(value);
      setUserId(data.Id)
    })
  }, [])

  return (
    <View style={styles.Choice}>
      <Image source={require('../images/logo_New.png')} style={styles.BigIMG} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('Payments', { userId: userId })
        }}
      >
        <Text style={styles.txt}>Payment</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('Paychecks', { userId: userId })
        }}
      >
        <Text style={styles.txt}>Paycheck</Text>
      </TouchableOpacity>
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();
function Payments({ route }) {
  return (
    <Tab.Navigator
      initialRouteName="Pending"
      backBehavior='initialRoute'
      screenOptions={{
        tabBarStyle: { backgroundColor: '#fff', width: '100%', justifyContent: 'center', alignSelf: 'center' },
        tabBarPressColor: '#548DFF',
        tabBarPressOpacity: 0.5,
        tabBarLabelStyle: {
          marginTop: 15,
          height: 25,
          fontSize: 18, // <-- change this size to 18 when we have the font family 'Urbanist'
          color: '#9E9E9E',
          fontFamily: 'Urbanist-SemiBold',
          alignItems: 'center',
          textTransform: 'none',
        },
        tabBarIndicatorStyle: {
          backgroundColor: '#548DFF',
          height: 3,
          borderRadius: 50,
          width: '35%',
          justifyContent: 'center',
          alignSelf: 'center',
          marginLeft: '6%',
        },
      }}
    >
      <Tab.Screen name="Pending" component={Pending} initialParams={{ userId: route.params.userId }} />
      {/*במעבר למסך תשלומים ממתינים תבוצע םעולת גט אשר תשלוף את כלל בקשות התשלום אשר שמורות במסד הנתונים.
    אשר סטטוס הבקשה שלהם אינו סומן כשולם*/}
      <Tab.Screen name="History" component={History} initialParams={{ userId: route.params.userId }} />
      { /*במעבר למסך היסטוריית התשלומים תבוצע םעולת גט אשר תשלוף את כלל בקשות התשלום אשר שמורות במסד הנתונים.
    אשר סטטוס הבקשה שלהם סומן כשולם*/}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#FEFEFE',
    alignItems: 'center',
    justifyContent: 'center',
    height: Dimensions.get('screen').height * 1,
    overflow: 'hidden',
  },
  Choice: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  Pending: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  BigIMG: {
    height: Dimensions.get('screen').height * 0.55,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7DA9FF',
    height: 54,
    width: Dimensions.get('screen').width * 0.65,
    margin: 10,
    borderRadius: 25,
    activeOpacity: 1,
  },
  txt: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold'
  },
  request: {
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'none',
    height: 54,
    width: Dimensions.get('screen').width * 0.9,
    margin: 10,
    borderWidth: 1,
    borderColor: '#9E9E9E',
    borderRadius: 16,
    flexDirection: 'row',
    padding: 16,
  },
  requestText: {
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
  },
  Paycheck: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    // backgroundColor: 'white',
    justifyContent: 'center',
  },
})