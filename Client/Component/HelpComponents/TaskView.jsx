import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native'
import { useState, useEffect } from 'react'
import { Feather, Octicons } from '@expo/vector-icons';


const SCREEN_WIDTH = Dimensions.get('window').width;

export default function TaskView(props) {
  return (
    <View style={styles.container}>  
     <View style={styles.taskTitle}>
     <View style={styles.icon} >

     </View>
     <View style={styles.taskDetails}>
        
        </View>
     </View>
     <View style={styles.taskComment}>
        <Text style={styles.txtTaskComment}>kjsfjh sdflkjf sdfslk sflkj sfklj  sdflkj dfljk  sdflkj df </Text>


        </View>
    </View>
  )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: SCREEN_WIDTH * 0.9,
        maxHeight: 300,
        flexDirection: 'column',

    },
    txtTaskComment: {
        fontSize: 16 ,
        fontFamily: 'Urbanist-SemiBold',
        color: '#000',
        paddingLeft: 20,
    },
    taskComment: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'blue',
        width: SCREEN_WIDTH * 0.9,
        flexDirection: 'row',
    },
    taskTitle: {
        flex: 1,
        alignItems: 'center',   
        justifyContent: 'center',
       // backgroundColor: 'green',
        width: SCREEN_WIDTH * 0.9,
        maxHeight: 300,
        flexDirection: 'row',
    },
    icon : {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
       height:'100%',
    },
    taskDetails: {
        flex: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'yellow',
        height:'100%',
    },
    

})
