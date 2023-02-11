import { StyleSheet, View, SafeAreaView, Dimensions, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Octicons, Ionicons, AntDesign } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SettingScreen from './SettingScreen';
import Contacts from './Contacts';
import PushNotifications from './PushNotifications';

import Home from '../Component/Home';
import Payments from '../Component/Payments';
import Chats from '../Component/Chats';
import Tasks from '../Component/Tasks';
import Rights from '../Component/Rights';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
export default function AppBarDown() {
    return (
        <View style={{ flex: 1 }}>
            <View style={{ flex: flexUp }}>
                <NavigationContainer independent={true} >
                    <Stack.Navigator
                        screenOptions={{
                            headerMode: 'none',
                        }}
                    >
                        <Stack.Screen name='App Bar Up' component={AppBarUp}
                            
                        />
                        <Stack.Screen name='SettingScreen' component={SettingScreen} 
                        options={{
                            presentation:'transparentModal',
                            
                        }}
                        />
                        <Stack.Screen name='PushNotifications' component={PushNotifications} />
                        <Stack.Screen name='Contacts' component={Contacts} />
                    </Stack.Navigator>
                </NavigationContainer>
            </View>

            <View style={{ flex: flexDown }}>
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
                    <Tab.Screen name="Payments" component={Payments} options={{ tabBarLabel: 'Payments' }} />
                    <Tab.Screen name="Chats" component={Chats} options={{ tabBarLabel: 'Chats' }} />
                    <Tab.Screen name="Tasks" component={Tasks} options={{ tabBarLabel: 'Tasks' }} />
                    <Tab.Screen name="Rights" component={Rights} options={{ tabBarLabel: 'Rights' }} />
                </Tab.Navigator>
            </View>
        </View>
    )
}

function AppBarUp({ navigation }) {
    return (
        <SafeAreaView style={styles.Header}>
            {/* Left - Settings - ClickAble - To SettingScreen */}
            <View style={styles.ProfileIcon}>
                <TouchableOpacity onPress={() => { navigation.navigate('SettingScreen') }}>
                    <Image source={require('../images/icons/Profile.png')} style={{ width: 24, height: 24 }} />
                </TouchableOpacity>
            </View>
            {/* Middle - Logo - not clickable */}
            <View style={styles.logo}>
                <Image source={require('../images/logo_New_Small.png')} style={{ width: 50, height: 50 }} />
            </View>
            {/* Right - Notifications - ClickAble - To PushNotifications */}
            <View style={styles.Notifications}>
                <TouchableOpacity onPress={() => { navigation.navigate('PushNotifications') }}>
                    <Image source={require('../images/icons/notifications.png')} style={{ width: 24, height: 24 }} />
                </TouchableOpacity>
            </View>
            {/* Right - Contacts - ClickAble - To Contacts */}
            <View style={styles.ContactICON}>
                <TouchableOpacity onPress={() => { navigation.navigate('Contacts') }}>
                    <AntDesign name="contacts" size={24} color={'#000000'} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
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
    ProfileIcon: { marginLeft: Dimensions.get('screen').width * 0.075, flex: 1, justifyContent: 'space-between', alignContent: 'space-between' },
    logo: { flex: 1, marginLeft: Dimensions.get('screen').width * 0.01 },
    Notifications: { marginRight: Dimensions.get('screen').width * 0.01 },
    ContactICON: { marginRight: Dimensions.get('screen').width * 0.05 },
    Header: { flexDirection: 'row', backgroundColor: 'white', margin: 0, padding: 20, height: 100, alignItems: 'center', zIndex: 0 },
});
