import { View, Text, SafeAreaView, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { useState, useEffect } from 'react'
import * as Font from 'expo-font';
import Holidays from '../../HelpComponents/Holidays';
Font.loadAsync({
  'Urbanist': require('../../../assets/fonts/Urbanist-Regular.ttf'),
  'Urbanist-Bold': require('../../../assets/fonts/Urbanist-Bold.ttf'),
  'Urbanist-Light': require('../../../assets/fonts/Urbanist-Light.ttf'),
  'Urbanist-Medium': require('../../../assets/fonts/Urbanist-Medium.ttf'),
  'Urbanist-SemiBold': require('../../../assets/fonts/Urbanist-SemiBold.ttf'),
});

const SCREEN_WIDTH = Dimensions.get('window').width;
export default function SignUpCaregiverLVL5({ navigation, route }, props) {
  const [selectedHolidays, setSelectedHolidays] = useState([]);
  const newForeignUserData = route.params.newForeignUserData;
  const newUser = route.params.newUser;
  const holidaysType = route.params.holidaysType;

  const createUserInDB = () => {
    newUser.Calendars = selectedHolidays; //selectedHolidays is the array of the selected holidays,use them in data base with stored procedure "InsertCalendarForUser"    
    fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/User/InsertUser', { //send the user data to the DB
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => response.json())
      .then((json) => {
        //save the id of the new user that we got from the DB 
        newForeignUserData.Id = json; //save the id of the new user that we got from the DB
        createForeignUserInDB() //create the foreign user in the DB
      })
      .catch((error) => {
        console.error(error);
      }
      );
  };

  const createForeignUserInDB = () => {
    console.log(newForeignUserData);
    fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/ForeignUser/InsertForeignUser', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newForeignUserData),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        Alert.alert("Great Job !", "You can login now", [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate('LogIn');
            }
          }
        ]);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const isItemSelected = (arr) => {
    setSelectedHolidays(arr); //arr is the array of the selected holidays
    console.log("selectedHolidays=", selectedHolidays);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTxt}>Great Job !</Text>
      </View>
      <Holidays holidaysType={holidaysType} sendHolidays={isItemSelected} />
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={createUserInDB}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <View style={styles.legalTextContainer}>
          <Text style={styles.legalText}>
            By signing up {" "}
            <Text style={styles.legalTextLink}>worCare</Text>
            <Text style={styles.legalText}>, you agree to our </Text>
            <Text style={styles.legalTextLink}>Terms Of Service</Text>{" "}
            <Text style={styles.legalText}>and</Text>{" "}
            <Text style={styles.legalTextLink}>Privacy Policy</Text>{" "}
          </Text>
        </View>
      </View>

    </SafeAreaView >
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    paddingTop: 30,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  headerTxt: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 30,
    color: '#000',
    textAlign: 'center',
  },
  headerSmallTxt: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
    marginVertical: 10,
  },
  line: {
    borderBottomColor: '#808080',
    borderBottomWidth: 0.5,
    marginVertical: 20,
  },
  bodyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  itemBox: {
    width: SCREEN_WIDTH * 0.45,
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E6EBF2',
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  btnContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: 20,
  },
  button: {
    width: SCREEN_WIDTH * 0.9,
    height: 54,
    backgroundColor: '#548DFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedItem: {
    borderColor: "#548DFF",
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Urbanist-Bold',
    fontSize: 16,
  },
  legalTextContainer: {
    marginBottom: 10,
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 35,
  },
  legalText: {
    fontFamily: 'Urbanist',
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
  legalTextLink: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 14,
    color: '#548DFF',
  },
});