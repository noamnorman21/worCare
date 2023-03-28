import { View, Text, StyleSheet, SafeAreaView, Modal, TouchableOpacity, Dimensions } from 'react-native'
import { useState } from 'react'

function AddBtn() {
   return (
      <View style={styles.addBtn}>
         <TouchableOpacity>
            <Text style={styles.addBtnTxt}>+</Text>
         </TouchableOpacity>
      </View>
   );
}

function NewTaskModal(props) {
   const [ModalVisible, setModalVisible] = useState(false)
   return (
      <SafeAreaView>
         <Modal visible={props.isVisible} presentationStyle='formSheet' animationType="slide" >
            <View style={styles.centeredView}>
               <View style={styles.modalView}>
                  <Text style={styles.modalText}>Hello World!</Text>
                  <View style={styles.btnModal}>
                     <TouchableOpacity
                        style={styles.SaveBtn}
                        onPress={() => {
                           setModalVisible(!props.isVisible);
                        }}
                     >
                        <Text style={styles.textStyle}>Save</Text>
                     </TouchableOpacity>

                     <TouchableOpacity
                        style={styles.closeBtn}
                        onPress={() => {
                           setModalVisible(!props.isVisible);
                        }}
                     >
                        <Text style={styles.closeTxt}>Cancel</Text>
                     </TouchableOpacity>
                  </View>
               </View>
            </View>
         </Modal>
      </SafeAreaView>
   )
}

export { NewTaskModal, AddBtn }

const styles = StyleSheet.create({
   centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
   },
   SaveBtn: {
      backgroundColor: '#548DFF',
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      height: 44,
      width: Dimensions.get('window').width * 0.45,
   },
   btnModal: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
      width: Dimensions.get('window').width * 0.95,
   },
   closeBtn: {
      backgroundColor: '#F5F8FF',
      borderRadius: 16,
      height: 44,
      width: Dimensions.get('window').width * 0.45,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: '#548DFF',
   },
   textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
   },
   modalText: {
      marginBottom: 15,
      textAlign: 'center',
   },
   closeTxt: {
      color: '#548DFF',
      fontWeight: 'bold',
      textAlign: 'center',
   },
   addBtn: {
      backgroundColor: '#548DFF',
      borderRadius: 54,
      height: 54,
      width: 54,
      justifyContent: 'center',
      alignItems: 'center',
   },
   addBtnTxt: {
      color: 'white',
      fontSize: 30,
      fontWeight: 'bold',
   }
})