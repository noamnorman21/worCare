import { View, Text, Alert, SafeAreaView, TouchableOpacity, Dimensions, StyleSheet } from 'react-native'
import { useState } from 'react'
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
  //we need to get the user data(most umporant is the id) from the previous screen
  

  const getMinDate = () => {
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    return date + '-' + month + '-' + year;
  }
  const getMaxDate = () => {
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear() + 20; //Current Year
    return date + '-' + month + '-' + year;
  }
  const [visaExpiration, setVisaExpiration] = useState('');
  const [date, setDate] = useState('');

  const [openCountry, setOpenCountry] = useState(false);
  const [valueCountry, setValueCountry] = useState(null);
  const [country, setCountry] = useState([
    { label: "United States", value: "US" },
    { label: "United Kingdom", value: "UK" },
    { label: "Canada", value: "CA" },
    { label: "France", value: "FR" },
    { label: "Germany", value: "DE" },
    { label: "Italy", value: "IT" },
    { label: "Spain", value: "ES" },
    { label: "Netherlands", value: "NL" },
    { label: "Belgium", value: "BE" },
    { label: "Austria", value: "AT" },
    { label: "Portugal", value: "PT" },
    { label: "Ireland", value: "IE" },
    { label: "Luxembourg", value: "LU" },
    { label: "Denmark", value: "DK" },
    { label: "Sweden", value: "SE" },
    { label: "Norway", value: "NO" },
    { label: "Finland", value: "FI" },
    { label: "Iceland", value: "IS" },
    { label: "Switzerland", value: "CH" },
    { label: "Greece", value: "GR" },
    { label: "Poland", value: "PL" },
    { label: "Czech Republic", value: "CZ" },
    { label: "Slovakia", value: "SK" },
    { label: "Hungary", value: "HU" },
    { label: "Romania", value: "RO" },
    { label: "Bulgaria", value: "BG" },
    { label: "Croatia", value: "HR" },
    { label: "Slovenia", value: "SI" },
    { label: "Serbia", value: "RS" },
    { label: "Bosnia and Herzegovina", value: "BA" },
    { label: "Macedonia", value: "MK" },
    { label: "Albania", value: "AL" },
    { label: "Montenegro", value: "ME" },
    { label: "Turkey", value: "TR" },
    { label: "Russia", value: "RU" },
    { label: "Ukraine", value: "UA" },
    { label: "Belarus", value: "BY" },
    { label: "Moldova", value: "MD" },
    { label: "Lithuania", value: "LT" },
    { label: "Latvia", value: "LV" },
    { label: "Estonia", value: "EE" },
    { label: "Azerbaijan", value: "AZ" },
    { label: "Georgia", value: "GE" },
    { label: "Armenia", value: "AM" },
    { label: "Turkmenistan", value: "TM" },
    { label: "Uzbekistan", value: "UZ" },
    { label: "China", value: "CN" },
    { label: "Japan", value: "JP" },
    { label: "South Korea", value: "KR" },
    { label: "Vietnam", value: "VN" },
    { label: "Thailand", value: "TH" },
    { label: "Malaysia", value: "MY" },
    { label: "Singapore", value: "SG" },
    { label: "Philippines", value: "PH" },
    { label: "Indonesia", value: "ID" },
    { label: "India", value: "IN" },
    { label: "Pakistan", value: "PK" },
    { label: "Bangladesh", value: "BD" },
    { label: "Nepal", value: "NP" },
    { label: "Sri Lanka", value: "LK" },
    { label: "Myanmar", value: "MM" },
    { label: "Cambodia", value: "KH" },
    { label: "Laos", value: "LA" },
    { label: "Australia", value: "AU" },
    { label: "New Zealand", value: "NZ" },
    { label: "Fiji", value: "FJ" },
    { label: "Mexico", value: "MX" },
    { label: "Brazil", value: "BR" },
    { label: "Argentina", value: "AR" },
    { label: "Chile", value: "CL" },
    { label: "Peru", value: "PE" },
    { label: "Colombia", value: "CO" },
    { label: "Venezuela", value: "VE" },
    { label: "Ecuador", value: "EC" },
    { label: "Israel", value: "IL" },
    { label: "Egypt", value: "EG" },
    { label: "Morocco", value: "MA" },
    { label: "Tunisia", value: "TN" },
    { label: "Algeria", value: "DZ" },
    { label: "Other", value: "Other" }
  ]); //איזה שכונה.., להוציא לקובץ חיצוני ולהשתמש בפונקציה שמחזירה את המערך כי זה ארוך וחופר

  const [openLanguage, setOpenLanguage] = useState(false);
  const [valueLanguage, setValueLanguage] = useState(null);
  const [language, setLanguage] = useState([
    { label: "English", value: "EN" },
    { label: "French", value: "FR" },
    { label: "Spanish", value: "ES" },
    { label: "German", value: "DE" },
    { label: "Italian", value: "IT" },
    { label: "Dutch", value: "NL" },
    { label: "Portuguese", value: "PT" },
    { label: "Russian", value: "RU" },
    { label: "Chinese", value: "ZH" },
    { label: "Japanese", value: "JA" },
    { label: "Korean", value: "KO" },
    { label: "Arabic", value: "AR" },
    { label: "Hindi", value: "HI" },
    { label: "Turkish", value: "TR" },
    { label: "Polish", value: "PL" },
    { label: "Czech", value: "CS" },
    { label: "Slovak", value: "SK" },
    { label: "Hungarian", value: "HU" },
    { label: "Romanian", value: "RO" },
    { label: "Bulgarian", value: "BG" },
    { label: "Croatian", value: "HR" },
    { label: "Slovenian", value: "SL" },
    { label: "Serbian", value: "SR" },
    { label: "Bosnian", value: "BS" },
    { label: "Macedonian", value: "MK" },
    { label: "Albanian", value: "SQ" },
    { label: "Montenegrin", value: "ME" },
    { label: "Ukrainian", value: "UK" },
    { label: "Belarusian", value: "BE" },
    { label: "Moldovan", value: "MO" },
    { label: "Georgian", value: "KA" },
    { label: "Azerbaijani", value: "AZ" },
    { label: "Turkmen", value: "TK" },
    { label: "Hebrew", value: "HE" },
    { label: "Thai", value: "TH" },
    { label: "Vietnamese", value: "VI" },
    { label: "Indonesian", value: "ID" },
    { label: "Malay", value: "MS" },
    { label: "Burmese", value: "MY" },
    { label: "Khmer", value: "KM" },
    { label: "Lao", value: "LO" },
    { label: "Tamil", value: "TA" },
    { label: "Telugu", value: "TE" },
    { label: "Kannada", value: "KN" },
    { label: "Malayalam", value: "ML" },
    { label: "Marathi", value: "MR" },
    { label: "Other", value: "Other" }
  ]); // להוציא לקובץ חיצוני ולהשתמש בפונקציה שמחזירה את המערך כי זה ארוך וחופר

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
          format="DD-MM-YYYY"
          minDate="01-01-1900"
          maxDate="01-01-2002"
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
          format="DD-MM-YYYY"
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