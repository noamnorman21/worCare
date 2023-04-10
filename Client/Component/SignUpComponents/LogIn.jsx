import { SafeAreaView, Dimensions, View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState, useContext } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { OrLine, NeedAccount } from './FooterLine'
import * as Linking from 'expo-linking';
import { useUserContext } from '../../UserContext';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function LogIn({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('User');
    const [isChecked, setChecked] = useState(false);
    const [showPassword, setShowPassword] = useState(false);//for password visibility
    const { logInContext } = useUserContext();

    // function to check from where the app was opened from a invintation link or not  
    const getInitialUrl = async () => {
        // check if the app was opened from a link
        const initialUrl = await Linking.getInitialURL();
        //example of the url: exp://l4rfr8w.anonymous.19000.exp.direct/--/InvitedFrom/123456789/Noam
        // Example of the real url: exp://l4rfr8w.anonymous.19000.exp.direct/
        if (initialUrl === null || initialUrl === undefined) {
            return;
        }
        else {
            // if the app was opened from a link, navigate to the correct screen
            const route = initialUrl.replace(/.*?:\/\//g, '');
            const routeName = route.split('/')[2];
            const patientId = route.split('/')[3];
            const userName = route.split('/')[4];
            if (routeName === 'InvitedFrom') {
                setUserType('Caregiver');
                navigation.navigate('Welcome', { patientId: patientId, userName: userName, userType: userType });
            }
        }
    }
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
        if (password === '') {
            Alert.alert('Password is required');
            return;
        }
        //check password format, it should be password format
        if (!validatePassword(password)) {
            Alert.alert('Password is not valid');
            return;
        }
        const userData = {
            Email: email,
            Password: password,
        }

        //call api to login user
        LoginUser(userData);
    }
    //function to save user email and password in async storage
    const _storeData = async () => {
        try {
            const userToAsync = {
                Email: email,
                Password: password,
            }
            const jsonValue = JSON.stringify(userToAsync)
            await AsyncStorage.setItem("user", jsonValue);
            console.log('user saved');
        } catch (error) {
            console.log(error);
        }
    }
    //function to toggle remember me checkbox
    const toggeleRememberMe = () => {
        if (isChecked) {
            setChecked(false);
        }
        else {
            setChecked(true);
        }
    }
    //function to login user
    const LoginUser = (userData) => {
        let userForLoginUrl = 'https://proj.ruppin.ac.il/cgroup94/test1/api/User/GetUserForLogin';
        fetch(userForLoginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                else {
                    return null;
                }
            })
            .then((json) => {
                if (json === null) {
                    Alert.alert('Login Failed');
                }
                else {
                    //save user email and password in async storage
                    if (isChecked) {
                        console.log('checked');
                        _storeData();
                    }
                    //save user data in context
                    const userContext = {
                        userId: json.userId,
                        FirstName: json.FirstName,
                        LastName: json.LastName,
                        Email: json.Email,
                        gender: json.gender,
                        phoneNum: json.phoneNum,
                        userUri: json.userUri,
                        userType: json.userType,
                    }
                    const jsonValue = JSON.stringify(userContext)
                    AsyncStorage.setItem('userData', jsonValue);
                    logInContext(userContext);
                    navigation.navigate('CustomHeader', { screen: "AppBarDown" });//navigate to home screen, we will add a necessary call to get user data from the server                                         
                }
            }
            )
            .catch((error) => {
                // Alert.alert('Login Failed');
                console.log(error);
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
        var re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return re.test(password);
    }
    //navigate to sign up screen
    const NavigateToSignUp = () => {
        navigation.navigate('SignUp', { userType: userType })
    }
    //navigate to forgot password screen
    const NavigateToForgotPassword = () => {
        navigation.navigate('ForgotPassword')
    }

    useEffect(() => {
        getInitialUrl();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                    <View>
                        <View style={styles.imageContainer}>
                            <Image style={styles.image} source={require('../../images/logo_New.png')} />
                        </View>
                        <View style={styles.inputContainer}>
                            {/* userName */}
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                value={email}
                                autoCapitalize='none'
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
                                <TouchableOpacity style={styles.passwordButton} onPress={() => setShowPassword(!showPassword)}>
                                    {/* Icon button For changing password input visibility */}
                                    <Icon name={showPassword ? 'visibility' : 'visibility-off'} size={20} color='#000' />
                                </TouchableOpacity>
                            </View>
                            {/* remmeber me check box  in one line*/}
                            <View style={styles.rememberMeContainer}>
                                <TouchableOpacity onPress={toggeleRememberMe}>
                                    {isChecked
                                        ?
                                        <MaterialCommunityIcons style={styles.rememberMeIcon} name="checkbox-intermediate" size={24} color="#979797" />
                                        :
                                        <MaterialCommunityIcons style={styles.rememberMeIcon} name="checkbox-blank-outline" size={24} color="#979797" />
                                    }
                                </TouchableOpacity>
                                <Text style={styles.rememberMe}>Remember Me</Text>
                                {/* forgot password button */}
                                <TouchableOpacity onPress={NavigateToForgotPassword}>
                                    <View style={styles.forgotPasswordContainer}>
                                        <Text style={styles.btnForgotPassword}>Forgot Password?</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {/* login button */}
                            <TouchableOpacity onPress={logInBtn} style={styles.button}>
                                <Text style={styles.buttonText}>Log In</Text>
                            </TouchableOpacity>

                            {/* footer line */}
                            <OrLine />
                            <NeedAccount NavigateToSignUp={NavigateToSignUp} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        flexDirection: 'column',
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1.5,
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
        borderWidth: 1.5,
        backgroundColor: '#FFFFFF',
        borderColor: '#E6EBF2',
        height: 54,
        fontFamily: 'Urbanist-Light',
        fontSize: 14
    },
    button: {
        width: SCREEN_WIDTH * 0.9,
        backgroundColor: '#548DFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        margin: 15,
        height: 54,
    },
    buttonText: {
        color: '#FFFFFF',
        fontFamily: 'Urbanist-Bold',
        fontSize: 18,
    },
    passwordButton: {
        position: 'absolute',
        right: SCREEN_WIDTH * 0.05,
        padding: 5,
        borderRadius: 5,
        marginLeft: 5,
    },
    passwordButtonText: {
        color: '#000',
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
        marginTop: SCREEN_HEIGHT * 0.01,
        marginBottom: SCREEN_WIDTH * 0.01,
    },
    forgotPasswordContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        marginLeft: SCREEN_WIDTH * 0.25,
    },
    rememberMeContainer: {
        width: SCREEN_WIDTH * 0.9,
        flexDirection: 'row',
    }
});