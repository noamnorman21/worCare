// import { View, TouchableOpacity, SafeAreaView, Image, Dimensions,Button } from 'react-native'
// import React from 'react'
// import { NavigationContainer } from '@react-navigation/native';
// import { AntDesign } from '@expo/vector-icons';
// import { createStackNavigator } from '@react-navigation/stack';
// import AppBarDown from './AppBarDown';
// import SettingScreen from './SettingScreen';
// import Contacts from './Contacts';
// import PushNotifications from './PushNotifications';


// const Stack = createStackNavigator();
// export default function CustomHeader(props, {navigation}) {
//     return (


//         <NavigationContainer independent={true} zIndex='0'   >
//             <Stack.Navigator>
//                 {/*הכנסתי את הבאר התחתון כמסך הראשי, שינוי של הסדר של הכינון הפנימי גרם לזה לעבוד */}
//                 <Stack.Screen name='AppBarDown' component={AppBarDown} options={({navigation}) => ({
//                     headerShown: true,
//                     headerTitle: '',
//                     headerLeft: () => ( <View style={{ marginLeft: Dimensions.get('screen').width * 0.075, flex: 1, justifyContent: 'space-between', alignContent: 'space-between' }}>
//                     <TouchableOpacity style={{justifyContent:'center', alignItems:'center', top:16}} onPress={() => {navigation.navigate('SettingScreen')}}>
//                         <Image source={require('../images/icons/Profile.png')} style={{ width: 24, height: 24, justifyContent:'center' }} />
//                     </TouchableOpacity>
//                 </View>
//                     ),
//                     headerRight: () => ( <View style={{ marginLeft: Dimensions.get('screen').width * 0.075, flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'space-between' }}>
//                     <TouchableOpacity style={{justifyContent:'center', alignItems:'center',  right:16}} onPress={() => {navigation.navigate('PushNotifications')}}>
//                         <Image source={require('../images/icons/notifications.png')} style={{ width: 24, height: 24, justifyContent:'center' }} />
//                     </TouchableOpacity>
//                     <TouchableOpacity style={{justifyContent:'center', alignItems:'center',right:16}} onPress={() => {navigation.navigate('Contacts')}}>
//                     <AntDesign name="contacts" size={24} color={'#000000'} />
//                     </TouchableOpacity>
//                 </View>
//                     ),
//                     headerTitleAlign: 'center',
//                     headerTitle: () => (
//                         <Image source={require('../images/logo_New_Small.png')} style={{ width: 50, height: 50 }} />
//                     ),
//                 })} />
//                 <Stack.Screen name='SettingScreen' component={SettingScreen} options={() => ({
//                     headerShown: true,
//                     headerTitle: 'Settings',
//                     presentation: 'stack',
//                     cardOverlayEnabled: true,
                  
//                 })} />
//                 <Stack.Screen name='PushNotifications' component={PushNotifications} options={() => ({
//                     headerShown: true,
//                     headerTitle: 'Notifications',
//                     presentation: 'stack',
//                     cardOverlayEnabled: true,
//                 })} />
//                 <Stack.Screen name='Contacts' component={Contacts} />
//             </Stack.Navigator>

//         </NavigationContainer>
        
//         // <View style={{flex:1}}>
//         //     <NavigationContainer independent={true} >
//         //         <Stack.Navigator headerMode='none' >
//         //             <Stack.Screen name='AppBarUp' component={AppBarUp} />
//         //             <Stack.Screen name='SettingScreen' component={SettingScreen} />
//         //             <Stack.Screen name='PushNotifications' component={PushNotifications} />
//         //             <Stack.Screen name='Contacts' component={Contacts} />
//         //         </Stack.Navigator>
//         //     </NavigationContainer>
//         // </View>
//     );
//     {/* <NavigationContainer>
//       <Stack.Navigator>
//         <Stack.Screen
//           name="Home"
//           component={HomeScreen}
//           options={{
//             headerTitle: (props) => <LogoTitle {...props} />,
//             headerRight: () => (
//               <Button
//                 onPress={() => alert('This is a button!')}
//                 title="Info"
//                 color="#00cc00"
//               />
//             ),
//           }}
//         />
//       </Stack.Navigator>
//     </NavigationContainer> */}

// }


// // not in use
// function AppBarUp({ navigation }) {
//     return (
//         <SafeAreaView style={{ flexDirection: 'row', backgroundColor: 'white', margin: 0, padding: 20, height: 100, alignItems: 'center', zIndex: 0 }}>
//             {/* Left - Settings - ClickAble - To SettingScreen */}
//             <View style={{ marginLeft: Dimensions.get('screen').width * 0.075, flex: 1, justifyContent: 'space-between', alignContent: 'space-between' }}>
//                 <TouchableOpacity onPress={() => { navigation.navigate('SettingScreen') }}>
//                     <Image source={require('../images/icons/Profile.png')} style={{ width: 24, height: 24 }} />
//                 </TouchableOpacity>
//             </View>
//             {/*במעבר למסך ההגדרות ישלפו הגדרות המתשתמש הנבחרות לתפעול האפליקתיה.
//             בנוסף תתבצע פעות גט למסד הנתונים וישלפו כלל הפרטים של המשתמש, על מנת לאפשר שינוי של הפרופיל. */}
//             {/* Middle - Logo - not clickable */}
//             <View style={{ flex: 1, marginLeft: Dimensions.get('screen').width * 0.01 }}>
//                 <Image source={require('../images/logo_New_Small.png')} style={{ width: 50, height: 50 }} />
//             </View>
//             {/* Right - Notifications - ClickAble - To PushNotifications */}
//             <View style={{ marginRight: Dimensions.get('screen').width * 0.01 }}>
//                 <TouchableOpacity onPress={() => { navigation.navigate('PushNotifications') }}>
//                     <Image source={require('../images/icons/notifications.png')} style={{ width: 24, height: 24 }} />
//                 </TouchableOpacity>
//             </View>
//             {/* Right - Contacts - ClickAble - To Contacts */}
//             <View style={{ marginRight: Dimensions.get('screen').width * 0.05 }}>
//                 <TouchableOpacity onPress={() => { navigation.navigate('Contacts') }}>
//                     <AntDesign name="contacts" size={24} color={'#000000'} />
//                 </TouchableOpacity>
//             </View>
//             {/*בעת ניווט למסך אנשי הקשר תתבצע פעולת גט (באמצעות מספר מטופל- המקושר למשתמש), וישלפו נתוני איש הקשר 
//             הנתונים הנשלפים הינם שם, מספר טלפון, מספר נייד, אימייל, תפקיד, הערות ומספר מטופל.
//             בנוסף ישלפו מספרים חשובים אשר נשמרו על ידי המשתמש. */}
//         </SafeAreaView>
//     )
// }

import { View, TouchableOpacity, Image, Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import { Octicons, Ionicons, AntDesign, Feather } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SettingScreen from './SettingScreen';
import Contacts from './Contacts';
import PushNotifications from './PushNotifications';

import Home from '../Component/Home';
import Finance from './Finance';
import Chats from '../Component/Chats';
import Tasks from '../Component/Tasks';
import Rights from '../Component/Rights';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function CustomHeader() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name='AppBarDown' 
                component={AppBarDown}
                options={({ navigation }) => ({
                    title:' ',
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
        { marginLeft: Dimensions.get('screen').width * 0.075, flex: 1, justifyContent: 'space-between', alignContent: 'space-between' },
    headerRight:
        { marginLeft: Dimensions.get('screen').width * 0.075, flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'space-between' },
    headerLogo:
        { width: 50, height: 50, bottom: Dimensions.get('screen').height * 0.01, left: Dimensions.get('screen').width * 0.005 }
});

export { AppBarDown, CustomHeader }
