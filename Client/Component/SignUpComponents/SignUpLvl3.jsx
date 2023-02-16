import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert, TouchableHighlight, Pressable } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react'
import { OrLine, NeedAccount, HaveAccount } from './FooterLine'

export default function SignUpLvl3({ navigation }) {
  const [Pick, setPick] = useState('')

  //navigation function- based on userChoice
  const StagePick = () => {
    if (Pick == 'CareGiver') {      
      navigation.navigate('SignUpLvl4Care')
    }
    else if (Pick == 'Involved') {     
      navigation.navigate('SingUpLvl4Involved')
    }
    else {
      Alert.alert('Please pick a role')
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 30, fontWeight: '700', marginBottom: 117, marginTop: 173 }}>I am a...</Text>
      <RadioButton data={[{ name: 'CareGiver', header: 'CareGiver', body: 'I will be providing care for a patient.' }, { name: 'Involved', header: `Patient's Family Member`, body: 'I will be managing their care needs.' }]} onSelect={(name) => setPick(name)} />
      <TouchableHighlight style={styles.button} onPress={StagePick} underlayColor='#548DFF' >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableHighlight>
      {/* // </View>    */}
      <OrLine />
      <HaveAccount />
    </View>
  )
}
{/*custom radio buttons */}
function RadioButton({ data, onSelect }) {
  const [userOption, setUserOption] = useState(null);
  //for color changing affects
  const selectHandler = (value) => {
    onSelect(value);
    setUserOption(value);
  }


  return (
    <View>
      {data.map((item) => {
        return (
          <Pressable style={[styles.radio, item.name === userOption ? styles.selected : styles.unselected]} onPress={() => selectHandler(item.name)}>
            {/*button style based on state of selection= when selected, changess border color */}
            <Text style={styles.header}> {item.header}</Text>
            <Text style={styles.body}> {item.body}</Text>
          </Pressable>
        )
      }
      )}
    </View>

  )
}


const styles = StyleSheet.create({
  button: {
    width: Dimensions.get('window').width * 0.85,
    backgroundColor: '#7DA9FF',
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
    height: 45,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },

  radio: {
    justifyContent: 'center',
    height: 75,
    width: Dimensions.get('window').width * 0.85,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 24,
    padding: 16,
    
  },
  header: {
    fontSize: 20,
    color: '#548DFF',
    fontWeight: '700',
  },
  body: {
    fontSize: 16,
    color: '#9E9E9E',
  },
  unselected: {
    borderColor: '#E6EBF2',

  },
  selected: {
    borderColor: '#548DFF',
  },
})


