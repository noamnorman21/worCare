import { View, Text, SafeAreaView, StyleSheet, Alert, TouchableOpacity } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react';
import ImagePickerExample from '../HelpComponents/ImagePickerExample'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Modal } from 'react-native';
import FieldChange from './FieldChange';
import GenderChange from './GenderChange';


export default function Profile() {
  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [Gender, setGender] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalValue, setModalValue] = useState('');
  const [modal2Visible, setModal2Visible] = useState(false);

  const openModal = (type, value) => {
    setModalType(type);
    setModalValue(value);
    setModalVisible(true);
  }

  const openModal2 = (value) => {   
    setModal2Visible(true);
  }

  const Update = (Field, value) => {
    setModalVisible(false);
    if (Field == "First Name") {
     setFirstName(value)
    }
    else if (Field == "Last Name") {
      setLastName(value);
    }

  }





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
      <TouchableOpacity underlayColor={'lightgrey'} style={styles.fields} onPress={() => openModal("First Name",firstName)}><Text>{firstName}</Text></TouchableOpacity>
      <TouchableOpacity underlayColor={'lightgrey'} style={styles.fields} onPress={() =>  openModal("Last Name",lastName)}><Text>{lastName}</Text></TouchableOpacity>
      <TouchableOpacity underlayColor={'lightgrey'} style={styles.fields} onPress={() =>  openModal2(Gender)}><Text>{Gender}</Text></TouchableOpacity>
      <Modal animationType="slide" visible={modalVisible}>
        <FieldChange userId={userId} type={modalType} value={modalValue} cancel={()=> setModalVisible(false)} Save={(Field, value) => Update(Field, value) }  />
      </Modal>
      <Modal animationType="slide" visible={modal2Visible}>
        <GenderChange userId={userId} cancel={()=> setModal2Visible(false)}Save={(Gender) => {setModal2Visible(false);setGender(Gender)}} />
      </Modal>
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
  fields: {
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