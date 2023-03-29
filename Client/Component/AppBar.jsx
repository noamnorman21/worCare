import { View, TouchableOpacity, Image, Dimensions, StyleSheet, Alert } from 'react-native'
import { Octicons, Ionicons, AntDesign, Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SettingScreen from './SettingScreen';
import Contacts from './Contacts';
import PushNotifications from './PushNotifications';

import Home from './Home';
import Finance from './Finance';
import Chats from './Chats';
import Tasks from './Tasks';
import Rights from './Rights';

import { useRoute } from '@react-navigation/native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function CustomHeader() {

const route = useRoute();

    return (
        <Stack.Navigator>
            <Stack.Screen
                name='AppBarDown'
                component={AppBarDown}
                options={({ navigation }) => ({
                    title: ' ',
                    headerTitleAlign: 'center',
                    headerLeft: () => (
                        <View style={styles.headerLeft}>
                            <TouchableOpacity
                            //on press send the function hideHeader and showHeader to the child component
                                onPress={() => { navigation.navigate('SettingScreen')}}                                
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
                    unmountOnBlur: true,
                })}
            />
            <Stack.Screen name='SettingScreen'
                component={SettingScreen}
                options={(root) => ({
                    headerTitle: 'Settings',
                    presentation: 'stack',
                    cardOverlayEnabled: true,
                    headerShown: true,   
                    unmountOnBlur: true                
                })}
            />

            <Stack.Screen name='PushNotifications' component={PushNotifications}
                options={() => ({
                    headerTitle: 'Notifications',
                    presentation: 'stack',
                    cardOverlayEnabled: true,
                })} />
            <Stack.Screen name='Contacts' component={Contacts} options={{ unmountOnBlur: true }} />
        </Stack.Navigator>
    );
}

function AppBarDown() {
    useEffect(() => {
        const getData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('user');
                const userData = jsonValue != null ? JSON.parse(jsonValue) : null;
                getDataFromDB(userData);
                console.log('userData', userData);
            } catch (e) {
                console.log('error', e);
            }
        };
        getData();
    }, []);

    const getDataFromDB = (userData) => {
        let userForLoginUrl = 'https://proj.ruppin.ac.il/cgroup94/test1/api/User/GetUserForLogin';
        fetch(userForLoginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
            .then((response) => response.json())
            .then((json) => {
                if (json === null) {
                    Alert.alert('Login Failed');
                }
                else {
                    console.log("user Data Home Screen: ", json);
                    // save the user data in the storage
                    AsyncStorage.setItem("userData", JSON.stringify(json));
                }
            }
            )
            .catch((error) => {
                Alert.alert('Login Failed');
            }
            );
    }

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                activeTintColor: '#548DFF',
                inactiveTintColor: '#808080',
                style: styles.tabBar,
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
            {/*בעת ניווט למסך תשלומים - תבוצע פעולת גט שתמשוך את הפרטים- ,
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
        { marginTop: 10, marginLeft: Dimensions.get('screen').width * 0.075, flex: 1, justifyContent: 'space-between', alignContent: 'space-between' },
    headerRight:
        { marginTop: 10, marginLeft: Dimensions.get('screen').width * 0.075, flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'space-between' },
    headerLogo:
        { width: 50, height: 50, bottom: Dimensions.get('screen').height * 0.01, left: Dimensions.get('screen').width * 0.005 }
});

export { AppBarDown, CustomHeader }