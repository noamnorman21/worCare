import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native'
import { useState, useEffect } from 'react';
import { OrLine, HaveAccount } from './FooterLine';

export default function SignUpLvl3({ navigation, route }) {
  const userData = route.params.userData;
  const [role, setRole] = useState(''); // Caregiver or Patient's Family Member

  const NavigateToNextLvl = () => {
    if (role === 'Caregiver') {
      navigation.navigate('SignUpCaregiverLVL4', { userData: userData, language: route.params.language, holidaysType: route.params.holidaysType, country: route.params.country })
    } else if (role === 'Patient’s Family Member') {
      navigation.navigate('SignUpUserLVL4', { userData: userData, language: route.params.language, holidaysType: route.params.holidaysType })
    }
    else {
      Alert.alert('Please select your role')
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
    marginVertical: 10,
    height: 54,
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
    height: 100,
  },
  titleRole: {
    paddingLeft: 15,
    marginBottom: 5,
    fontSize: 20,
    fontFamily: 'Urbanist-Bold',
    color: '#548DFF',
  },
  txtRole: {
    paddingLeft: 15,
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