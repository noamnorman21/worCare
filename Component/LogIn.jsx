import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Button, Keyboard, Alert, LayoutAnimation, Types } from 'react-native'
import React from 'react'
import { useEffect, useState } from 'react';


import Icon from 'react-native-vector-icons/MaterialIcons'

export default function LogIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);//for password visibility
    const [keyboardOpen, setKeyboardOpen] = useState(false);//for keyboard visibility
    const [animation, setAnimation] = useState({});

    //login function
    const logInBtn = () => {
        //check email format, it should be email format
        if (!validateEmail(email)) {
            Alert.alert('Email is not valid');
            return;
        }

        //check password format, it should be password format
        if (password === '') {
            Alert.alert('Password is required');
            return;
        }
        //here we will call api to login user.. 

        Alert.alert('Login Success');//just for testing
    }
    //function to check email format
    const validateEmail = (email) => {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    //keyboard listener
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                LayoutAnimation.configureNext({
                    update: {
                        type: LayoutAnimation.Types.easeIn,
                        duration: 200,
                        useNativeDriver: true,
                    },
                });
                setAnimation({ marginBottom: 110 });
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',

            () => {
                LayoutAnimation.configureNext({
                    update: {
                        type: LayoutAnimation.Types.easeOut,
                        duration: 200,
                        useNativeDriver: true,
                    },
                });
                setAnimation({ marginBottom: 0 });
            }
        );
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        }

    }, []);



    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                {/* <Image
                    style={styles.image}
                    source={require('../images/Logo_New_Small.png')}
                /> */}
            </View>

            <View style={[styles.inputContainer, animation]}>


                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    keyboardType="email-address"

                />
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={text => setPassword(text)}

                    />
                    <TouchableOpacity
                        style={styles.passwordButton}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Icon
                            name={showPassword ? 'visibility' : 'visibility-off'}
                            size={20}
                            color='black'
                        />
                    </TouchableOpacity>

                </View>

                <TouchableOpacity onPress={logInBtn} style={styles.button}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.lineContainer}>
                <View style={styles.line} />
                <Text style={styles.orText}>or</Text>
                <View style={styles.line} />
            </View>


            <View style={styles.buttonContainer}>

                <Button
                    title="Sign Up"
                    onPress={() => alert('Sign Up')}
                    color="red"
                    style={styles.signUpButton}

                />
                {/* <Button
                    title="Forget Password"
                    onPress={() => alert('Forget Password')}
                /> */}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 20,
        flexDirection: 'column',
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',

        flex: 2,
    },
    buttonContainer: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    passwordContainer: {
        width: '100%',

        alignItems: 'center',
        justifyContent: 'center',

    },
    inputContainer: {
        flex: 2,
        width: '100%',
        alignItems: 'center',
        // justifyContent: 'center',




    },
    image: {
        width: 250,
        height: 250,
        resizeMode: 'contain',
    },
    input: {
        width: '100%',
        padding: 10,
        margin: 10,
        alignItems: 'left',
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: '#F5F5F5',
        borderColor: 'lightgray',
        shadowColor: '#000',


    },
    button: {
        width: '100%',
        padding: 10,
        // margin: 10,
        backgroundColor: '#F95F6B',

        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'lightgray',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 1,



    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },

    passwordButton: {
        position: 'absolute',
        right: 10,
        padding: 5,

        borderRadius: 5,
    },
    passwordButtonText: {
        color: 'black',
        fontWeight: 'bold',

    },
    lineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        alignSelf: 'center',
        marginVertical: 15
    },
    line: {
        flex: 1,
        height: 1.2,
        backgroundColor: '#979797',
        marginHorizontal: 10
    },
    orText: {
        paddingHorizontal: 10,
        color: '#979797'
    },
    signUpButton: {
        width: 60,
        height: 30,
        padding: 5,
        margin: 5,
    }
    
    

});