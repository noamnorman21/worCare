import { View, Text, SafeAreaView, StyleSheet, Dimensions, Image, TouchableOpacity, Alert } from 'react-native'
import { useState } from 'react';
import { OrLine, HaveAccount } from './FooterLine';
import * as Font from 'expo-font';
Font.loadAsync({
  'Urbanist': require('../../assets/fonts/Urbanist-Regular.ttf'),
  'Urbanist-Bold': require('../../assets/fonts/Urbanist-Bold.ttf'),
  'Urbanist-Light': require('../../assets/fonts/Urbanist-Light.ttf'),
  'Urbanist-Medium': require('../../assets/fonts/Urbanist-Medium.ttf'),
  'Urbanist-SemiBold': require('../../assets/fonts/Urbanist-SemiBold.ttf'),
});

export default function SignUpLvl2({ navigation, route }) {
  const userData = route.params.user;
  const [userGender, setUserGender] = useState('');
  // Check if userGender is empty
  const NavigateToSignUpLvl3 = () => {
    if (userGender === '') {
      Alert.alert('Please Select a gender');
      return;
    }
    navigation.navigate('SignUpLvl3')     
  }

  const sendDataToDB = () => {
    const newUserToDB = {
      FirstName: userData.firstName,
      LastName: userData.lastName,
      Email: userData.email,
      Password: userData.password,
      gender: userGender,
      phoneNum: userData.phoneNum,
      userUri: userData.imagePath
    }
    console.log(newUserToDB.FirstName);

    console.log(newUserToDB.userUri);
    // fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/User/InsertUser', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json; charset=UTF-8',
    //   },
    //   body: JSON.stringify(newUserToDB),
    // })
    //   .then((response) => response.json())
    //   .then((json) => {
    //     console.log(json);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   }
    //   );
    // NavigateToSignUpLvl3();

  }

  const NavigateToLogIn = () => {
    navigation.navigate('LogIn')
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>
        We love to know you...
      </Text>
      <Text style={styles.smallHeader}>
        It will take only 5 minutes
      </Text>

      <View>
        <Text style={styles.TitleGender}> I am a...</Text>
      </View>

      <View style={styles.GenderContainer}>
        <TouchableOpacity
          style={[styles.GenderButton, userGender === 'M' && styles.selectedGender]}
          onPress={() => setUserGender('M')}
        >
          <Image
            source={require('../../images/hero.png')}
            style={styles.imgGender}
          />
        </TouchableOpacity>
        <View style={{ margin: 20 }}></View>
        <TouchableOpacity
          style={[styles.GenderButton, userGender === 'F' && styles.selectedGender]}
          onPress={() => setUserGender('F')}
        >
          <Image
            source={require('../../images/superhero.png')}
            style={styles.imgGender}
          />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 2 }}>
        <TouchableOpacity
          style={{ marginBottom: 40 }}
          onPress={() => setUserGender('O')}
        >
          <Text style={[styles.txtOther, userGender === 'O' && styles.selectedGenderTXT]}>Prefer not to say...</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}
          onPress={sendDataToDB}
        >
          <Text style={styles.buttonText}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
      <OrLine />
      <HaveAccount NavigateToLogIn={NavigateToLogIn} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    margin: 10,
    marginTop: 50,
    fontFamily: 'Urbanist-Bold',
  },
  smallHeader: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Urbanist-SemiBold',
  },
  TitleGender: {
    marginTop: 50,
    fontSize: 34,
    textAlign: 'center',
    fontFamily: 'Urbanist-Bold',
    color: '#548DFF',
  },
  GenderContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 50,
    flex: 2,
  },
  GenderButton: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
  },
  imgGender: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  selectedGender: {
    borderWidth: 1,
    borderColor: 'lightgray',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    backgroundColor: '#F5F5F5',
  },
  txtOther: {
    fontSize: 22,
    textAlign: 'center',
    fontFamily: 'Urbanist-SemiBold',
    color: '#626262',
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
  selectedGenderTXT: {
    color: '#548DFF',
    textDecorationLine: 'underline',
    fontFamily: 'Urbanist-Bold',
  }
});