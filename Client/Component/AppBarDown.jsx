import { SafeAreaView, View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Octicons, FontAwesome, Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import Home from '../Component/Home';
import Payments from '../Component/Payments';
import Chats from '../Component/Chats';
import Tasks from '../Component/Tasks';
import Rights from '../Component/Rights';

const CustomerHeader = () => {
    return (
        <SafeAreaView style={{ flexDirection: 'row', backgroundColor: 'white', margin: 0, padding: 20, height: 100, alignItems: 'center', zIndex: 0 }}>
            <View style={{ marginLeft: Dimensions.get('screen').width * 0.075, flex: 1, justifyContent: 'space-between', alignContent: 'space-between' }}>
                <TouchableOpacity>
                    <Image source={require('../images/icons/Profile.png')} style={{ width: 24, height: 24 }} />
                </TouchableOpacity>
            </View>
            <View style={{ flex: 1, marginLeft: Dimensions.get('screen').width * 0.01 }}>
                <Image source={require('../images/logo_New_Small.png')} style={{ width: 50, height: 50 }} />
            </View>
            <View style={{ marginRight: Dimensions.get('screen').width * 0.01 }}>
                <TouchableOpacity>
                    <Image source={require('../images/icons/notifications.png')} style={{ width: 24, height: 24 }} />
                </TouchableOpacity>
            </View>
            <View style={{ marginRight: Dimensions.get('screen').width * 0.05 }}>
                <TouchableOpacity>
                    <AntDesign name="contacts" size={24} color={'#000000'} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}


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
                        // iconSrc = focused ? 'home' : 'home';
                        return <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />
                    } else if (route.name === 'Tasks') {
                        //iconSrc = focused ? 'home' : 'home';
                        return <Octicons name="checklist" size={size} color={color} />
                    }
                    else if (route.name === 'Rights') {
                        //iconSrc = focused ? 'home' : 'home';
                        return <Octicons name="question" size={size} color={color} />
                    }
                    // return <Ionicons name={iconSrc} size={size} color={color} />;
                },
            })}
            tabBarOptions={{
                activeTintColor: '#548DFF',
                inactiveTintColor: '#808080',
                style: styles.tabBar,
            }}
            initialRouteName="Home"
        >
            <Tab.Screen name="Home" component={Home} options={{ tabBarLabel: 'Home', header: props => <CustomerHeader {...props} /> }} />
            <Tab.Screen name="Payments" component={Payments} options={{ tabBarLabel: 'Payments', header: props => <CustomerHeader {...props} /> }} />
            <Tab.Screen name="Chats" component={Chats} options={{ tabBarLabel: 'Chats', header: props => <CustomerHeader {...props} /> }} />
            <Tab.Screen name="Tasks" component={Tasks} options={{ tabBarLabel: 'Tasks', header: props => <CustomerHeader {...props} /> }} />
            <Tab.Screen name="Rights" component={Rights} options={{ tabBarLabel: 'Rights', header: props => <CustomerHeader {...props} /> }} />
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
