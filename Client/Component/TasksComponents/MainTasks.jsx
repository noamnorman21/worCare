import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { useState, useEffect } from 'react'
import { AddBtn, NewTaskModal } from '../HelpComponents/AddNewTask'

export default function MainTasks(props) {
  const [modalVisible, setModalVisible] = useState(false)
  const [publicTasks, setPublicTasks] = useState(props.allPublicTasks)
  const [privateTasks, setPrivateTasks] = useState(props.allPrivateTasks)
  const [allTasks, setAllTasks] = useState([])


  useEffect(() => {
    setPublicTasks(props.allPublicTasks)
    setPrivateTasks(props.allPrivateTasks)
    filterTasks(props.allPrivateTasks, props.allPublicTasks)
  }, [props.allPublicTasks, props.allPrivateTasks])

  const filterTasks = (privateTask, publicTasks) => {
    //combine private and public tasks and sort by date and time
    let allTasks = privateTask.concat(publicTasks);
    allTasks.sort((a, b) => {
      if (a.taskDate > b.taskDate) {
        return 1;
      }
      if (a.taskDate < b.taskDate) {
        return -1;
      }
      if (a.taskDate == b.taskDate) {
        if (a.TimeInDay > b.TimeInDay) {
          return 1;
        }
        if (a.TimeInDay < b.TimeInDay) {
          return -1;
        }
      }
      return 0;
    })
    setAllTasks(allTasks)
  }
  const handleAddBtnPress = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    props.refreshlPublicTask()
  };
  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1, width: '100%' }}>
        <View style={{ flex: 1, width: '100%' }}>
          <Text>Public Tasks</Text>
          <View style={{ flex: 1, width: '100%' }}>
            <ScrollView>
              {/* כאן יופיעו המשימות של היום  */}
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>



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