import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import React from 'react'

export default function SignUpHobbies({ navigation}) {
  return (
    <View>
      <Text>Hobbies</Text>
      <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('SignUpLimitations') }}>
        <Text>Next</Text>
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    width: Dimensions.get('window').width * 0.9,
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
    margin: 15,
    height: 54,        
},
}
)