import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function PaymentsInner() {
  return (
    <View style={styles.container}>
      <Text>Payments</Text>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    flexDirection: 'column',
    fontFamily: 'sans-serif',
    backgroundColor: 'none',
    alignItems: 'center',
    justifyContent: 'center',
  },
})