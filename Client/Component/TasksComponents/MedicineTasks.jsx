import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Modal } from 'react-native'
import { useState } from 'react'

export default function MedicineTasks() {
   const [modalVisible, setModalVisible] = useState(false)
   return (
      <SafeAreaView style={styles.container}>
         <View>
            <Text>Medicine Tasks</Text>
         </View>

         <View style={styles.addBtnView}>
            <TouchableOpacity
               style={styles.addBtn}
               onPress={() =>
                  setModalVisible(true)
               }
            >
               <Text style={styles.txtAddBtn}>+</Text>
            </TouchableOpacity>
         </View>

         <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
               setModalVisible(!modalVisible)
            }}
         >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
               <View style={{ width: 300, height: 300, backgroundColor: '#fff', borderRadius: 10 }}>
                  <Text>Modal</Text>
                  <TouchableOpacity
                     onPress={() => setModalVisible(!modalVisible)}
                  >
                     <Text>Hide Modal</Text>
                  </TouchableOpacity>
               </View>
            </View>
         </Modal>         
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
      justifyContent: 'center',
      alignItems: 'center',
   },
   addBtnView: {
      position: 'absolute',
      bottom: 30,
      right: 20,
   }
})