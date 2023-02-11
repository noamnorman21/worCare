import { SafeAreaView, View, Text, TextInput, Button, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { useState , useEffect} from 'react'
import { OrLine, ReturnToLogin } from './FooterLine'


// Validate Email if it is valid user in database or not
// if it is valid user then send verification code to email
// if it is not valid user then show error message
const checkIfEmailExist = () => {
    //check email format, it should be email format
    if (!validateEmail(email)) {
        Alert.alert('Email is not valid');
        return;
    }
    //here we will call api to check if email exist or not.. 
    useEffect(() => {
        fetch('http://localhost:53700/api/User/GetUserByEmail?email=' + email, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson == null) {
                    Alert.alert('Email is not valid');
                    return;
                }
                else {
                    Alert.alert('Email is valid');//just for testing
                }
            })
    }, []);     
}

//function to check email format
const validateEmail = (email) => {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}


export default function ForgotPassword() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>

                <Text style={styles.welcome}>Forgot Your Password?</Text>
                <Text style={styles.instructions}>
                    no worries, you just need to enter your email address below and we will send you the verification code.
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    onChangeText={text => setEmail(text)}
                    keyboardType="email-address"
                    autoCorrect={false}
                />
                {/* Submit And go to next lvl screen - verification code */}
                <TouchableOpacity style={styles.button} onPress={checkIfEmailExist}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </View>
            <OrLine />
            <ReturnToLogin />
        </SafeAreaView>
    )
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
        paddingBottom: 20
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

