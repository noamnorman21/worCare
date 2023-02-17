import { StyleSheet, View, Text, SafeAreaView, Image } from 'react-native'
import React from 'react'

// This is Splash Screen Component which will be display for 2 seconds before the app will be loaded 
export default function Welcome() {
    return (
        <SafeAreaView>
            <View style={styles.imageContainer}>
                <Image source={require('../images/logo_New.png')} style={styles.image} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
    },
});