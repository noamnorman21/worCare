import { View, Text, SafeAreaView, StyleSheet, Dimensions, TextInput, TouchableOpacity, Alert } from 'react-native'
import { useState } from 'react'
import { OrLine, HaveAccount } from '../FooterLine'
import DatePicker from 'react-native-datepicker';
import { Dropdown } from 'react-native-element-dropdown';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;
export default function SignUpUserLVL5({ navigation, route }) {
  const [language, setLanguage] = useState(route.params.language);
  const [valueLanguage, setValueLanguage] = useState(null);
  const [date, setDate] = useState('');
  const [patientID, setPatientID] = useState('');
  const [patientFirstName, setPatientFirstName] = useState('');
  const [patientLastName, setPatientLastName] = useState('');
  //  getMaxDate for age 21="2002-01-01" 
  const getMaxDate = () => {
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear() - 21; //Current Year
    return year + '-' + month + '-' + date;
  }

  const handleInputAndContinue = () => {
    // if (patientFirstName === '' || patientLastName === '' || patientID === '' || date === '' || valueLanguage === null) {
    //   Alert.alert('Please fill all the fields')
    //   return
    // }
    // if (patientID.length !== 9) {
    //   Alert.alert('Patient ID must be 9 digits')
    //   return
    // }

    
    // after all the checks, we can navigate to the next screen and pass the data 
    // after all ready uncomment the following lines and delete the lines below it
    // const patientData = {
    //   FirstName: patientFirstName,
    //   LastName: patientLastName,
    //   Id: patientID,
    //   DateOfBirth: date,
    //   LanguageName_En: valueLanguage
    // }

    // for testing purposes
    const patientTest = {
      FirstName: 'test',
      LastName: 'test',
      Id: '123456789',
      DateOfBirth: '2002-01-01',
      LanguageName_En: 'English'
    }
    const patientData = {
      FirstName: patientTest.FirstName,
      LastName: patientTest.LastName,
      Id: patientTest.Id,
      DateOfBirth: patientTest.DateOfBirth,
      LanguageName_En: patientTest.LanguageName_En
    }

    navigation.navigate('SignUpLimitations', { patientData: patientData, tblUser: route.params.tblUser })
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
          format="YYYY-MM-DD"
          minDate="1900-01-01"
          maxDate= "2002-01-01"
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