import { SafeAreaView, Dimensions, View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Button, Keyboard, Alert, LayoutAnimation, Types } from 'react-native'
import React from 'react'
import { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { OrLine, NeedAccount } from './FooterLine'
import * as Font from 'expo-font';

Font.loadAsync({
    'Urbanist': require('../../assets/fonts/Urbanist-Regular.ttf'),
    'Urbanist-Bold': require('../../assets/fonts/Urbanist-Bold.ttf'),
    'Urbanist-Light': require('../../assets/fonts/Urbanist-Light.ttf'),
    'Urbanist-Medium': require('../../assets/fonts/Urbanist-Medium.ttf'),
});

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function LogIn({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);//for password visibility
    const [keyboardOpen, setKeyboardOpen] = useState(false);//for keyboard visibility
    const [animation, setAnimation] = useState({});

    //login function
    const logInBtn = () => {
        // check email is empty or not
        if (email === '') {
            Alert.alert('Email is required');
            return;
        }
        //check email format
        if (!validateEmail(email)) {
            Alert.alert('Email is not valid');
            return;
        }
        //check password format, it should be password format
        if (!validatePassword(password)) {
            Alert.alert('Password is not valid');
            return;
        }
        if (password === '') {
            Alert.alert('Password is required');
            return;
        }

        const userData = {
            email: email,
            password: password,
        }

        //call api to login user
        LoginUser(userData);
    }
    //function to login user
    const LoginUser = (userData) => {
        fetch('', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userData }),
        })
            .then((response) => response.json())
            .then((json) => {
                if (json.status === 'success') {
                    Alert.alert('Login Successful');
                } else {
                    Alert.alert('Login Failed');
                }
            }
            )
            .catch((error) => {
                Alert.alert('Login Failed');
            }
            );
    }
    //function to check email format
    const validateEmail = (email) => {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
    //function to check password format
    const validatePassword = (password) => {
        var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return re.test(password);
    }

    //navigate to sign up screen
    const NavigateToSignUp = () => {
        navigation.navigate('SignUpLimitations')
    }

    const NavigateToForgotPassword = () => {
        navigation.navigate('ForgotPassword')
    }

    //keyboard listener for animation
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
                setAnimation({ marginBottom: Dimensions.get('window').height * 0.3 });
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
        <SafeAreaView style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    style={styles.image}
                    source={require('../../images/logo_New.png')}
                />
            </View>

            <View style={[styles.inputContainer, animation]}>
                {/* userName */}
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    keyboardType="email-address"
                    autoCorrect={false}
                />
                <View style={styles.passwordContainer}>
                    {/* password */}
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry={!showPassword}
                        value={password}
                        autoCapitalize='none'
                        autoCorrect={false}
                        keyboardType='ascii-capable'
                        onChangeText={text => setPassword(text)}
                    />
                    {/* password visibility button */}
                    <TouchableOpacity
                        style={styles.passwordButton}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        {/* Icon button For changing password input visibility */}
                        <Icon
                            name={showPassword ? 'visibility' : 'visibility-off'}
                            size={20}
                            color='#979797'
                        />
                    </TouchableOpacity>
                </View>
                {/* remmeber me check box  in one line*/}
                <View style={styles.rememberMeContainer}>

                    {/* remember me check box */}
                    <TouchableOpacity onPress={() => alert('Remember Me')}>
                        <Icon
                            name={'check-box-outline-blank'}
                            size={20}
                            color='#979797'
                            style={styles.rememberMeIcon}
                        />
                    </TouchableOpacity>
                    <Text style={styles.rememberMe}>Remember Me</Text>

                    {/* forgot password button */}
                    <View style={styles.forgotPasswordContainer}>
                        {/* forgot password button */}
                        <TouchableOpacity onPress={NavigateToForgotPassword}>
                            <Text style={styles.btnForgotPassword}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* login button */}
                <TouchableOpacity onPress={logInBtn} style={styles.button}>
                    <Text style={styles.buttonText}>Log In</Text>
                </TouchableOpacity>
            </View>
            {/* footer line */}
            <OrLine />
            <NeedAccount NavigateToSignUp={NavigateToSignUp} />
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
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 2,
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
    },
    image: {
        width: SCREEN_WIDTH * 0.85,
        height: SCREEN_WIDTH * 0.85,
        resizeMode: 'contain',
    },
    input: {
        width: SCREEN_WIDTH * 0.9,
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
        fontSize: 14
    },
    button: {
        width: SCREEN_WIDTH * 0.9,
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
        fontFamily: 'Urbanist-Bold',
        fontSize: 18,
    },
    passwordButton: {
        position: 'absolute',
        right: SCREEN_WIDTH * 0.1,
        padding: 5,
        borderRadius: 5,
        marginLeft: 5,
    },
    passwordButtonText: {
        color: 'black',
        fontFamily: 'Urbanist-Bold',
        fontSize: 14
    },
    btnForgotPassword: {
        color: '#548DFF',
        fontSize: 14,
        fontFamily: 'Urbanist',
        marginTop: 10,
        marginBottom: 10,
    },
    rememberMe: {
        color: '#979797',
        fontSize: 14,
        fontFamily: 'Urbanist',
        marginTop: 10,
        marginBottom: 10,
    },
    rememberMeIcon: {
        marginTop: 10,
        marginBottom: 10,
    },
    forgotPasswordContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        marginLeft: SCREEN_WIDTH * 0.275,
    },
    rememberMeContainer: {
        width: SCREEN_WIDTH * 0.9,
        flexDirection: 'row'
    }
});