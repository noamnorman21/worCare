import React from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { OrLine, ReturnToLogin } from '../SignUpComponents/FooterLine';
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
    const [code, setCode] = useState('');

    const generateCode = () => {
        const code = Math.random().toString(36).substring(2, 7).toUpperCase();
        console.log(code);
        setCode(code);
    };

    const NavigateToLogIn = () => {
        navigation.navigate('LogIn')
    }
    const NavigateToNextLVL = () => {
        generateCode();
        navigation.navigate('ForgotPasswordLvl2', { userCode: code })
    }

    const getData = () => {
        console.log('in getData');
        fetch(`https://proj.ruppin.ac.il/cgroup94/prod/api/User/GetUserEmail`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({
                "email": "noam@gmail.com"
            }),
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                if (json === null) {
                    Alert.alert('This email is not registered in our system');
                    return;
                }
                generateCode();
                navigation.navigate('ForgotPasswordLvl2', { userCode: code });
            })
            .catch((error) => {
                console.log(error);
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
                <TouchableOpacity style={styles.button} onPress={NavigateToNextLVL} >
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
        alignItems: 'center',
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

