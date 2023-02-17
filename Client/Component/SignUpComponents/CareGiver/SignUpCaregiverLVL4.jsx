import { View, Text, TextInput, SafeAreaView, TouchableOpacity, Dimensions, StyleSheet, Image } from 'react-native'
import { useState } from 'react'
import { SelectList } from 'react-native-dropdown-select-list'
import { FontAwesome } from '@expo/vector-icons';
import DatePicker from 'react-native-datepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import * as Font from 'expo-font';
Font.loadAsync({
  'Urbanist': require('../../../assets/fonts/Urbanist-Regular.ttf'),
  'Urbanist-Bold': require('../../../assets/fonts/Urbanist-Bold.ttf'),
  'Urbanist-Light': require('../../../assets/fonts/Urbanist-Light.ttf'),
  'Urbanist-Medium': require('../../../assets/fonts/Urbanist-Medium.ttf'),
});

export default function SignUpCaregiverLVL4() {

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

  const [countryCode, setCountryCode] = useState("");
  const [countrySelected, setCountrySelected] = useState('');
  const [language, setLanguage] = useState("");
  const [languageCode, setLanguageCode] = useState("");
  const [languageSelected, setLanguageSelected] = useState('');
  const [visaExpiration, setVisaExpiration] = useState("");
  const [date, setDate] = useState();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
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
    { label: "Kazakhstan", value: "KZ" },
    { label: "Kyrgyzstan", value: "KG" },
    { label: "Tajikistan", value: "TJ" },
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
    { label: "India", value: "IN" },
  ]); // להוציא לקובץ חיצוני ולהשתמש בפונקציה שמחזירה את המערך כי זה ארוך וחופר

  return (
    <SafeAreaView>
      <Text style={styles.header}>Only few more details...</Text>
      <View style={styles.inputContainer}>
        {/* Drill down of country's */}
        <SelectList
          arrowIcon={<FontAwesome name={'close'} size={24} color={"black"} />}
          label="Origin Country"
          placeholder="Select Country"
          // setSelected={(val) => setCountrySelected(val)}
          data={[
            { label: "US", value: "United States" },
            { label: "UK", value: "United Kingdom" },
            { label: "CA", value: "Canada" },
            { label: "FR", value: "France" },
            { label: "DE", value: "Germany" },
            { label: "IT", value: "Italy" },
            { label: "ES", value: "Spain" },
            { label: "NL", value: "Netherlands" },
            { label: "BE", value: "Belgium" },
            { label: "AT", value: "Austria" },
            { label: "PT", value: "Portugal" },
            { label: "IE", value: "Ireland" },
            { label: "LU", value: "Luxembourg" },
            { label: "DK", value: "Denmark" },
          ]}
          save="Value"
          fontFamily="Urbanist"
          boxStyles={{ borderWidth: 1, borderColor: 'lightgray', borderRadius: 16, padding: 10, width: Dimensions.get('window').width * 0.75 }}
          inputStyles={{ fontFamily: 'Urbanist-Medium', fontSize: 16, color: 'gray' }}
        // inputStyles={styles.input}
        />

        <DropDownPicker
          style={styles.input}
          open={open}
          value={value}
          items={country}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setCountry}
          placeholder="Select Country"
          searchable={true}
          searchPlaceholder="Search..."
          searchContainerStyle={{
            borderBottomColor: "#dfdfdf",
          }}
          searchTextInputStyle={{
            color: "#333333",
            borderColor: "#dfdfdf",
            borderWidth: 0,
            fontFamily: "Urbanist-Medium",
            fontSize: 14,
          }}
        />


        {/* Drill down of language's */}
        <SelectList
          // style={styles.input}
          boxStyles={{ borderWidth: 1, borderColor: 'lightgray', borderRadius: 16, padding: 10, width: Dimensions.get('window').width * 0.75 }}
          inputStyles={{ fontFamily: 'Urbanist-Medium', fontSize: 16, color: 'gray' }}
          label="Preferred Language"
          placeholder="Select Language"
          save="Value"
          // setSelected={(val) => setLanguageSelected(val)}
          data={[
            { label: "EN", value: "English" },
            { label: "FR", value: "French" },
            { label: "DE", value: "German" },
            { label: "IT", value: "Italian" },
            { label: "ES", value: "Spanish" },
            { label: "NL", value: "Dutch" },
            { label: "BE", value: "Belgian" },
            { label: "AT", value: "Austrian" },
            { label: "PT", value: "Portuguese" },
            { label: "IE", value: "Irish" },
            { label: "LU", value: "Luxembourgish" },
            { label: "DK", value: "Danish" },
          ]}
        />
        {/* Date Picker for birth-date */}
        <DatePicker
          useNativeDriver={'true'}
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
              alignItems: 'center',
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
        {/* Date Picker for visa expiration min date should be today*/}
        <DatePicker
          iconComponent={<FontAwesome name="calendar-times-o" size={24} color="gray" />}
          useNativeDriver={'true'}
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
              alignItems: 'center',
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
  header: {
    fontSize: 30,
    fontFamily: 'Urbanist-Bold',
    textAlign: 'center',
    marginBottom: 50,
  },
  inputContainer: {
    alignItems: 'center',
  },
  input: {
    width: Dimensions.get('window').width * 0.75,
    padding: 10,
    margin: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'lightgray',
    shadowColor: '#000',
    height: 50,
  },
})