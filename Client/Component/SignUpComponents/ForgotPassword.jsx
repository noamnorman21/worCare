import React from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { OrLine, ReturnToLogin } from './FooterLine';
import * as Font from 'expo-font'

Font.loadAsync({
    'Urbanist': require('../../assets/fonts/Urbanist-Regular.ttf'),
    'Urbanist-Bold': require('../../assets/fonts/Urbanist-Bold.ttf'),
    'Urbanist-Light': require('../../assets/fonts/Urbanist-Light.ttf'),
    'Urbanist-Medium': require('../../assets/fonts/Urbanist-Medium.ttf'),
});

// This is the Forgot Password screen
// This screen is the first screen of the forgot password process
// The user enters his email address and clicks submit
// The user is then redirected to the verification code screen

export default function ForgotPassword({ navigation }) {
    const [email, setEmail] = useState('');

    const NavigateToLogIn = () => {
        navigation.navigate('LogIn')
    }

    const getData = () => {
        Alert.alert('Login Success');//just for testing
        fetch('https://localhost:44387/api/User/GetUserEmail', { // Need To update the get request and the functions that are called
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
            })
        })
        .then(res => {
            console.log('res=', res);
            console.log('res.status', res.status);
            console.log('res.ok', res.ok);
            return res.json()
        })
        .then(
            (result) => {
                console.log("fetch GET= ", result);
            },
            (error) => {
                console.log("err post=", error);
            });
    }


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                <Text style={styles.welcome}>Forgot Your Password?</Text>
                <Text style={styles.instructions}>
                    no worries, just enter your email address below and we
                    will send you the verification code.
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCorrect={false}
                    autoCapitalize="none"
                    onChangeText={(email) => setEmail(email)}
                />
                {/* Submit And go to next lvl screen - verification code */}
                <TouchableOpacity style={styles.button} onPress={ getData } >
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </View>
            <OrLine />
            <ReturnToLogin NavigateToLogIn={NavigateToLogIn} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F5F5',
        flexDirection: 'column',
    },
    welcome: {
        fontSize: 28,
        fontFamily: 'Urbanist-Bold',
        textAlign: 'center',
        lineHeight: 38,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        margin: Dimensions.get('screen').width * 0.03,
        fontSize: 15,
        fontFamily: 'Urbanist',
        lineHeight: 18,
        paddingTop: 10,
        paddingBottom: 20,
    },
    input: {
        width: Dimensions.get('window').width * 0.9,
        padding: 10,
        margin: 10,
        alignItems: 'flex-left',
        borderRadius: 16,
        borderWidth: 1,
        backgroundColor: '#F5F5F5',
        borderColor: 'lightgray',
        shadowColor: '#000',
        height: 54,
        fontFamily: 'Urbanist',
        fontSize: 14,
    },
    button: {
        width: Dimensions.get('window').width * 0.9,
        backgroundColor: '#548DFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'lightgray',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 1,
        margin: 15,
        height: 54,

    },
    buttonText: {
        color: 'white',
        fontSize: 17,
        fontFamily: 'Urbanist-Bold',
    },
    inputContainer: {
        flex: 5,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

