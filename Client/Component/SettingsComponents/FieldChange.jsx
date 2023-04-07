import { Alert, View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { useEffect, useState } from 'react';


export default function FieldChange(props) {
   const [type, setType] = useState();
   const [value, setValue] = useState(props.value);
   const [userId, setUserId] = useState(props.userId);
   

   useEffect(() => {
      setType(props.type);
      setUserId(props.userId);
   }, [])

   const validatePhoneNum = (phoneNum) => {
      const phoneNumRegex = /^(0)[0-9]{9}$/
      return phoneNumRegex.test(phoneNum)
   }

   const validatePassword = (password) => {
      console.log('password', password);
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/ //at least 8 characters, 1 letter, 1 number
      return passwordRegex.test(password);
   }

   const save = () => {
      if (type === 'Password' && validatePassword(value)) {
         console.log('password is valid')         
         let userToUpdate = {
            userId: userId,
            Password: value
         }
         console.log('userToUpdate', userToUpdate);
         fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Settings/SetNewPassword', {
            method: 'PUT',
            headers: new Headers({
               'Content-Type': 'application/json; charset=UTF-8',
               'Accept': 'application/json; charset=UTF-8',
            }),
            body: JSON.stringify(userToUpdate)
         })
            .then(res => {
               return res.json()
            }
            )
            .then(
               (result) => {
                  console.log("fetch POST= ", result);
                  Alert.alert('Password Changed', 'Your password has been changed successfully');
               }
            )
            .catch((error) => {
               console.log('Error:', error.message);
            }
            )
            props.Save(type, value);
      }
      else if (type === 'Password' && !validatePassword(value)) {
         return Alert.alert('Password must be at least 8 characters, 1 letter and 1 number');
      }
      else if (type === 'Phone Number') {
         console.log('phone number')
         if (validatePhoneNum(value)) {
            console.log('phone number is valid')
            props.Save(type, value);
         }
         else {
            return Alert.alert('Phone number must be 10 digits and start with 0');
         }
      }
      props.Save(type, value);
   }

   return (
      <View style={styles.container}>
         <View style={styles.header}>
            {type == "Password" ? <Text style={styles.title}>Set New {type}</Text> : <Text style={styles.title}>Change {type}</Text>}
         </View>
         <View style={styles.inputContainer}>
            <TextInput
               style={[styles.input, styles.firstNameInput]}
               value={value}
               onChangeText={text => setValue(text)}
               keyboardType={type === 'Phone Number' ? 'phone-pad' : 'default'}
            />
         </View>
         <View style={styles.bottom}>
            <TouchableOpacity onPress={save} style={styles.button}>
               <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={props.cancel} style={styles.cancelbutton}>
               <Text style={styles.cancelbuttonText}>Cancel</Text>
            </TouchableOpacity>
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
   },
   button: {
      width: Dimensions.get('window').width * 0.85,
      backgroundColor: '#548DFF',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: 'lightgray',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 1,
      margin: 7,
      height: 55,
   },
   buttonText: {
      color: 'white',
      fontWeight: '600',
      fontSize: 16,
      fontFamily: 'Urbanist-SemiBold'
   },
   cancelbutton: {
      width: Dimensions.get('window').width * 0.85,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: 'lightgray',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 1,
      margin: 7,
      height: 55,
   },
   cancelbuttonText: {
      color: '#548DFF',
      fontWeight: '600',
      fontSize: 16,
      fontFamily: 'Urbanist-SemiBold'
   },
   input: {
      width: Dimensions.get('window').width * 0.85,
      height: 65,
      padding: 10,
      margin: 7,
      alignItems: 'center',
      borderRadius: 16,
      borderWidth: 1,
      backgroundColor: '#F5F5F5',
      borderColor: 'lightgray',
      shadowColor: '#000',
      fontSize: 16,
      fontFamily: 'Urbanist-Regular',
      textAlign: 'center',
   },
   inputContainer: {
      alignItems: 'center',
   },
   header: {
      marginTop: 20,
      marginBottom: 20,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 2,
   },
   title: {
      fontSize: 30,
      color: '#000',
      fontFamily: 'Urbanist-SemiBold'
   },
   bottom: {
      flex: 5,
   }
});
