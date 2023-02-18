import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import Holidays from '../../HelpComponents/Holidays'
import { HaveAccount, OrLine } from '../FooterLine'
import * as Font from 'expo-font';
Font.loadAsync({
  'Urbanist': require('../../../assets/fonts/Urbanist-Regular.ttf'),
  'Urbanist-Bold': require('../../../assets/fonts/Urbanist-Bold.ttf'),
  'Urbanist-Light': require('../../../assets/fonts/Urbanist-Light.ttf'),
  'Urbanist-Medium': require('../../../assets/fonts/Urbanist-Medium.ttf'),
  'Urbanist-SemiBold': require('../../../assets/fonts/Urbanist-SemiBold.ttf'),
});

const SCREEN_WIDTH = Dimensions.get('window').width;
export default function SignUpUserLVL4() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTxt}>Only Few More Details... </Text>
      </View>

      <View style={styles.holidaysContainer}>
        <Holidays />
      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.button}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>

      <OrLine />
      <HaveAccount />

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flex: 0.7,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  headerTxt: {
    marginTop: 50,
    fontFamily: 'Urbanist-Bold',
    fontSize: 28,
    color: '#000',
    textAlign: 'center',
  },
  holidaysContainer: {
    flex: 3,
  },
  btnContainer: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: SCREEN_WIDTH * 0.9,
    height: 50,
    backgroundColor: '#548DFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Urbanist-Bold',
    fontSize: 16,
  },
})