import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Button, Modal, Dimensions, SafeAreaView } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function SignUpHobbies({ navigation, route }) {
  const [modal1Visible, setModal1Visible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);
  const [modal3Visible, setModal3Visible] = useState(false);
  const [modal4Visible, setModal4Visible] = useState(false);
  const [modal5Visible, setModal5Visible] = useState(false);

  const [books, setBooks] = useState('');
  const [music, setMusic] = useState('');
  const [tv, setTv] = useState('');
  const [radio, setRadio] = useState('');
  const [food, setFood] = useState('');
  const [drinks, setDrinks] = useState('');
  const [specialHobbies, setSpecialHobbies] = useState('');
  const [afterNoonNaps, setAfterNoonNaps] = useState('');
  const [nightSleep, setNightSleep] = useState('');
  const [movies, setMovies] = useState('');
  const [other, setOther] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text>Add Patient’s Hobbies</Text>
        <View style={styles.line} />
      </View>
      <TouchableOpacity
        style={styles.inputBox}
        onPress={() => setModal1Visible(true)}>
        <Text style={styles.input}>Books</Text>
        <Entypo style={styles.icon} name="chevron-right" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('SignUpFinish') }}>
        <Text style={styles.input}>Continue</Text>
      </TouchableOpacity>



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
  line: {
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    width: SCREEN_WIDTH * 1,
    marginVertical: 20,
  }, 
  button: {
    width: SCREEN_WIDTH * 0.9,
    height: 50,
    backgroundColor: '#548DFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }

});