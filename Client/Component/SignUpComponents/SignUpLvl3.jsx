import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import { useState } from 'react';
import { OrLine, HaveAccount } from './FooterLine';
import * as Font from 'expo-font';
Font.loadAsync({
  'Urbanist': require('../../assets/fonts/Urbanist-Regular.ttf'),
  'Urbanist-Bold': require('../../assets/fonts/Urbanist-Bold.ttf'),
  'Urbanist-Light': require('../../assets/fonts/Urbanist-Light.ttf'),
  'Urbanist-Medium': require('../../assets/fonts/Urbanist-Medium.ttf'),
});

export default function SignUpLvl3({ navigation, route }) {
  const userId = route.params.userId;
  const [role, setRole] = useState(''); // Caregiver or Patient's Family Member

  const NavigateToNextLvl = () => {
    if (role === 'Caregiver') {
     navigation.navigate('SignUpCaregiverLVL4', { userId: userId })

    } else if (role === 'Patient’s Family Member') {
      navigation.navigate('SignUpUserLVL4')
    }
    else {
      alert('Please select your role')
    }
  }

  const NavigateToLogIn = () => {
    navigation.navigate('LogIn')
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, marginTop: 50 }}>
        <Text style={styles.Title}> I am a...</Text>
      </View>
      <View style={{ flex: 2 }}>
        <TouchableOpacity
          style={[styles.box, role === 'Caregiver' && styles.selectedBox]}
          onPress={() => setRole('Caregiver')}
        >
          <Text style={styles.titleRole}>Caregiver</Text>
          <Text style={styles.txtRole}>I will be providing care for a patient.</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.box, role === 'Patient’s Family Member' && styles.selectedBox]}
          onPress={() => setRole('Patient’s Family Member')}
        >
          <Text style={styles.titleRole}>Patient’s Family Member</Text>
          <Text style={styles.txtRole}>I will be managing their care needs.</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={NavigateToNextLvl}
      >
        <Text style={styles.buttonText}>
          Continue
        </Text>
      </TouchableOpacity>
      <OrLine />
      <HaveAccount NavigateToLogIn={NavigateToLogIn} />
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
  button: {
    width: Dimensions.get('window').width * 0.9,
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
    margin: 7,
    height: 45,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Urbanist-Bold',
  },
  Title: {
    fontSize: 34,
    textAlign: 'center',
    fontFamily: 'Urbanist-Bold',
    color: '#000',
  },
  box: {
    width: Dimensions.get('window').width * 0.9,
    backgroundColor: '#FFF',
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
    height: 75,
  },
  titleRole: {
    marginLeft: 15,
    fontSize: 20,
    fontFamily: 'Urbanist-Bold',
    color: '#548DFF',
  },
  txtRole: {
    marginLeft: 15,
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
    color: '#9E9E9E',
  },
  selectedBox: {
    borderWidth: 2,
    borderColor: '#548DFF',
    shadowColor: '#548DFF',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.5,
  },
});