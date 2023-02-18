import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

export default function Tasks() {
  return (
    <Tab.Navigator
      initialRouteName="Main"
      tabBarOptions={{
        pressColor: '#548DFF',
        pressOpacity: 0.5,
        labelStyle: {
          fontSize: 16, // <-- change this size to 18 when we have the font family 'Urbanist'
          fontWeight: 'bold',
          color: '#9E9E9E',
          textTransform: 'none',
          alignItems: 'center',
        },
        style: {
          backgroundColor: 'transparent',
          marginTop: 25,
          height: 50,
        },
        indicatorStyle: {
          backgroundColor: '#548DFF',
          height: 4,
        },
        tabStyle: { width: 'auto', marginLeft: 10, alignItems: 'center' },
      }} >
      <Tab.Screen style={styles.container2} name="Main" component={Main} />
      {/* בעת מעבר למסך ראשי תבוצע פעולת גט אשר תשלוף את כלל המשימות (כולל משימות תרופות אשר יותאמו בהתאם לזמן נטילת התרופות */}
      <Tab.Screen name="General" component={General} />
      {/*בעת מעבר למסך כללי תבוצע פעולת גט אשר תשלוף את כלל המשימות אשר נכללות ברשימה הכללית )
      בנוסף ממסך זה תתבצע פעולה אשר תבצע שינוי בסטטוס משימה- לפי סימון באפליקציה  */}
      <Tab.Screen name="Shop" component={Shop} />
      {/*-בעת מעבר למסך קניות תבוצע פעולה גט אשר תשלוף את כלל המשימות אשר נכללות ברשימת הקניות- לפי סוג רשימה. )
      לכל רשימה ישלפו המוצרים שלה. לכל מוצר יוצג שם המוצר והכמות הרצויה ממנו
      בנוסף ממסך זה תתבצע פעולה אשר תבצע שינוי בסטטוס מוצר- לפי סימון באפליקציה */}
      <Tab.Screen name="Medicine" component={Medicine} />
      {/*בעת מעבר למסך תרורפות תבוצע פעולת גט 
       הפעולה תמשוך מידע מן טבלת תרופה למטופל בעזרת הקישור בין מטופל למטפל
       במידע אשר ישלף הינו שם תרופה, תאריך התחלה, תאריך סיום,כמות קיימת, הערות , שעת נטילה (תדירות))
       בנוסף ממסך זה יבוצע מעבר למסך תרופה ספציפית ותתאפשר פעולת ביצוע שינוי סטטוס תרופה*/}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'none',
    fontFamily: 'Urbanist',
  }

})