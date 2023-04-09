import { SafeAreaView, View, TouchableOpacity, Text, StyleSheet, TextInput, Dimensions, Alert } from 'react-native'
import { React, useState, useRef, useEffect } from 'react'
import { OrLine, ReturnToLogin } from '../SignUpComponents/FooterLine';
import emailjs from '@emailjs/browser';

const CODE_LENGTH = 5;

const GenerateCode = () => {
    let codeTemp = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 5; i++) {
        codeTemp += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return codeTemp;  //send the code to the user's email address
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
                Alert.alert('Code sent!', 'Check your email for the verification code.');
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

export default function ForgotPasswordLvl2({ navigation, route }) {
    const userCode = route.params.userCode; //save the code that was sent to the user's email address       
    const email = route.params.email; // save the email address that the user entered
    const nameUser = route.params.userName; //save the user's name

    const [code, setCode] = useState(''); //code that the user will enter
    const inputs = useRef([]); //array of inputs
    useEffect(() => {
        inputs.current[0].focus();
        console.log(userCode);//temaporary alert to show the code,until we will send it to the user's email address
    }, []);
    const handleInput = (index, value) => {
        setCode(prevState => {
            return prevState.slice(0, index) + value + prevState.slice(index + 1);
        });
        if (value !== '') {
            if (index < CODE_LENGTH - 1) {
                inputs.current[index + 1].focus();
            } else {
                inputs.current[index].blur();
            }
        }
    };

    const NavigateToLogIn = () => {
        navigation.navigate('LogIn');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Enter Verification Code</Text>
                {/* <Text>We have sent a verification code to your email address.</Text> */}
                <Text style={styles.smallHeader}>Enter the code that we have sent to continue</Text>
            </View>
            <View style={styles.inputContainer}>
                {[...Array(CODE_LENGTH)].map((_, i) => (
                    <TextInput
                        key={i}
                        style={styles.input}
                        maxLength={1}
                        keyboardType="number"
                        returnKeyType="next"
                        onChangeText={value => handleInput(i, value)}
                        value={code[i] || ''}
                        ref={ref => inputs.current[i] = ref}
                    />
                ))}
            </View>
            <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.button}
                    onPress={() => {
                        if (code === userCode) {
                            navigation.navigate('CreateNewPassword', { email: email });
                        }
                        else {
                            Alert.alert('Wrong code', 'Please enter the correct code');
                        }
                    }}
                >
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={GenerateCode(email, nameUser, userCode)}>
                    <Text style={styles.smallBtn}>Resend Code</Text>
                </TouchableOpacity>
            </View>
            <OrLine />
            <ReturnToLogin NavigateToLogIn={NavigateToLogIn} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 2.5,
    },
    header: {
        fontSize: 30,
        fontFamily: 'Urbanist-Bold',
        color: '#000',
        textAlign: 'center',
        marginBottom: 20,
    },
    smallHeader: {
        fontSize: 15,
        textAlign: 'center',
        fontFamily: 'Urbanist-Medium',
    },
    input: {
        borderWidth: 1.5,
        borderRadius: 16,
        marginHorizontal: 5,
        textAlign: 'center',
        backgroundColor: '#FFFFFF',
        borderColor: '#E6EBF2',
        shadowColor: '#000',
        height: 54,
        width: 54,
        fontFamily: 'Urbanist',
        fontSize: 14,
        padding: 16,
        marginLeft: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#548DFF',
        height: 54,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        width: Dimensions.get('window').width * 0.85,
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'Urbanist-Bold',
    },
    btnContainer: {
        flex: 2.5,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Dimensions.get('window').height * 0.05,
    },
    smallBtn: {
        color: '#548DFF',
        fontSize: 18,
        fontFamily: 'Urbanist-Bold',
        marginTop: Dimensions.get('window').height * 0.025,
    }

});