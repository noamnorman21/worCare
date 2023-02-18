import { View, TouchableOpacity, Image, Dimensions, StyleSheet, Alert, BackHandler} from 'react-native'
import React from 'react'
import { Octicons, Ionicons, AntDesign, Feather } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SettingScreen from './SettingScreen';
import Contacts from './Contacts';
import PushNotifications from './PushNotifications';
import { useState } from 'react';
import { useEffect } from 'react';

import Home from '../Component/Home';
import Finance from './Finance';
import Chats from '../Component/Chats';
import Tasks from '../Component/Tasks';
import Rights from '../Component/Rights';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function CustomHeader({navigation}) {
 const [text, settext] = useState('') 
 useEffect(() => 
 navigation.addListener('beforeRemove', (e) => {
    if (text!=='Login') {
         // Prevent default behavior of leaving the screen
        e.preventDefault();
        // Prompt the user before leaving the screen
        Alert.alert(
        'Exit app?',
        'are you sure you want to alose the app?',
        [
          { text: "Don't leave", style: 'cancel', onPress: () => {} },
          {
            text: 'Leave',
            style: 'destructive',
            // If the user confirmed, then we dispatch the action we blocked earlier
            // This will continue the action that had triggered the removal of the screen
            onPress: () => BackHandler.exitApp()
          },
        ]
      );
    }   
  }),
[navigation]
);
 

    return (
        <Stack.Navigator>
            <Stack.Screen
                name='AppBarDown'
                component={AppBarDown}
                options={({ navigation }) => ({
                    title: ' ',
                    headerLeft: () => (
                        <View style={styles.headerLeft}>
                            <TouchableOpacity
                                onPress={() => { navigation.navigate('SettingScreen') }}
                            >
                                <Image
                                    source={require('../images/icons/Profile.png')}
                                    style={{ width: 32, height: 28 }}
                                />
                            </TouchableOpacity>
                        </View>
                    ),
                    headerRight: () => (
                        <View style={styles.headerRight}>
                            <TouchableOpacity
                                style={{ right: Dimensions.get('screen').width * 0.06 }}
                                onPress={() => { navigation.navigate('PushNotifications') }}
                            >
                                <Feather
                                    name="bell"
                                    size={28}
                                    color={'#000000'}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ right: Dimensions.get('screen').width * 0.04 }}
                                onPress={() => { navigation.navigate('Contacts') }}
                            >
                                <AntDesign
                                    name="contacts"
                                    size={28}
                                    color={'#000000'}
                                />
                            </TouchableOpacity>
                        </View>
                    ),
                    headerTitle: () => (
                        <Image
                            source={require('../images/logo_New_Small.png')}
                            style={styles.headerLogo}
                        />
                    ),
                    headerTitleAlign: 'center',
                })}
            />
            <Stack.Screen name='SettingScreen' component={SettingScreen}
                options={() => ({
                    headerTitle: 'Settings',
                    presentation: 'stack',
                    cardOverlayEnabled: true,
                })} />
            <Stack.Screen name='PushNotifications' component={PushNotifications}
                options={() => ({
                    headerTitle: 'Notifications',
                    presentation: 'stack',
                    cardOverlayEnabled: true,
                })} />
            <Stack.Screen name='Contacts' component={Contacts} />
            {/*במסך אנשי הקשר תתבצע פעולת גט אשר תשלוף מן קונטרולר מטופל את אנשי הקשר שלו.
            לכל איש קשר ישלפו שם, מספר טלפון, מספר נייד, אימייל ותפקיד. 
            במסך הראשוני יוצג רק השם ומספר הנייד, ובמסך איש קשר פנימי יוצגו שאר הפרטים */}
        </Stack.Navigator>
    );
}

function AppBarDown() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    if (route.name === 'Home') {
                        return <Octicons name={'home'} size={size} color={color} />
                    } else if (route.name === 'Finance') {
                        return <Octicons name={'credit-card'} size={size} color={color} />
                    } else if (route.name === 'Chats') {
                        return <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />
                    } else if (route.name === 'Tasks') {
                        return <Octicons name="checklist" size={size} color={color} />
                    } else if (route.name === 'Rights') {
                        return <Octicons name="question" size={size} color={color} />
                    }
                },
                headerShown: false
            })
            }
            tabBarOptions={{
                activeTintColor: '#548DFF',
                inactiveTintColor: '#808080',
                style: styles.tabBar,
            }}
            initialRouteName="Home"
        >
            <Tab.Screen name="Home" component={Home} options={{ tabBarLabel: 'Home' }} />
            {/*בעת ניווט למסך הבית - תבוצע פעולת גט שתמשוך את הפרטים- לוח שנה למשתמש- סוג לוח שנה,
                משימה אישית/משימה למטופל- מספר משימה, שם משימה, תאריך התחלה, תאריך סוף, הערות, סטטוס */}
            <Tab.Screen name="Finance" component={Finance} options={{ tabBarLabel: 'Finance', unmountOnBlur: true }} />
            {/*בעת ניווט למסך תשלומים - למסך הראשי אין צורך בביצוע פעולות, לאחר בחירת המסך הרצוי(תשלומים/משכורות) יבוצעו פעולות גט)
                מסך תשלומים- שני תתי מסכים- פירוט יבוצע בקומפוננטת הניווט במסכים היעודיים
                */}
            <Tab.Screen name="Chats" component={Chats} options={{ tabBarLabel: 'Chats' }} />
            {/*בהתאים למימוש הצ'אט ושמירת הסטוריית השיחות - תתבצע פעולת גט אשר תשלוף את היסטוריית השיחות. 
            לכל שיחה ישלף שם המשתמש השני/הקבוצה, סטטוס השיחה (האם יש הודעה חדשה אשר לא נקראה) ותוצג ההודעה האחרונה אשר נשלחה.*/}
            <Tab.Screen name="Tasks" component={Tasks} options={{ tabBarLabel: 'Tasks', unmountOnBlur: true }} />
            {/*בעת ניווט למסך משימות - תבוצע פעולת גט שתמשוך את הפרטים- ,
                 משימה אישית/משימה למטופל- מספר משימה, שם משימה, תאריך התחלה, תאריך סוף, הערות, סטטוס(לפי מספר משתמש),
                  שדות הייחודיים לטבלת משימה למטופל אשר יימשכו- מספר מטופל,מספר רשימה*/}
            <Tab.Screen name="Rights" component={Rights} options={{ tabBarLabel: 'Rights' }} />
            {/**לא נדרשת פעולה הקשורה במסדר הנתונים על מנת לטעון את המסך הנדרש */}
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    container:
        { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
    tabBar:
        { backgroundColor: '#fff', paddingTop: 10 },
    headerLeft:
        { marginLeft: Dimensions.get('screen').width * 0.075, flex: 1, justifyContent: 'space-between', alignContent: 'space-between' },
    headerRight:
        { marginLeft: Dimensions.get('screen').width * 0.075, flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'space-between' },
    headerLogo:
        { width: 50, height: 50, bottom: Dimensions.get('screen').height * 0.01, left: Dimensions.get('screen').width * 0.005 }
});

export { AppBarDown, CustomHeader }