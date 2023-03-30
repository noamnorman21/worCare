import { View, Text, SafeAreaView, StyleSheet, Alert } from 'react-native'
import React from 'react'
import { useState,useEffect } from 'react';
import ImagePickerExample from '../HelpComponents/ImagePickerExample'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableHighlight } from 'react-native-gesture-handler';


export default function Profile() {
  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [Gender, setGender] = useState(null);



  useEffect(() => {
    const getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('userData');
            const userData = jsonValue != null ? JSON.parse(jsonValue) : null;
           console.log('userData', userData);
          setUserId(userData.Id);
          setFirstName(userData.FirstName);
          setLastName(userData.LastName);
          setGender(userData.gender)
        } catch (e) {
            console.log('error', e);
        }
    };
    getData();
}, []);


 

  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>    
      </View>
      <TouchableHighlight underlayColor={'lightgrey'}  style={styles.fields} onPress={()=> Alert.alert("Pressed")}><Text>{firstName}</Text></TouchableHighlight>
      <TouchableHighlight underlayColor={'lightgrey'}  style={styles.fields} onPress={()=> Alert.alert("Pressed")}><Text>{lastName}</Text></TouchableHighlight>
      <TouchableHighlight underlayColor={'lightgrey'} style={styles.fields} onPress={()=> Alert.alert("Pressed")}><Text>{Gender}</Text></TouchableHighlight>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',    
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
  },
  smallTitle: {
    fontSize: 15,
    color: '#000',
  },
 fields:{
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderBottomWidth: 1,
    borderColor: 'lightgrey',
    padding: 10,   
   
  } 
})