import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import useIsFocused from '@react-navigation/native';
import { useState } from 'react';



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

function Choice({ navigation }) {
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
          navigation.navigate('Paychecks')
        }}
      >
        <Text style={styles.txt}>Paycheck</Text>
      </TouchableOpacity>
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();
function Payments() {
  return (
    <Tab.Navigator initialRouteName="Pending"
      backBehavior='none'
      tabBarOptions={{
        activeTintColor: '#548DFF',
        inactiveTintColor: '#9E9E9E',
        style: {
          backgroundColor: 'none',
          flex: 0,
          indicatorStyle: {
            backgroundColor: '#548DFF',
            height: 4,
            borderRadius: 25,
          }

        },
        labelStyle: {
          fontSize: 24,
          fontWeight: 'bold',
          
        },


      }}
    >
      <Tab.Screen name="Pending" component={Pending} />
      {/*במעבר למסך תשלומים ממתינים תבוצע םעולת גט אשר תשלוף את כלל בקשות התשלום אשר שמורות במסד הנתונים.
    אשר סטטוס הבקשה שלהם אינו סומן כשולם*/}
      <Tab.Screen name="History" component={History} />
      { /*במעבר למסך היסטוריית התשלומים תבוצע םעולת גט אשר תשלוף את כלל בקשות התשלום אשר שמורות במסד הנתונים.
    אשר סטטוס הבקשה שלהם סומן כשולם*/}
    </Tab.Navigator>
  );
}

function Pending() {
  const userId = 1 // יש להחליף למשתנה של המשתמש הנוכחי

  // const [Pending, setPending] = useState(second)
  // useEffect(() => {
  //   if (isFocused) {
  //     getPending()
  //   }
  // }, [isFocused])

  // const getPending = async () => {
  //   try {
  //     const response = await fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Payments/GetPending/' + userId, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',

  //       },
  //     });
  //     const data = await response.json();
  //     console.log(data)
  //     let data2 = data.map((item) => {
  //       return {
  //         id: item.id,
  //         subject: item.subject,
  //         amount: item.amount,
  //         requestDate: item.requestDate,
  //         proofofdocument: item.proofofdocument,
  //         comment: item.comment,
  //         status: item.status,
  //       }
  //     })
  //     setPending(data)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }



  return (
    <View style={styles.Pending}>    
      <Request/>
      <Request/>
      <Request/>
    </View>
  );
}

function History() {
  return (
    <View style={styles.Pending}>    
    <Request/>
    <Request/>
    <Request/>
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

function Request () {
  return (
    <View style={styles.request}>
      <Text style={styles.requestText}>Date</Text>
      <Text style={styles.requestText}>Name</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Pending: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
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
    fontWeight: '600',
  }
})