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
        {/*בעת ניווט למסך התשלומים, תתבצע פעולת גט אשר תשלוף את בקשות התשלומים אשר קיימות במסד הנתונים.
      בעת רנדור עמוד פנימי פנדינג ירונדרו בקשות לפי סטוטס בקשה אינו שולם,
      בעת רנדור מס היסטוריה ירונדרו בקשות אשר בעלות סטטוס שולמו.
      מידע אשר ישלף כלפי כל בקשה- id, sunject, amount, requestDate, proofofdocument, comment, status */}
        <Stack.Screen name='Paychecks' component={Paycheck} options={() => ({
          headerShown: false,
          presentation: 'stack',
          cardOverlayEnabled: true,
        })} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Choice() {
  return (
    <View style={styles.container}>
      <Image source={require('../images/logo_New.png')} style={styles.BigIMG} />
      <TouchableOpacity
        activeOpacity={1}
        style={styles.button}
        onPress={() => {
          navigation.navigate('Payments')
        }}
      >
        <Text style={styles.txt}>Payment</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={1}
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







