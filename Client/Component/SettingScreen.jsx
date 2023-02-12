import { TouchableOpacity, View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import {useFonts } from 'expo-font'
import { useCallback } from 'react';
import * as Font from 'expo-font';


export default function SettingScreen({navigation}) {

    const [fontsLoaded] = useFonts({
        'Urbanist-Black': require('../assets/fonts/Urbanist-Black.ttf'),
      });
    
      const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
          await SplashScreen.hideAsync();
        }
      }, [fontsLoaded]);
    
      if (!fontsLoaded) {
        return null;
      }
    
      
    return (
        <SafeAreaView style={{flex:1}}>
            <Text style={{fontFamily:'Urbanist-Black'}}>
                SettingScreen
            </Text>
        </SafeAreaView >
    )
}