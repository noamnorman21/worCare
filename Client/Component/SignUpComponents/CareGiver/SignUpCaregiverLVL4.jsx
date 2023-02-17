import {  View, Text, TextInput, SafeAreaView, TouchableOpacity, Dimensions, StyleSheet } from 'react-native'
import { useState } from 'react'
import { SelectList } from 'react-native-dropdown-select-list'
import RNPickerSelect from 'react-native-picker-select';
import { AntDesign, Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import DatePicker from 'react-native-datepicker';

import * as Font from 'expo-font';
Font.loadAsync({
  'Urbanist': require('../../../assets/fonts/Urbanist-Regular.ttf'),
  'Urbanist-Bold': require('../../../assets/fonts/Urbanist-Bold.ttf'),
  'Urbanist-Light': require('../../../assets/fonts/Urbanist-Light.ttf'),
  'Urbanist-Medium': require('../../../assets/fonts/Urbanist-Medium.ttf'),
});


export default function SignUpCaregiverLVL4() {

  const [country, setCountry] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [countrySelected, setCountrySelected] = useState('');
  const [language, setLanguage] = useState("");
  const [languageCode, setLanguageCode] = useState("");
  const [languageSelected, setLanguageSelected] = useState('');
  const [visaExpiration, setVisaExpiration] = useState("");
  const [date, setDate] = useState();

  return (
    <SafeAreaView>
      <Text style={styles.header}>Only few more details...</Text>
      <View style={styles.inputContainer}>
        {/* Drill down of country's */}
        <SelectList
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
          boxStyles={{borderWidth:0}} //override default styles
          // inputStyles={styles.input}
/>
        {/* Drill down of language's */}

        <SelectList
          style={styles.input}
          label="Preferred Language"
          placeholder="Select Language"
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
          save="Value"
        />
        {/* Date Picker for birth-date */}
        <DatePicker
          
        />
        <TextInput
          style={styles.input}
          placeholder="Birth Date"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setBirthDate(text)}
          value={birthDate}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        {/* Date Picker for Visa Expiration */}
        <TextInput
          style={styles.input}
          placeholder="Visa Expiration"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setVisaExpiration(text)}
          value={visaExpiration}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
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
  input: {
    width: Dimensions.get('window').width * 0.85,
    padding: 10,
    margin: 7,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: '#F5F5F5',
    borderColor: 'lightgray',
    shadowColor: '#000',
    height: 45,
  },
  inputContainer: {
    alignItems: 'center',
  },


})