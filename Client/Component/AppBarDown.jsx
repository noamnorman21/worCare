import { StyleSheet} from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Octicons, Ionicons, AntDesign } from '@expo/vector-icons';

import Home from '../Component/Home';
import Payments from '../Component/Payments';
import Chats from '../Component/Chats';
import Tasks from '../Component/Tasks';
import Rights from '../Component/Rights';

const Tab = createBottomTabNavigator();
export default function AppBarDown() {
    return (
        <Tab.Navigator 
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconSrc;
                    if (route.name === 'Home') {
                        iconSrc = focused ? 'home' : 'home';
                        return <Octicons name={iconSrc} size={size} color={color} />
                    } else if (route.name === 'Payments') {
                        iconSrc = focused ? 'credit-card' : 'credit-card';
                        return <Octicons name={iconSrc} size={size} color={color} />
                    } else if (route.name === 'Chats') {
                        //sliders icon for settings
                        return <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />
                    } else if (route.name === 'Tasks') {
                        //iconSrc = focused ? 'home' : 'home';
                        return <Octicons name="checklist" size={size} color={color} />
                    }
                    else if (route.name === 'Rights') {
                        //iconSrc = focused ? 'home' : 'home';
                        return <Octicons name="question" size={size} color={color} />
                    }
                },
                headerShown: false,
                
            })
        }
            tabBarOptions={{
                activeTintColor: '#548DFF',
                inactiveTintColor: '#808080',
                style: styles.tabBar,
            }}
            initialRouteName="Home"
        >
            <Tab.Screen name="Home" component={Home} options={{ tabBarLabel: 'Home'}} />
                {/*בעת ניווט למסך הבית - תבוצע פעולת גט (באמצעות שליחת מספר משתמש) אשר תמשוך מידע מן הקונרולר יוזר, או קונטרולר עובד זר במקרה ובו מדובר בעובד זר.
                תמשוך את הפרטים הבאים- Calendarforuser- calendar type;
                Patienttask, Privatetask (אם משתמש הינו מטפל זר)- task name, fromdate, toDate, taskComment ) */}
            <Tab.Screen name="Payments" component={Payments} options={{ tabBarLabel: 'Payments' }} />
                 {/*בעת ניווט למסך הבית - תבוצע פעולת גט (באמצעות שליחת מספר משתמש ושליחת מספר משתמש מצוות) אשר תמשוך מידע מן הקונטרולר יוזר 
                תמשוך את הפרטים הבאים-  */}
            <Tab.Screen name="Chats" component={Chats} options={{ tabBarLabel: 'Chats' }} />
            <Tab.Screen name="Tasks" component={Tasks} options={{ tabBarLabel: 'Tasks'}} />
               {/*בעת ניווט למסך הבית - תבוצע פעולת גט (באמצעות שליחת מספר משתמש ושליחת מספר משתמש מצוות) אשר תמשוך מידע מן הקונטרולר יוזר 
                תמשוך את הפרטים הבאים-  */}
            <Tab.Screen name="Rights" component={Rights} options={{ tabBarLabel: 'Rights' }} />
               {/* לא נדרשת שליפה/השמה של נתונים בהגעה לעמוד זה. בתוך העמוד יבוצע הממשק על GPT */}
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabBar: {
        backgroundColor: '#fff',
    },
});
