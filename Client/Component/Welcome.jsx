import { StyleSheet, View, Text, SafeAreaView, Image, Dimensions, Alert, ActivityIndicator } from 'react-native'
import { useEffect, useState } from 'react'
import { useUserContext } from '../UserContext'
import AsyncStorage from '@react-native-async-storage/async-storage'

const { width, height } = Dimensions.get('window')
// This is Splash Screen Component which will be display for 2 seconds before the app will be loaded 
export default function Welcome({ navigation, route }) {
    const {setAddNewPairing} = useUserContext();
    useEffect(() => {
        showOptions()
    }, [])

    const showOptions = async () => {
        Alert.alert(
            'Welcome',
            `You were invited to join the app by ${route.params.userName}. Please log in or sign up to continue.`,
            [
                {
                    text: 'Log In',
                    onPress: () => {
                        setAddNewPairing(true);
                        AsyncStorage.removeItem("user");
                        AsyncStorage.removeItem("userData");
                        navigation.navigate('LogIn', { patientId: route.params.patientId })},
                },
                {
                    text: 'Sign Up',
                    onPress: () => navigation.navigate('SignUp', { patientId: route.params.patientId, userType: 'Caregiver' })
                },
            ],
            { cancelable: false }
        )
    }

    return (
        <SafeAreaView>
            <View style={styles.imageContainer}>
                <Image source={require('../images/logo_New.png')} style={styles.image} />
                <ActivityIndicator size="large" />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        width: width * 0.8,
        height: height * 0.8,
        alignItems: 'center',
        resizeMode: 'contain',
    },
});