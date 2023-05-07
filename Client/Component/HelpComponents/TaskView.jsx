import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native'
import { useState, useEffect } from 'react'
import { Feather, Octicons } from '@expo/vector-icons';


const SCREEN_WIDTH = Dimensions.get('window').width;

export default function TaskView(props) {
  return (
    <View style={styles.container}>  
     <View style={styles.taskTitle}>

     </View>
     <View style={styles.taskTitle}>

        </View>
    </View>
  )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
        width: SCREEN_WIDTH * 0.9,
        maxHeight: 300,
        flexDirection: 'row',

    },
})
