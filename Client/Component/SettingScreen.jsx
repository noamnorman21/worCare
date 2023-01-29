import {TouchableOpacity, View, Text } from 'react-native'
import React from 'react'

export default function SettingScreen(props) {
    return (
        <View>
            <TouchableOpacity onPress={() => {
                props.navigation.navigate('Notifications');
            }}>
                <Text style={{}} >
                Goto Second Page!</Text>
        </TouchableOpacity>
    </View >
  )
}