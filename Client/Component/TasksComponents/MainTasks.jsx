import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import { useState, useEffect } from 'react'
import { AddBtn, NewTaskModal } from '../HelpComponents/AddNewTask'
import { Ionicons } from '@expo/vector-icons';
import TaskView from '../HelpComponents/TaskView';

const SCREEN_WIDTH = Dimensions.get('window').width;
export default function MainTasks(props) {
  const [modalVisible, setModalVisible] = useState(false)
  const [publicTasks, setPublicTasks] = useState(props.allPublicTasks)
  const [privateTasks, setPrivateTasks] = useState(props.allPrivateTasks)
  const [allTasks, setAllTasks] = useState([])
  const [headerToday, setHeaderToday] = useState(false)
  const arrowIcon = ["chevron-down-outline", "chevron-up-outline"];


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
  const toggleHeader = () => {
    setHeaderToday(!headerToday)
  }

  const handleModalClose = () => {
    setModalVisible(false);
    props.refreshlPublicTask()
    props.refreshPrivateTask()
  };
  return (
    <View style={styles.container}>
      {/* <View style={styles.todayView}>

        <View>
          <TouchableOpacity style={styles.headerForTasks} onPress={toggleHeader}>
            <Text style={styles.tasksTitle}>Today</Text>
            <Ionicons name={headerToday ? arrowIcon[0] : arrowIcon[1]} size={30} color="#548DFF" />
          </TouchableOpacity>
        </View>
        

      </View> */}



      <TaskView allTasks={allTasks} />
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
    width: SCREEN_WIDTH * 0.92,
    paddingLeft: SCREEN_WIDTH * 0.02,
    paddingVertical: 20,
  },
  todayView: {
    flex: 1, width: '100%'
  },
  addBtnView: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  headerForTasks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 10,
  },
  tasksTitle: {
    fontSize: 24,
    fontFamily: 'Urbanist-Bold',
    color: '#000',
  },
});