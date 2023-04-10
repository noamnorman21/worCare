import { SafeAreaView, View, Text, TextInput, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { OrLine, ReturnToLogin } from '../SignUpComponents/FooterLine';
import emailjs from '@emailjs/browser';
// import { SendEmail } from '../HelpComponents/UserContext';

const GenerateCode = () => {
    let codeTemp = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 5; i++) {
        codeTemp += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return codeTemp;
}

export default function ForgotPassword({ navigation }) {
    const [email, setEmail] = useState('');

    const NavigateToLogIn = () => {
        navigation.navigate('LogIn')
    }

    const SendEmail = (senderEmail, nameUser, codeTemp) => {
        if (senderEmail) {
            // Set the template parameters for the email
            const templateParams = {
                senderEmail: senderEmail,
                userName: nameUser,
                code: codeTemp,
            };

            // Send the email using EmailJS
            emailjs.send('service_cg2lqzg', 'template_pqsos33', templateParams, 'amgCa1UEu2kFg8DfI')
                .then(result => {
                    console.log(result);
                    Alert.alert('Code sent!', 'Check your email for the verification code.',
                        [
                            {
                                text: 'OK', onPress: () => {
                                    navigation.navigate('ForgotPasswordLvl2', { email: senderEmail, userName: nameUser, userCode: codeTemp })
                                }
                            }
                        ]
                    );
                })
                .catch(error => {
                    console.log(error);
                    Alert.alert('Error!', 'An error occurred while sending the verification code.');

                });
        }
        else {
            Alert.alert('Error!', 'Please enter your email address.');
        }
    };

    const getData = () => {
        let userDto = {
            Email: email,
        }
        fetch(`https://proj.ruppin.ac.il/cgroup94/test1/api/User/GetEmailForgotPassword`, {
            method: 'POST',
            body: JSON.stringify(userDto),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
        })
            .then(res => {
                if (res.ok) {
                    return res.json()
                }
                else {
                    Alert.alert("Email not found")
                }
            })
            .then(data => {
                if (data != null) {
                    const userCode = GenerateCode();
                    SendEmail(email, data["FirstName"], userCode);
                }
            })
            .catch((error) => {
                console.log("err=", error);
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
                    placeholder="Enter your email address..."
                    keyboardType="email-address"
                    autoCorrect={false}
                    autoCapitalize="none"
                    onChangeText={(email) => setEmail(email)}
                />
                {/* Submit And go to next lvl screen - verification code */}
                <TouchableOpacity style={styles.button} onPress={getData} >
                    <Text style={styles.buttonText}>Continue</Text>
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
        backgroundColor: '#FFFFFF',
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
        color: '#000',
        margin: Dimensions.get('screen').width * 0.05,
        fontSize: 15,
        fontFamily: 'Urbanist',
        lineHeight: 18,
        paddingTop: 15,
        paddingBottom: 15,
    },
    input: {
        width: Dimensions.get('window').width * 0.9,
        padding: 10,
        margin: 10,
        alignItems: 'flex-left',
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#E6EBF2',
        height: 54,
        fontFamily: 'Urbanist-Light',
        fontSize: 16,
        color: '#9E9E9E'
    },
    button: {
        width: Dimensions.get('window').width * 0.9,
        backgroundColor: '#548DFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
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