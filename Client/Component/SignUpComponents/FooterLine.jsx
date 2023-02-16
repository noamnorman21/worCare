import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import { useEffect } from 'react';
import useFonts from '../Fonts'



const OrLine = () => {
    const LoadFonts = async () => {
        await useFonts();
      };
    //load fonts on mount
      useEffect(() => {
        LoadFonts();
      }, []);
    
    return (
        <View style={styles.lineContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>Or</Text>
            <View style={styles.line} />
        </View>
    )
}
const NeedAccount = () => {
    const LoadFonts = async () => {
        await useFonts();
      };
    //load fonts on mount
      useEffect(() => {
        LoadFonts();
      }, []);
    {/* for log in screen */ }
    const navigation= useNavigation();
    return (
        <View style={styles.buttonContainer}>
            <View style={styles.needAccountTXT}>
                <Text style={styles.signUpText}>Need an account ?</Text>
            </View>
            <View>
                <TouchableOpacity onPress={() =>navigation.navigate('SignUp')        
            }>      
                    <Text style={styles.signUpButtonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const HaveAccount = () => {
    const LoadFonts = async () => {
        await useFonts();
      };
    //load fonts on mount
      useEffect(() => {
        LoadFonts();
      }, []);
    
    {/* for sign up screen */ }
    const navigation= useNavigation();
    return (
        <View style={styles.buttonContainer}>
            <View style={styles.needAccountTXT}>
                <Text style={styles.signUpText}>Have an account ?</Text>
            </View>
            <View>
                <TouchableOpacity onPress={() => navigation.navigate('LogIn')}>
                    <Text style={styles.signUpButtonText}>Log In</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const ReturnToLogin = () => {
    {/* for forgot password screen */ }
    return (
        <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => alert('Navigate To Log In')}>
                <Text style={styles.BackToLogIn}>Back to Log In</Text>
            </TouchableOpacity>
        </View>
    )
}

export { OrLine, NeedAccount, HaveAccount, ReturnToLogin }

const styles = StyleSheet.create({
    lineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        alignSelf: 'center',
        marginVertical: 30,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#808080',
        marginHorizontal: 10,
    },
    orText: {
        paddingHorizontal: 10,
        color: '#808080',
        fontSize: 18,
        fontWeight: '600',
    },
    needAccountTXT: {
        marginRight: Dimensions.get('screen').width * 0.03,
        fontWeight: '00',
  
    },
    buttonContainer: {
        flex: 0.3,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    signUpText: {
        fontSize: 16,
        flex: 1, 
        fontFamily: 'Urbanist-Regular',
        fontWeight: '500',       
    
    },
    signUpButtonText: {
        color: '#548DFF',
        fontSize: 16,
        fontWeight: '500',
        fontFamily: 'Urbanist-Regular',
       
    },
    BackToLogIn: {
        color: '#548DFF',
        fontSize: 18,
        fontWeight: '700',
        fontFamily: 'Urbanist-Regular',
    },
})