import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { AddBtn, NewTaskModal } from '../HelpComponents/NewTaskModal'

export default function MedicineTasks() {
   const [modalVisible, setModalVisible] = useState(false)
   const handleAddBtnPress = () => {
      setModalVisible(true);
   };

   const handleModalClose = () => {
      setModalVisible(false);
   };

   return (
      <SafeAreaView style={styles.container}>
         <View>
            <Text>Medicine Tasks</Text>
         </View>
         <View style={styles.addBtnView}>
            <AddBtn onPress={handleAddBtnPress} />
         </View>
         <NewTaskModal isVisible={modalVisible} onClose={handleModalClose} />
      </SafeAreaView>
   )
}

// Path: Component\TasksComponents\MedicineTasks.jsx

const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
   },
   addBtn: {
      width: 54,
      height: 54,
      borderRadius: 54,
      backgroundColor: '#548DFF',
      alignItems: 'center',
      justifyContent: 'center',
      // drop shadow
      shadowColor: '#548DFF',
      shadowOffset: {
         width: 3,
         height: 3,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
   },
   txtAddBtn: {
      fontSize: 30,
      color: '#fff',
      fontFamily: 'Urbanist-SemiBold',
      justifyContent: 'center',
      alignItems: 'center',
   },
   addBtnView: {
      position: 'absolute',
      bottom: 30,
      right: 20,
   }
})