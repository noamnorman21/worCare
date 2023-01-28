import { StyleSheet, View, Text, SafeAreaView, Image } from 'react-native'
import React from 'react'

export default function Welcome() {

    return (
        <SafeAreaView>
            {/* This img will be display */}
            <View style={styles.imageContainer}>
                <Image
                    style={styles.image}
                    source={require('../images/logo_New.png')}
                />
            </View>
            {/* and after 2 seconds circular progress bar gif will add to the screen to show the progress of the loading */}
            <View style={styles.imageContainer}>
                <Image
                    style={styles.image}
                    source={require('../images/logo_New_Small.png')}
                />
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