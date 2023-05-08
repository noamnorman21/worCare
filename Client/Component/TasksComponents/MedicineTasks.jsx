import { View, Text, SafeAreaView, StyleSheet } from 'react-native'
import { useState } from 'react'
import { AddBtn, AddNewMedicine } from '../HelpComponents/AddNewTask'
import MedCard from '../HelpComponents/MedCard';

export default function MedicineTasks(props) {
   const [modalVisible, setModalVisible] = useState(false)
   const handleAddBtnPress = () => {   
      setModalVisible(true);
   };

   const handleModalClose = () => {
      setModalVisible(false);
      props.refreshPublicTask()
      props.refreshPrivateTask()
   };

   return (
      <SafeAreaView style={styles.container}>
         <View>
          <MedCard/>
         </View>
         <View style={styles.addBtnView}>
            <AddBtn onPress={handleAddBtnPress} />
         </View>
         <AddNewMedicine isVisible={modalVisible} onClose={handleModalClose} />
      </SafeAreaView>
   )
}

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