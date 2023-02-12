import React from 'react';
import { SafeAreaView, View, Text, TextInput, Button, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { OrLine, ReturnToLogin } from './FooterLine';
import axios from 'axios';

// This is the Forgot Password screen
// This screen is the first screen of the forgot password process
// The user enters his email address and clicks submit
// The user is then redirected to the verification code screen
export default function ForgotPassword({ navigation }) {
    const [email, setEmail] = useState('');

    // fetch with a GET request 
    // to check if email exists in the database
    // if it does, then the user is redirected to the verification code screen
    // if it doesn't, then the user is alerted that the email doesn't exist
    const checkIfEmailExist = () => {
        axios.get(`https://localhost:44387/api/User/GetUserEmail`,
            {
                params: {
                    email
                }
            })
            .then((response) =>{
                console.log(response.data);
                return response.data;
            })
            .then((data) => {
                if (data.length > 0) {
                    Alert.alert('Email exists');
                    // navigation.navigate('ForgotPasswordLvl2', { email: email });
                } else {
                    Alert.alert('Email does not exist');
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                <Text style={styles.welcome}>Forgot Your Password?</Text>
                <Text style={styles.instructions}>
                    no worries, you just need to enter your email address below and we
                    will send you the verification code.
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCorrect={false}
                    autoCapitalize="none"
                />
                {/* Submit And go to next lvl screen - verification code */}
                <TouchableOpacity style={styles.button} onPress={checkIfEmailExist}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </View>
            <OrLine />
            <ReturnToLogin />
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
        fontSize: '30px',
        fontWeight: '700',
        textAlign: 'center',
        lineHeight: '38px',
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        margin: Dimensions.get('screen').width * 0.03,
        fontSize: '15px',
        fontWeight: '500',
        lineHeight: '18px',
        paddingTop: 10,
        paddingBottom: 20,
    },
    input: {
        width: Dimensions.get('window').width * 0.9,
        padding: 10,
        margin: 10,
        alignItems: 'left',
        borderRadius: 16,
        borderWidth: 1,
        backgroundColor: '#F5F5F5',
        borderColor: 'lightgray',
        shadowColor: '#000',
        height: 54,
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
        fontWeight: 'bold',
    },
    inputContainer: {
        flex: 5,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

