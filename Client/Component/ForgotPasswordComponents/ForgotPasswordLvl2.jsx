import { SafeAreaView, View, TouchableOpacity, Text, StyleSheet, TextInput, Dimensions, Alert } from 'react-native'
import { React, useState, useRef, useEffect } from 'react'
import * as Font from 'expo-font';
import { OrLine, ReturnToLogin } from '../SignUpComponents/FooterLine';

const CODE_LENGTH = 5;
export default function ForgotPasswordLvl2({ navigation, route }) {
    const userCode = route.params.userCode; //save the code that was sent to the user's email address   
    Alert.alert(userCode);//temaporary alert to show the code,until we will send it to the user's email address

    Font.loadAsync({
        'Urbanist': require('../../assets/fonts/Urbanist-Regular.ttf'),
        'Urbanist-Bold': require('../../assets/fonts/Urbanist-Bold.ttf'),
        'Urbanist-Light': require('../../assets/fonts/Urbanist-Light.ttf'),
        'Urbanist-Medium': require('../../assets/fonts/Urbanist-Medium.ttf'),
    });
    
    const [code, setCode] = useState('');
    const inputs = useRef([]);

    const handleInput = (index, value) => {
        setCode(prevState => {
            return prevState.slice(0, index) + value + prevState.slice(index + 1);
        });
        if (value !== '') {
            inputs.current[index + 1].focus();
        }
    };

    const generateNewCode = () => {
        let codeTemp = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < 5; i++) {
            codeTemp += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        //in the future, here we will send the code to the user's email address
        navigation.navigate('ForgotPasswordLvl2', { userCode: codeTemp });
    }

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
                        userCode?.trim() === code ? navigation.navigate('CreateNewPassword') : Alert.alert('Wrong code');
                    }}
                >
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={generateNewCode}>
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