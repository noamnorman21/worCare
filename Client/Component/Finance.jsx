import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Pending from './PaymentsScreen/Pending';
import History from './PaymentsScreen/History';
import EditPaymentScreen from './PaymentsScreen/EditPaymentScreen';
import NewPayment from './PaymentsScreen/NewPayment';
import Paychecks from './Paychecks components/Paychecks';




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
  return (
    <View style={styles.Choice}>
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
     screenOptions={{
      tabBarActiveTintColor: '#548DFF',
      tabBarInactiveTintColor: 'grey',
      tabBarIndicatorStyle: { height: 4, marginLeft:5, marginRight:5, width: '45%', borderRadius: 16,},
      tabBarLabelStyle: { fontSize: 24, fontWeight: 'bold', fontFamily: 'sans-serif', textTransform: 'none' },
      tabBarStyle: { backgroundColor: '#fff' },      
     }}
    >
      <Tab.Screen name="Pending" component={Pending}  />
      {/*במעבר למסך תשלומים ממתינים תבוצע םעולת גט אשר תשלוף את כלל בקשות התשלום אשר שמורות במסד הנתונים.
    אשר סטטוס הבקשה שלהם אינו סומן כשולם*/}
      <Tab.Screen name="History" component={History} />
      { /*במעבר למסך היסטוריית התשלומים תבוצע םעולת גט אשר תשלוף את כלל בקשות התשלום אשר שמורות במסד הנתונים.
    אשר סטטוס הבקשה שלהם סומן כשולם*/}    
    </Tab.Navigator>

  );
}



function Paycheck() {
  return (
    <View style={styles.Paycheck}>
      <Text>Bla</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {    
    alignItems: 'center',
    justifyContent: 'center',
    height: Dimensions.get('screen').height * 1,
    overflow: 'hidden',
  },
  Choice: {
    flex: 1,
    alignItems: 'center',    
    backgroundColor: 'white',
  },

  Pending: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: 'white',
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
  },
  Paycheck: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
})