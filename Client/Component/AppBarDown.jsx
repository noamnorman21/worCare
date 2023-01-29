import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Octicons, Ionicons } from '@expo/vector-icons';
import Home from '../Component/Home';
import Payments from '../Component/Payments';
import Chats from '../Component/Chats';
import Tasks from '../Component/Tasks';
import Rights from '../Component/Rights';


const Tab = createBottomTabNavigator();
export default function AppBarDown() {
    return (
        <Tab.Navigator
            screenOptions ={({ route }) => ({
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
            <Tab.Screen name="Home" component={Home} options={{ tabBarLabel: 'Home' }} />
            <Tab.Screen name="Payments" component={Payments} options={{ tabBarLabel: 'Payments' }} />
            <Tab.Screen name="Chats" component={Chats} options={{ tabBarLabel: 'Chats' }} />
            <Tab.Screen name="Tasks" component={Tasks} options={{ tabBarLabel: 'Tasks' }} />
            <Tab.Screen name="Rights" component={Rights} options={{ tabBarLabel: 'Rights' }} />
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
