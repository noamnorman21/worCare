import { View, Text, SafeAreaView, StyleSheet, Dimensions, TouchableOpacity, Alert, Platform } from 'react-native'
import { useState, useEffect } from 'react'
import { OrLine, HaveAccount } from '../FooterLine'
import DatePicker from 'react-native-datepicker';
import { Dropdown } from 'react-native-element-dropdown';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInput } from 'react-native-paper';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function SignUpUserLVL5({ navigation, route }) {
  const [language, setLanguage] = useState(route.params.language);
  const [valueLanguage, setValueLanguage] = useState(null);
  const [date, setDate] = useState('');
  const [patientID, setPatientID] = useState('');
  const [patientFirstName, setPatientFirstName] = useState('');
  const [patientLastName, setPatientLastName] = useState('');
  const [platfr, setPlatfr] = useState(Platform.OS);
  const [showPickerAndroid, setShowPickerAndroid] = useState(false);
  const [IsPatientIdUnique, setIsPatientIdUnique] = useState(true);

  //for date picker android
  const showDatepicker = () => {
    setShowPickerAndroid(!showPickerAndroid);
  };

  const onChangeDate = (selectedDate) => {
    console.log('date changed');
    const birthDate = new Date(selectedDate.nativeEvent.timestamp).toISOString().substring(0, 10);
    console.log(birthDate, "birthDate");
    console.log(date, "date");
    if (birthDate !== '1980-01-01') { setDate(birthDate); }
    setShowPickerAndroid(!showPickerAndroid);
  };

  const IsPatientIdUniqueFunc = () => { //check if the patient id is unique in the db
    let IsPatientExistUrl = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Patient/IsPatientExist';
    console.log("patientID=", patientID);
    let patientDTO = {
      patientId: patientID
    }
    fetch(IsPatientExistUrl, {
      method: 'POST',
      body: JSON.stringify(patientDTO),
      headers: new Headers({
        'Content-type': 'application/json; charset=UTF-8' //very important to add the 'charset=UTF-8'!!!!
      })
    })
      .then(res => {
        if (res.ok) {
          setIsPatientIdUnique(true);
          return res.json()
        }
        else {
          setIsPatientIdUnique(false);
        }
      })
      .catch((error) => {
        console.log("err in IsPatientIdUnique=", error);
      });
  }

  const handleInputAndContinue = () => {
    if (patientFirstName === '' || patientLastName === '' || patientID === '' || date === '' || valueLanguage === null) {
      Alert.alert('Please fill all the fields')
      return
    }
    if (patientID.length !== 9) {
      Alert.alert('Patient ID must be 9 digits')
      return
    }
    if (!IsPatientIdUnique) {
      Alert.alert('Patient ID already exist')
      return
    }
    // after all the checks, we can navigate to the next screen and pass the data 
    // after all ready uncomment the following lines and delete the lines below it
    const patientData = {
      FirstName: patientFirstName,
      LastName: patientLastName,
      patientId: patientID,
      DateOfBirth: date,
      LanguageName_En: valueLanguage
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
          mode='outlined'
          label={<Text style={{ fontFamily: "Urbanist-Medium" }}>First Name</Text>}
          outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
          contentStyle={{ fontFamily: 'Urbanist-Regular' }}
          activeOutlineColor="#548DFF"
          outlineColor='#E6EBF2'
          value={patientFirstName}
          onChangeText={(patientFirstName) => setPatientFirstName(patientFirstName)}
        />

        <TextInput
          style={styles.input}
          placeholder="Last Name"
          mode='outlined'
          label={<Text style={{ fontFamily: "Urbanist-Medium" }}>Last Name</Text>}
          outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
          contentStyle={{ fontFamily: 'Urbanist-Regular' }}
          activeOutlineColor="#548DFF"
          outlineColor='#E6EBF2'
          placeholderTextColor="gray"
          value={patientLastName}
          onChangeText={(patientLastName) => setPatientLastName(patientLastName)}
        />
        <TextInput
          style={styles.inputFull}
          placeholder="Patient ID (9 Digits)"
          placeholderTextColor="gray"
          returnKeyType="done"
          keyboardType="numeric"
          value={patientID}
          onChangeText={(patientID) => setPatientID(patientID)}
          onBlur={() => IsPatientIdUniqueFunc()}
          mode='outlined'
          label={<Text style={{ fontFamily: "Urbanist-Medium" }}>Patient ID ( 9 Digits )</Text>}
          outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
          contentStyle={{ fontFamily: 'Urbanist-Regular' }}
          activeOutlineColor="#548DFF"
          outlineColor='#E6EBF2'
        />
        {/* Date Picker for birth-date */}
        {platfr !== 'ios' ?
          <TouchableOpacity style={styles.datePicker} onPress={showDatepicker}>
            <Text style={[styles.dateInputTxt]}>
              {date === '' ? 'Date Of Birth' : date}
            </Text>
            {!date && <FontAwesome name="calendar-check-o" size={24} color="gray" />}
          </TouchableOpacity>
          :
          <View style={styles.datePickerIos}>
            <DatePicker
              useNativeDriver={false}
              iconComponent={<FontAwesome name="calendar-check-o" size={24} color="gray" />}
              style={[styles.inputFull, { paddingHorizontal: 10, borderWidth: 1.5, borderColor: '#E6EBF2', borderRadius: 16 }]}
              date={date}
              mode="date"
              placeholder="Date Of Birth"
              format="YYYY-MM-DD"
              minDate="1900-01-01"
              maxDate="2002-01-01"
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
                  alignItems: 'flex-start',
                  borderWidth: 0,
                },
                placeholderText: {
                  color: 'gray',
                  fontFamily: 'Urbanist',
                  fontSize: 16,
                  // textAlign: 'left',
                }
              }}
              onDateChange={(date) => { setDate(date) }}
            />
          </View>}
        {showPickerAndroid && (
          <DateTimePicker
            //testID="dateTimePicker"
            value={new Date('1980-01-01')}
            // mode={"date"}
            is24Hour={true}
            onChange={(date) => onChangeDate(date)}
            display="default"
            maximumDate={new Date()}
            minimumDate={new Date('1920-01-01')}
          />
        )}

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

      <TouchableOpacity
        style={styles.btnContainer}
        onPress={handleInputAndContinue}
      >
        <View style={styles.button}>
          <Text style={styles.buttonText}>Continue</Text>
        </View>
      </TouchableOpacity>
      <OrLine />
      <HaveAccount />
    </SafeAreaView >
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
    height: 54,
    fontFamily: 'Urbanist-Regular',
    fontSize: 16,
    color: '#808080',
    backgroundColor: '#fff',
    marginVertical: 10,
    justifyContent: 'center',
  },
  datePicker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.925,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E6EBF2',
    shadowColor: '#000',
    height: 54,
    fontFamily: 'Urbanist-Light',
    fontSize: 16,
  },
  input: {
    width: SCREEN_WIDTH * 0.45,
    height: 54,
    backgroundColor: '#fff',
    marginVertical: 10,
    fontFamily: 'Urbanist-Regular',
    fontSize: 16,
    color: '#808080',
  },
  button: {
    width: SCREEN_WIDTH * 0.925,
    height: 54,
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
    paddingHorizontal: 10,
    height: 54,
    borderColor: '#E6EBF2',
    borderWidth: 1.5,
    borderRadius: 16,
    width: SCREEN_WIDTH * 0.925,
    marginTop: 20,
  },
  placeholderStyle: {
    fontSize: 16,
    width: SCREEN_WIDTH * 0.925,
    fontFamily: 'Urbanist-Regular',
    color: 'gray',
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: 'Urbanist-Regular',
    color: 'gray',
  },
  inputSearchStyle: {
    height: 40,
    width: SCREEN_WIDTH * 0.9,
    fontSize: 16,
    fontFamily: 'Urbanist-Regular',
    borderRadius: 16,
    color: 'gray',
  },
  containerStyle: {
    justifyContent: 'flex-start',
    borderRadius: 16,
  },
  dateInputTxt: {
    color: '#000',
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: 'Urbanist-Regular',
    fontSize: 16,
    color: '#808080',
  },
  dateIcon: {
    position: 'absolute',
    right: 0,
    top: 10,
    marginLeft: 0.2
  },
  datePickerIos: {
    flexDirection: 'row',
    width: SCREEN_WIDTH * 0.925,

  }
})