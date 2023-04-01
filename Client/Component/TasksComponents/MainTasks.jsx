import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { AddBtn, NewTaskModal } from '../HelpComponents/AddNewTask'

export default function MainTasks(props) {
  const [modalVisible, setModalVisible] = useState(false)
  //get all tasks from route.params
  const allPrivateTasks = props.allPrivateTasks;

  const handleAddBtnPress = () => {
    console.log('add btn pressed')
    console.log('allPrivateTasks=', allPrivateTasks);
     setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };
  return (
    <View style={styles.container}>
      <Text>
        Main Tasks
      </Text>
      {
        //all private tasks, just for test now
        allPrivateTasks.map((task, index) => {

          return <Text key={index}>"test"{index}: {task.taskName},
            {task.TimeInDay}, {task.taskDate}, {task.taskToDate}, {task.period}
            ----------------------------------------------------------------


          </Text>

        })

      }



      <View style={styles.addBtnView}>
        <AddBtn onPress={handleAddBtnPress} />
      </View>
      <NewTaskModal isVisible={modalVisible} onClose={handleModalClose} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnView: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },

});