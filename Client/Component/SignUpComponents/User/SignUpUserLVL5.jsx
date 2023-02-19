import { View, Text, SafeAreaView, StyleSheet, Dimensions, TextInput, TouchableOpacity, Alert } from 'react-native'
import { useState } from 'react'
import { OrLine, HaveAccount } from '../FooterLine'
import DatePicker from 'react-native-datepicker';
import { Dropdown } from 'react-native-element-dropdown';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;
export default function SignUpUserLVL5({ navigation }) {
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
  const [valueLanguage, setValueLanguage] = useState(null);
  const [date, setDate] = useState('');
  const [patientID, setPatientID] = useState('');
  const [patientFirstName, setPatientFirstName] = useState('');
  const [patientLastName, setPatientLastName] = useState('');

  const handleInputAndContinue = () => {

    if (patientFirstName === '' || patientLastName === '' || patientID === '' || date === '' || valueLanguage === null) {
      Alert.alert('Please fill all the fields')
      return
    }
    if (patientID.length !== 9) {
      Alert.alert('Patient ID must be 9 digits')
      return
    }
    const patientData = {
      FirstName: patientFirstName,
      LastName: patientLastName,
      PatientID: patientID,
      BirthDate: date,
      Language: valueLanguage
    }
    navigation.navigate('SignUpLimitations', { patientData: patientData })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTxt}>Create Patient Profile</Text>
        <Text style={styles.headerSmallTxt}> We love to know details about the patient </Text>
        {/* Line */}
        <View style={styles.line} />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="gray"
          value={patientFirstName}
          onChangeText={(patientFirstName) => setPatientFirstName(patientFirstName)}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="gray"
          value={patientLastName}
          onChangeText={(patientLastName) => setPatientLastName(patientLastName)}
        />
        <TextInput
          style={styles.inputFull}
          placeholder="Patient ID (9 Digits)"
          placeholderTextColor="gray"
          keyboardType="numeric"
          value={patientID}
          onChangeText={(patientID) => setPatientID(patientID)}
        />
        {/* Date Picker for birth-date */}
        <DatePicker
          useNativeDriver={'true'}
          iconComponent={<FontAwesome name="calendar-check-o" size={24} color="gray" />}
          style={styles.inputFull}
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
              fontFamily: 'Urbanist',
              fontSize: 16
            }
          }}
          onDateChange={(date) => { setDate(date) }}
        />
      </View>
      <View style={styles.listContainer}>
        <Dropdown
          style={styles.dropdown}
          placeholder="Select Language"
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={language}
          search={true}
          maxHeight={300}
          labelField="label"
          valueField="value"
          searchPlaceholder="Search..."
          value={valueLanguage}
          onChange={item => {
            setValueLanguage(item.value);
          }}
          renderRightIcon={() => (
            <MaterialIcons name="translate" size={24} color="gray" />
          )}
          containerStyle={styles.containerStyle}
        />
      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleInputAndContinue}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>

      <OrLine />
      <HaveAccount />
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flex: 1.5,
  },
  listContainer: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flex: 1.5,
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  btnContainer: {
    width: SCREEN_WIDTH * 1,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  headerTxt: {
    marginTop: 50,
    fontFamily: 'Urbanist-Bold',
    fontSize: 28,
    color: '#000',
    textAlign: 'center',
  },
  line: {
    borderBottomColor: '#808080',
    borderBottomWidth: 0.5,
    marginVertical: 20,
  },
  headerSmallTxt: {
    marginTop: 10,
    fontFamily: 'Urbanist-Medium',
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  inputFull: {
    width: SCREEN_WIDTH * 0.925,
    height: 50,
    borderWidth: 1,
    fontFamily: 'Urbanist',
    fontSize: 16,
    color: '#808080',
    borderColor: 'gray',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
    justifyContent: 'center',
  },
  input: {
    width: SCREEN_WIDTH * 0.45,
    height: 50,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontFamily: 'Urbanist',
    fontSize: 16,
    color: '#808080',
  },
  button: {
    width: SCREEN_WIDTH * 0.925,
    height: 50,
    backgroundColor: '#548DFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  buttonText: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 16,
    color: '#fff',
  },
  dropdown: {
    padding: 16,
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 16,
    width: SCREEN_WIDTH * 0.925,
  },
  placeholderStyle: {
    fontSize: 16,
    width: SCREEN_WIDTH * 0.925,
    fontFamily: 'Urbanist',
    color: 'gray',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'gray',
  },
  inputSearchStyle: {
    height: 40,
    width: SCREEN_WIDTH * 0.9,
    fontSize: 16,
    fontFamily: 'Urbanist',
    borderRadius: 16,
    color: 'gray',
  },
  containerStyle: {
    justifyContent: 'flex-start',
    borderRadius: 16,
  },
})