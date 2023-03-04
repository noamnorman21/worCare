import { View, Text, Alert, SafeAreaView, TouchableOpacity, Dimensions, StyleSheet } from 'react-native'
import { useState, useEffect } from 'react'
import { FontAwesome, Entypo, MaterialIcons, AntDesign } from '@expo/vector-icons';
import DatePicker from 'react-native-datepicker';
import { Dropdown } from 'react-native-element-dropdown';
import { OrLine, HaveAccount } from '../FooterLine';
import * as Font from 'expo-font';
Font.loadAsync({
  'Urbanist': require('../../../assets/fonts/Urbanist-Regular.ttf'),
  'Urbanist-Bold': require('../../../assets/fonts/Urbanist-Bold.ttf'),
  'Urbanist-Light': require('../../../assets/fonts/Urbanist-Light.ttf'),
  'Urbanist-Medium': require('../../../assets/fonts/Urbanist-Medium.ttf'),
});

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function SignUpCaregiverLVL4({ navigation, route }) {
  const [language, setLanguage] = useState([]);
  const [country, setCountry] = useState([]);
  //we need to get the user data(most umporant is the id) from the previous screen
  const userId = route.params.userId;
  useEffect(() => {
    let urlforLanguages = 'https://proj.ruppin.ac.il/cgroup94/test1/api/LanguageCountry/GetAllLanguages';
    let urlforCountries = 'https://proj.ruppin.ac.il/cgroup94/test1/api/User/GetAllCountries';
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
          let coun = data.map((item) => {
            return { label: item, value: item }
          })
          setCountry(coun);
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
          let lang = data.map((item) => {
            return { label: item.LanguageName_Origin, value: item.LanguageName_En }
          })
          setLanguage(lang);
        }
      })
      .catch((error) => {
        console.log("err=", error);
      });


  }, [])

  const getMinDate = () => {
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    return year + '-' + month + '-' + date;
  }
  const getMaxDate = () => {
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear() + 20; //Current Year
    return year + '-' + month + '-' + date;
  }
  const [visaExpiration, setVisaExpiration] = useState('');
  const [date, setDate] = useState('');

  const [openCountry, setOpenCountry] = useState(false);
  const [valueCountry, setValueCountry] = useState(null);
 

  const [openLanguage, setOpenLanguage] = useState(false);
  const [valueLanguage, setValueLanguage] = useState(null);
  

  // send this data to next screen (SignUpCaregiverLVL5)
  const NavigateToNextScreen = () => {
    if (valueCountry == null) {
      Alert.alert("Please fill all the details");
    } else {
      const data = {
        Id: route.params.userId,
        CountryName_En: valueCountry,
        LanguageName_En: valueLanguage,
        DateOfBirth: date,
        VisaExpirationDate: visaExpiration,
      };
      navigation.navigate("SignUpCaregiverLVL5", { data: data });
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.headerContainer}>
        <Text style={styles.header}>Only few more details...</Text>
      </View>

      <View style={styles.inputContainer}>
        {/* Date Picker for birth-date */}
        <DatePicker
          useNativeDriver={true}
          iconComponent={<FontAwesome name="calendar-check-o" size={24} color="gray" />}
          style={styles.input}
          date={date}
          mode="date"
          placeholder="Date Of Birth"
          format="YYYY-MM-DD"
          minDate="1940-01-01"
          maxDate="2001-01-01"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              right: 0,
              top: 0,
              marginLeft: 0.2
            },
            dateInput: {
              marginLeft: 0,
              alignItems: 'flex-left',
              borderWidth: 0,
            },
            placeholderText: {
              color: 'gray',
              fontFamily: 'Urbanist-Medium',
              fontSize: 16
            }
          }}
          onDateChange={(date) => { setDate(date) }}
        />
      </View>
      <View style={styles.inputContainer}>

        {/* Date Picker for visa expiration min date should be today*/}
        <DatePicker
          iconComponent={<FontAwesome name="calendar-times-o" size={24} color="gray" />}
          useNativeDriver={true}
          style={styles.input}
          date={visaExpiration}
          mode="date"
          placeholder="Visa Expiration"
          format="YYYY-MM-DD"
          minDate={getMinDate()}
          maxDate={getMaxDate()}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: 'absolute',
              right: 0,
              top: 0,
            },
            dateInput: {
              marginLeft: 0,
              alignItems: 'flex-left',
              borderWidth: 0,
            },
            placeholderText: {
              color: 'gray',
              fontFamily: 'Urbanist-Medium',
              fontSize: 16
            }
          }}
          onDateChange={(date) => { setVisaExpiration(date) }}
        />
      </View>
      {/* Drop Down Picker for Country */}
      <View style={styles.listContainer}>
        <Dropdown
          style={styles.dropdown}
          placeholder="Select Country"
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={country}
          search={true}
          maxHeight={300}
          labelField="label"
          valueField="value"
          searchPlaceholder="Search..."
          value={valueCountry}
          onChange={item => {
            setValueCountry(item.label);
          }}
          renderRightIcon={() => (
            <Entypo name={'location'} color={'gray'} size={24} />
          )}
          containerStyle={styles.containerStyle}
        />
      </View>
      {/* Drop Down Picker for Language */}
      <View style={styles.listContainer}>
        <Dropdown
          style={styles.dropdown}
          placeholder="Select Language"
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={language}
          search={true}
          maxHeight={300}
          labelField="label"
          valueField="value"
          searchPlaceholder="Search..."
          value={valueLanguage}
          onChange={item => {
            setValueLanguage(item.label);
          }}
          renderRightIcon={() => (
            <MaterialIcons name="translate" size={24} color="gray" />
          )}
          containerStyle={styles.containerStyle}
        />
      </View>

      {/* Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          // if the drop down picker is open then display none the button
          style={[styles.button, { display: openCountry || openLanguage ? 'none' : 'flex' }]}

          onPress={NavigateToNextScreen}
        >
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
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  containerStyle: {
    justifyContent: 'flex-start',
    borderRadius: 16,
  },
  dropdown: {
    padding: 16,
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 16,
    width: SCREEN_WIDTH * 0.85,
  },
  placeholderStyle: {
    fontSize: 16,
    width: SCREEN_WIDTH * 0.85,
    fontFamily: 'Urbanist-Medium',
    color: 'gray',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'gray',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    width: SCREEN_WIDTH * 0.8,
    fontSize: 16,
    fontFamily: 'Urbanist',
    borderRadius: 16,
    color: 'gray',
  },
  header: {
    fontSize: 30,
    fontFamily: 'Urbanist-Bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  headerContainer: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    // paddingHorizontal: 10,
    // marginBottom: 10,
    flex: 1
  },
  inputContainer: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    flex: 0.35
  },
  buttonContainer: {
    width: SCREEN_WIDTH * 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    flex: 1
  },
  button: {
    width: SCREEN_WIDTH * 0.85,
    height: 50,
    backgroundColor: '#548DFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    zIndex: 1000,
    zIndexInverse: 3000,
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
  listContainer: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    flex: 0.35,
  },
  input: {
    width: SCREEN_WIDTH * 0.85,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Urbanist-Medium',
    color: 'gray',
    borderColor: 'gray',
    borderWidth: 1,
    justifyContent: 'center',
  }
})