import { View, Text, TouchableOpacity, StyleSheet,Dimensions, Alert } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react'

export default function SignUpLvl3({navigation}) {
const [Pick, setPick] = useState('')

const StagePick= () => {
  alert(`Pick is: ${Pick}`)
  if(Pick=='Care Worker'){    
    navigation.navigate('SignUpLvl4Care')
  }
  else if (Pick=='Involved'){
    navigation.navigate('SingUpLvl4Involved')
  }
}





  return (
    <View style={{justifyContent:'center', alignItems:'center', top:30}}>
      <Text>SignUpLvl3</Text>
      <View style={{justifyContent:'center', alignItems:'center', top:40}}>  
        <TouchableOpacity style={styles.button} onPress={()=>{setPick('Involved')}} >
          <Text style={styles.buttonText}>Involved</Text>
        </TouchableOpacity> 
        <TouchableOpacity style={styles.button} onPress={()=>{setPick('Care Worker')}} >
          <Text style={styles.buttonText}>Care Worker</Text>
        </TouchableOpacity> 
        <TouchableOpacity style={styles.button} onPress={StagePick} >
          <Text style={styles.buttonText}>Next Stage</Text>
        </TouchableOpacity> 
        </View>   

    </View>
  )
}


const styles = StyleSheet.create({
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
    height: 45,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  }
})