import { SafeAreaView, Dimensions, View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Button, Keyboard, Alert, LayoutAnimation, Types } from 'react-native'
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
                setAnimation({ marginBottom: Dimensions.get('window').height * 0.25 });
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
                    source={require('../images/logo_New.png')}
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
                />
                <View style={styles.passwordContainer}>
                    {/* password */}
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={text => setPassword(text)}
                    />
                    {/* password visibility button */}
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
                {/* remmeber me check box  in one line*/}
                <View style={{width:Dimensions.get('screen').width*0.85, flexDirection: 'row' }}>
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
                    <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                        {/* forgot password button */}
                        <TouchableOpacity onPress={() => alert('Forgot Password')}>
                            <Text style={styles.btnForgotPassword}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* login button */}
                <TouchableOpacity onPress={logInBtn} style={styles.button}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.lineContainer}>
                <View style={styles.line} />
                <Text style={styles.orText}>Or</Text>
                <View style={styles.line} />
            </View>

            <View style={styles.buttonContainer && {flexDirection:'column' ,flex:1}}>
                <Text style={styles.signUpText && { }}>Need an account?</Text>
                <Button
                    title="Sign Up"
                    onPress={() => alert('Sign Up')}
                    color="#548DFF"
                    style={styles.signUpButton}
                />
            </View>
        </SafeAreaView>
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
        flex: 2.5,
    },
    buttonContainer: {
        flex: 1,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
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
    },
    image: {
        width: Dimensions.get('window').width * 0.85,
        height: Dimensions.get('window').width * 0.85,
        resizeMode: 'contain',
    },
    input: {
        width: Dimensions.get('window').width * 0.9,
        padding: 10,
        margin: 10,
        alignItems: 'left',
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: '#F5F5F5',
        borderColor: 'lightgray',
        shadowColor: '#000',
        height: 54,
    },
    button: {
        width: Dimensions.get('window').width * 0.9,
        padding: 10,
        backgroundColor: '#548DFF',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'lightgray',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 1,
        margin: 10,
        height: 54,
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
        marginLeft: 5,
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
        height: 0.3,
        backgroundColor: '#979797D9',
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
    },
    btnForgotPassword: {
        color: '#548DFF',
        fontSize: 13,
        marginLeft: Dimensions.get('screen').width * 0.175,
        marginTop: 10,
        marginBottom: 10,
    },
    rememberMe: {
        color: '#979797',
        fontSize: 13,
        marginTop: 10,
        marginBottom: 10,
    },
    rememberMeIcon: {
        marginTop: 10,
        marginBottom: 10,
    },
    signUpText: {
        fontSize: 13,
        marginRight: 5,
    },
});