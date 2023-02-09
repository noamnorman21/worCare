import { StyleSheet } from 'react-native'
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
            <Tab.Screen name="Payments" component={Payments} options={{ tabBarLabel: 'Payments', unmountOnBlur: true }} />
            {/*בעת ניווט למסך תשלומים - למסך הראשי אין צורך בביצוע פעולות, לאחר בחירת המסך הרצוי(תשלומים/משכורות) יבוצעו פעולות גט)
                מסך תשלומים- שני תתי מסכים- פירוט יבוצע בקומפוננטת הניווט במסכים היעודיים
                */}
            <Tab.Screen name="Chats" component={Chats} options={{ tabBarLabel: 'Chats' }} />
            {/*בהתאים למימוש הצ'אט ושמירת הסטוריית השיחות - תתבצע פעולת גט אשר תשלוף את היסטוריית השיחות. 
            לכל שיחה ישלף שם המשתמש השני/הקבוצה, סטטוס השיחה (האם יש הודעה חדשה אשר לא נקראה) ותוצג ההודעה האחרונה אשר נשלחה.*/}
            <Tab.Screen name="Tasks" component={Tasks} options={{ tabBarLabel: 'Tasks', unmountOnBlur: true  }} />
            {/*בעת ניווט למסך תשלומים - תבוצע פעולת גט שתמשוך את הפרטים- ,
                 משימה אישית/משימה למטופל- מספר משימה, שם משימה, תאריך התחלה, תאריך סוף, הערות, סטטוס(לפי מספר משתמש),
                  שדות הייחודיים לטבלת משימה למטופל אשר יימשכו- מספר מטופל,מספר רשימה*/}
            <Tab.Screen name="Rights" component={Rights} options={{ tabBarLabel: 'Rights' }} />
            {/**לא נדרשת פעולה הקשורה במסדר הנתונים על מנת לטעון את המסך הנדרש */}
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
        paddingTop: 10,
    },
});
