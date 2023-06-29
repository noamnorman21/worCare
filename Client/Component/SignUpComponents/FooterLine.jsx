import { React } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import * as Font from 'expo-font'

Font.loadAsync({
    'Urbanist': require('../../assets/fonts/Urbanist-Regular.ttf'),
    'Urbanist-Bold': require('../../assets/fonts/Urbanist-Bold.ttf'),
    'Urbanist-Light': require('../../assets/fonts/Urbanist-Light.ttf'),
    'Urbanist-Medium': require('../../assets/fonts/Urbanist-Medium.ttf'),
});

const OrLine = () => {

    return (
        <View style={styles.lineContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>Or</Text>
            <View style={styles.line} />
        </View>
    )
}
const NeedAccount = (props) => {
    {/* for log in screen */ }
    return (
        <View style={styles.buttonContainer}>
            <View style={styles.needAccountTXT}>
                <Text style={styles.signUpText}>Need an account ?</Text>
            </View>
            <View>
                <TouchableOpacity onPress={() => props.NavigateToSignUp()
                }>
                    <Text style={styles.signUpButtonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const HaveAccount = (props) => {
    {/* for sign up screen */ }
    return (
        <View style={styles.buttonContainer}>
            <View style={styles.needAccountTXT}>
                <Text style={styles.signUpText}>Already have an account ?</Text>
            </View>
            <View>
                <TouchableOpacity onPress={() => props.NavigateToLogIn()}>
                    <Text style={styles.signUpButtonText}>Log In</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const ReturnToLogin = (props) => {
    {/* for forgot password screen */ }
    return (
        <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => props.NavigateToLogIn()}>
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
        flex: 0.5,
        height: 1,
        backgroundColor: '#808080',
        marginHorizontal: 10,
    },
    orText: {
        paddingHorizontal: 10,
        color: '#808080',
        fontSize: 18,
        fontFamily: 'Urbanist-Medium',
    },
    needAccountTXT: {
        marginRight: Dimensions.get('screen').width * 0.03,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        flex: 0.3,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    signUpText: {
        flex: 1,
        fontFamily: 'Urbanist',
        fontSize: 16
    },
    signUpButtonText: {
        color: '#548DFF',
        fontSize: 16,
        fontFamily: 'Urbanist-Bold',
    },
    BackToLogIn: {
        color: '#548DFF',
        fontFamily: 'Urbanist-Bold',
        fontSize: 18
    },
})