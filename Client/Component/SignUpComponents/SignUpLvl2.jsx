import { View, Text, SafeAreaView, StyleSheet, Dimensions, Image, TouchableOpacity, Alert } from 'react-native'
import { useState, useEffect, useCallback } from 'react';
import { OrLine, HaveAccount } from './FooterLine';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../../config/firebase';
import { useIsFocused } from '@react-navigation/native';

export default function SignUpLvl2({ navigation, route }) {
  const userData = route.params.user;
  const [userGender, setUserGender] = useState('');
  const [imageFireBaseUrl, setImageFireBaseUrl] = useState('');
  // Fetch GET 
  const [language, setLanguage] = useState([]);
  const [country, setCountry] = useState([]);
  const [holidaysType, setHolidaysType] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getData();
    }
  }, [isFocused]);

  const getData = async () => {
    let urlforLanguages = 'https://proj.ruppin.ac.il/cgroup94/test1/api/LanguageCountry/GetAllLanguages';
    let urlforCountries = 'https://proj.ruppin.ac.il/cgroup94/test1/api/LanguageCountry/GetAllCountries';
    let calendarUrl = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Calendars/GetAllCalendars';
    fetch(calendarUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json; charset=UTF-8', },
    })
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        else {
          console.log("not found")
        }
      })
      .then(data => {
        if (data != null) {
          for (let i = 0; i < data.length; i++) {
            holidaysType.push({
              id: data[i].calendarNum,
              label: data[i].CalendarName,
            })
          }
        }
      })
      .catch((error) => {
        console.log("err=", error);
      });
    fetch(urlforCountries, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    })
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        else {
          console.log("not found")
        }
      })
      .then(data => {
        if (data != null) {
          for (let i = 0; i < data.length; i++) {
            country.push({
              label: data[i],
              value: data[i],
            })
          }
        }
      })
      .catch((error) => {
        console.log("err=", error);
      });
    fetch(urlforLanguages, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    })
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        else {
          console.log("not found")
        }
      })
      .then(data => {
        if (data != null) {
          for (let i = 0; i < data.length; i++) {
            language.push({
              label: data[i].LanguageName_Origin,
              value: data[i].LanguageName_En,
            })
          }
        }
      })
      .catch((error) => {
        console.log("err=", error);
      });
  }

  // Send the image to firebase storage and get the image url
  const sendToFirebase = async (image) => {
    if (userGender === '') {
      Alert.alert('Please Select a gender');
      return;
    }
    // if the user didn't upload an image, we will use the default image
    if (image === null) {
      //זה תמונה מכוערת -נועם תחליף אותה
      let defultImage = "https://png.pngtree.com/element_our/20200610/ourmid/pngtree-character-default-avatar-image_2237203.jpg"
      sendDataToNextLVL(defultImage);
    }
    const filename = image.substring(image.lastIndexOf('/') + 1);
    const storageRef = ref(storage, "images/" + filename);
    const blob = await fetch(image).then(response => response.blob());
    try {
      const uploadTask = uploadBytesResumable(storageRef, blob);
      uploadTask.on('state_changed',
        snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% complete`);
        },
        error => {
          console.error(error);
          Alert.alert('Upload Error', 'Sorry, there was an error uploading your image. Please try again later.');
        },
        () => {
          getDownloadURL(storageRef).then(downloadURL => {
            console.log('File available at', downloadURL);
            setImageFireBaseUrl(downloadURL);
            sendDataToNextLVL(downloadURL);
          });
        }
      );
    } catch (error) {
      console.error(error);
      Alert.alert('Upload Error', 'Sorry, there was an error uploading your image. Please try again later.');
      sendDataToNextLVL();
    }
  }

  const sendDataToNextLVL = (downloadURL) => {
    //send the image to firebase storage, we will get the image url and send it to the DB
    //create the user object to send to the DB, do it after we get the image url
    const newUserToDB = {
      FirstName: userData.firstName,
      LastName: userData.lastName,
      Email: userData.email,
      Password: userData.password,
      gender: userGender,
      phoneNum: userData.phoneNum,
      userUri: downloadURL,
    }
    const userType = route.params.userType;
    const patientId = route.params.patientId;
    console.log(route.params.userType)

    if (userType == 'User') {
      navigation.navigate('SignUpLvl3', { userData: newUserToDB, holidaysType: holidaysType, language: language, country: country })
    }
    else if (userType === 'Caregiver') {
      navigation.navigate('SignUpCaregiverLVL4', { userData: newUserToDB, patientId: patientId, holidaysType: holidaysType, language: language, country: country })
    }

  }
  const NavigateToLogIn = () => {
    navigation.navigate('LogIn')
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>We love to know you...</Text>
      <Text style={styles.smallHeader}>It will take only 5 minutes</Text>
      <View><Text style={styles.TitleGender}> I am a...</Text></View>
      <View style={styles.GenderContainer}>
        <TouchableOpacity style={[styles.GenderButton, userGender === 'M' && styles.selectedGender]} onPress={() => setUserGender('M')}>
          <Image source={require('../../images/hero.png')} style={styles.imgGender} />
        </TouchableOpacity>
        <View style={{ margin: 20 }}></View>
        <TouchableOpacity style={[styles.GenderButton, userGender === 'F' && styles.selectedGender]} onPress={() => setUserGender('F')}>
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
          onPress={() => sendToFirebase(userData.imagePath)}
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
    marginVertical: 10,
    height: 54,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Urbanist-Bold',
  },
  selectedGenderTXT: {
    color: '#548DFF',
    textDecorationLine: 'underline',
    fontFamily: 'Urbanist-Bold',
  }
});