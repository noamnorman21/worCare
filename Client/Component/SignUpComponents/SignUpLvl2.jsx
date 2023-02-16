import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { TouchableHighlight } from 'react-native-gesture-handler'

export default function SignUpLvl2({navigation}) {
  return (
    <View>
      {/* Create a View with red color */}
      <View style={{ backgroundColor: 'red' }}>
        <Text>Red View</Text>
        </View>
        {/* Create a View with green color */}
        <View style={{ backgroundColor: 'green' }}>
          <Text>Green View</Text>
        </View>
          {/* Create a View with blue color */}
          <View style={{ backgroundColor: 'blue' }}>
            <Text>Blue View</Text>
        </View>
        <View style={{justifyContent:'center', alignItems:'center'}}>  
        <TouchableHighlight style={styles.button} underlayColor='#548DFF' onPress={()=>navigation.navigate('SignUpLvl3')} >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableHighlight> 
        </View>   
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
  }
})