import { View, Text, Dimensions, StyleSheet} from 'react-native'
import {useState} from 'react'
import { Dropdown } from 'react-native-element-dropdown';
import { FontAwesome, Entypo, MaterialIcons, AntDesign } from '@expo/vector-icons';
import * as Font from 'expo-font';
Font.loadAsync({
   'Urbanist': require('../../assets/fonts/Urbanist-Regular.ttf'),   
   'Urbanist-Bold': require('../../assets/fonts/Urbanist-Bold.ttf'),
   'Urbanist-Light': require('../../assets/fonts/Urbanist-Light.ttf'),
   'Urbanist-Medium': require('../../assets/fonts/Urbanist-Medium.ttf'),
   'Urbanist-SemiBold': require('../../assets/fonts/Urbanist-SemiBold.ttf'),
});


const SCREEN_WIDTH = Dimensions.get('window').width;
   
export default function LanguagesList() {

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
   
   return (
    <>
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
            setValueLanguage(item.value);
          }}
          renderRightIcon={() => (
            <MaterialIcons name="translate" size={24} color="gray" />
          )}
          containerStyle={styles.containerStyle}
        />
    </>
  )
}

const styles = StyleSheet.create({
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
    containerStyle: {
      justifyContent: 'flex-start',
      borderRadius: 16,
    },
})