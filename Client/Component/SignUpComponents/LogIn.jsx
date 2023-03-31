import { SafeAreaView, Dimensions, View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Keyboard, Alert, LayoutAnimation } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState, useContext } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { OrLine, NeedAccount } from './FooterLine'
import * as Linking from 'expo-linking';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function LogIn({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);//for password visibility
    const [keyboardOpen, setKeyboardOpen] = useState(false);//for keyboard visibility
    const [animation, setAnimation] = useState({});
    const [userType, setUserType] = useState('User');
    const [isChecked, setChecked] = useState(false);
    let animationInProgress = false;

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
        console.log(userData);
        fetch(userForLoginUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
        .then(res => {
            if (res.ok) {
                return res.json()
            }
            else {
                Alert.alert("Email or Password inncorrect")
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
                        Id: json.Id,
                        FirstName: json.FirstName,
                        LastName: json.LastName,
                        Email: json.Email,
                        gender: json.gender,
                        phoneNum: json.phoneNum,
                        userUri: json.userUri,
                        userType: json.userType, 
                        Password: password                   
                    }
                    const jsonValue = JSON.stringify(userContext)                    
                    AsyncStorage.setItem('userData', jsonValue);                        
                    navigation.navigate('CustomHeader',{screen: "Home"});//navigate to home screen, we will add a necessary call to get user data from the server                                         
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
    const NavigateToForgotPassword = () => {
        navigation.navigate('ForgotPassword')
    }
    useEffect(() => {
        getInitialUrl();
        //keyboard listener for animation
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                if (!animationInProgress) {
                    animationInProgress = true;
                    LayoutAnimation.configureNext({
                        update: {
                            type: LayoutAnimation.Types.easeIn,
                            duration: 200,
                            useNativeDriver: true,
                        },
                    });
                    setAnimation({ marginBottom: Dimensions.get('window').height * 0.3 });
                    animationInProgress = false;
                }
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                if (!animationInProgress) {
                    animationInProgress = true;
                    LayoutAnimation.configureNext({
                        update: {
                            type: LayoutAnimation.Types.easeOut,
                            duration: 200,
                            useNativeDriver: true,
                        },
                    });
                    setAnimation({ marginBottom: 0 });
                    animationInProgress = false;
                }
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
        flexDirection: 'row'
    }
});