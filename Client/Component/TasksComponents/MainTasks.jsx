import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView, Dimensions,LayoutAnimation } from 'react-native'
import { useState, useEffect } from 'react'
import { AddBtn, NewTaskModal } from '../HelpComponents/AddNewTask'
import { Ionicons } from '@expo/vector-icons';
import TaskView from '../HelpComponents/TaskView';
import { useUserContext } from '../../UserContext';

const SCREEN_WIDTH = Dimensions.get('window').width;
export default function MainTasks(props) {
  const [modalVisible, setModalVisible] = useState(false)
  const [publicTasks, setPublicTasks] = useState([])
  const [privateTasks, setPrivateTasks] = useState([])
  const [allTasks, setAllTasks] = useState([])
  const [todayTasks, setTodayTasks] = useState([])
  const [tommorowTasks, setTommorowTasks] = useState([])
  const [headerToday, setHeaderToday] = useState(false)
  const [headerTommorow, setHeaderTommorow] = useState(true)
  const arrowIcon = ["chevron-down-outline", "chevron-up-outline"];
  const { getAllPublicTasks, getAllPrivateTasks, allPublicTasks, allPrivateTasks } = useUserContext();

  useEffect(() => {
    filterTasks(allPrivateTasks, allPublicTasks)
  }, [allPublicTasks, allPrivateTasks])

  const filterTasks = async (privateTask, publicTasks) => {
    //combine private and public tasks for today task and sort by time
    let allTasks = privateTask.concat(publicTasks)
    allTasks.sort((a, b) => {
      return a.TimeInDay > b.TimeInDay ? 1 : -1
    }
    )
    setAllTasks(allTasks)
    //filter today tasks
    let todayTasks = allTasks.filter(task => {
      let today = new Date()
      let taskDate = new Date(task.taskDate)
      return taskDate.getDate() == today.getDate() && taskDate.getMonth() == today.getMonth() && taskDate.getFullYear() == today.getFullYear()
    }
    )
    setTodayTasks(todayTasks)
    //filter all task that not today and not done
    let tommorowTasks = allTasks.filter(task => {
      let today = new Date()
      let taskDate = new Date(task.taskDate)
      return taskDate.getDate() != today.getDate() || taskDate.getMonth() != today.getMonth() || taskDate.getFullYear() != today.getFullYear()
    }
    )
    setTommorowTasks(tommorowTasks)
  }

  const handleAddBtnPress = () => {
    setModalVisible(true);
  };


  const toggleHeaderTodayView = () => {
    LayoutAnimation.easeInEaseOut(setHeaderToday(!headerToday));
    // setHeaderToday(!headerToday)
  }
  const toggleHeaderTommorowView = () => {
    LayoutAnimation.easeInEaseOut(setHeaderTommorow(!headerTommorow));
  }
  const handleModalClose = () => {
    getAllPrivateTasks();
    getAllPublicTasks();
  };

  return (
    <View style={styles.container} >
      <View style={styles.todayView}>
        <View>
          <TouchableOpacity style={styles.headerForTasks} onPress={toggleHeaderTodayView}>
            <Text style={styles.tasksTitle}>Today</Text>
            <Ionicons name={headerToday ? arrowIcon[0] : arrowIcon[1]} size={30} color="#548DFF" />
          </TouchableOpacity>
        </View>
        <ScrollView alwaysBounceVertical={false}>
          <View style={[styles.todayView, headerToday ? { display: 'none' } : {}]} >
            {
              todayTasks.map((task, index) => {
                let isPrivate = false;
                if (task.patientId == null) {
                  isPrivate = true;
                }
                return (<TaskView today={true} key={index} task={task} isPrivate={isPrivate} />)
              })
            }
          </View>
        </ScrollView>
      </View>

      <View style={[styles.TommorowView, headerToday ? { flex: 33 }:{}]}>
        <View>
          <TouchableOpacity style={styles.headerForTasks} onPress={toggleHeaderTommorowView}>
            <Text style={styles.tasksTitle}>Upcoming</Text>
            <Ionicons name={headerTommorow ? arrowIcon[0] : arrowIcon[1]} size={30} color="#548DFF" />
          </TouchableOpacity>
        </View>
        <ScrollView alwaysBounceVertical={false}>
          <View style={[styles.todayView, headerTommorow ? { display: 'none' } : {}]} >
            {
              tommorowTasks.map((task, index) => {
                let isPrivate = false;
                if (task.patientId == null) {
                  isPrivate = true;
                }
                return (<TaskView today={false} key={index} task={task} isPrivate={isPrivate} />)
              })
            }
          </View>
        </ScrollView>
      </View>

      <View style={styles.addBtnView} >
        <AddBtn onPress={handleAddBtnPress} />
      </View >
      <NewTaskModal isVisible={modalVisible} onClose={handleModalClose} />
    </View >
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
    flex: 3.6,
    width: '100%',
    marginBottom: 20,
  },
  TommorowView: {
    flex: 1.25,
    width: '100%'
  },
  addBtnView: {
    position: 'absolute',
    bottom: 15,
    right: -8,
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