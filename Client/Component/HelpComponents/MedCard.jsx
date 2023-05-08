import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native'
import { useState, useEffect } from 'react'
import { Feather, Ionicons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function MedCard(props) {
  return (
    <View style={style.container}>
      <View style={style.timeRow}>
        <Text style={style.timeTxt}>8:00</Text>
        {/* <Text style={style.timeTxt}>{props.task.TimeInDay}</Text> */}
      </View>
      <View style={style.medDetailes}>
      <Text style={style.timeTxt}>8:00</Text>
      </View>
    </View>
  )
}
const style = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        height:85,
        width:SCREEN_WIDTH*0.9,
        flexDirection:'row',
    },
    timeRow:{
       flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:"red"
    },
    medDetailes:{
        flex:4,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:"blue"
    },

})