import { View, Text, StyleSheet, SafeAreaView, Modal, TouchableOpacity, Dimensions, TextInput } from 'react-native'
import { useState } from 'react'
const SCREEN_WIDTH = Dimensions.get('window').width;

function AddBtn(props) {
   return (
      <View style={styles.addBtn}>
         <TouchableOpacity onPress={props.onPress}>
            <Text style={styles.addBtnTxt}>+</Text>
         </TouchableOpacity>
      </View>
   );
}

function NewTaskModal(props) {
   const [taskName, setTaskName] = useState('')
   const [taskComment, setTaskComment] = useState('')
   const [taskFromDate, setTaskFromDate] = useState('')
   const [taskToDate, setTaskToDate] = useState('')
   const [taskFrequency, setTaskFrequency] = useState('')
   const [taskAssignee, setTaskAssignee] = useState('')
   const [taskTime, setTaskTime] = useState('')
   const [taskCategory, setTaskCategory] = useState([
      { id: 1, name: 'General', color: '#FFC0CB' },
      { id: 2, name: 'Shop', color: '#FFC0CB' },
      { id: 3, name: 'Medicines', color: '#FFC0CB' },
   ])

   const addTask = () => {
      console.log(taskName)
      console.log(taskComment)
      console.log(taskFromDate)
      console.log(taskToDate)
      console.log(taskFrequency)
      console.log(taskAssignee)
      console.log(taskTime)
      console.log(taskCategory)
   }
   return (
      <SafeAreaView>
         <Modal visible={props.isVisible} presentationStyle='formSheet' animationType='slide' onRequestClose={props.onClose}>
            <View style={styles.centeredView}>
               <View style={styles.modalView}>
                  <Text style={styles.modalText}>Add new task</Text>
                  <View style={styles.inputView}>
                     <TextInput
                        style={styles.input}
                        placeholder='Task Name'
                        placeholderTextColor='#9E9E9E'
                        onChangeText={text => setTaskName(text)}
                     />
                     <TextInput
                        style={styles.input}
                        placeholder='Category'
                        placeholderTextColor='#9E9E9E'
                        onChangeText={text => setTaskCategory(text)}
                     />
                     <TextInput
                        style={styles.input}
                        placeholder='Start Date - End Date'
                        placeholderTextColor='#9E9E9E'
                     />
                     <TextInput
                        style={styles.input}
                        placeholder='Time'
                        placeholderTextColor='#9E9E9E'
                        onChangeText={text => setTaskTime(text)}
                     />
                     <TextInput
                        style={styles.input}
                        placeholder='Frequency'
                        placeholderTextColor='#9E9E9E'
                        onChangeText={text => setTaskFrequency(text)}
                     />
                     <TextInput
                        style={styles.input}
                        placeholder='Assignees'
                        placeholderTextColor='#9E9E9E'
                        onChangeText={text => setTaskAssignee(text)}
                     />
                     <TextInput
                        style={styles.commentInput}
                        placeholder='Comment ( optional )'
                        multiline={true}
                        numberOfLines={4}
                        placeholderTextColor='#9E9E9E'
                        onChangeText={text => setTaskComment(text)}
                     />


                  </View>
                  <View style={styles.btnModal}>
                     <TouchableOpacity style={styles.SaveBtn} onPress={[props.onClose, addTask]}>
                        <Text style={styles.textStyle}>Save</Text>
                     </TouchableOpacity>

                     <TouchableOpacity style={styles.closeBtn} onPress={props.onClose}>
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
      width: SCREEN_WIDTH * 0.45,
   },
   btnModal: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
      width: SCREEN_WIDTH * 0.95,
   },
   closeBtn: {
      backgroundColor: '#F5F8FF',
      borderRadius: 16,
      height: 44,
      width: SCREEN_WIDTH * 0.45,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: '#548DFF',
   },
   textStyle: {
      color: 'white',
      fontFamily: 'Urbanist-SemiBold',
      textAlign: 'center',
      fontSize: 16,
   },
   modalText: {
      marginBottom: 15,
      fontFamily: 'Urbanist-Bold',
      fontSize: 24,
      textAlign: 'center',
   },
   closeTxt: {
      color: '#548DFF',
      textAlign: 'center',
      fontFamily: 'Urbanist-SemiBold',
      fontSize: 16,
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
      fontSize: 28,
      marginBottom: 2,
      fontFamily: 'Urbanist-SemiBold',
   },
   inputView: {
      width: SCREEN_WIDTH * 0.95,
      marginTop: 20,
   },
   input: {
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: '#E6EBF2',
      height: 54,
      width: SCREEN_WIDTH * 0.95,
      marginBottom: 15,
      paddingLeft: 20,
      fontFamily: 'Urbanist-Light',
      fontSize: 16,
   },
   commentInput: {
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: '#E6EBF2',
      height: 100,
      width: SCREEN_WIDTH * 0.95,
      marginBottom: 10,
      paddingLeft: 20,
      fontFamily: 'Urbanist-Light',
      fontSize: 16,      
   }
})