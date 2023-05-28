import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView, Dimensions, LayoutAnimation, Alert } from 'react-native'
import { useState, useEffect } from 'react'
import { useIsFocused } from '@react-navigation/native';
import { AddBtn, NewTaskModal } from '../HelpComponents/AddNewTask'
import TaskCheckBox from '../HelpComponents/TaskCheckBox';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation from @react-navigation/native

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function GeneralTasks(props) {
  const navigation = useNavigation(); // Access the navigation object
  const [modalVisible, setModalVisible] = useState(false)
  const [publicTasks, setPublicTasks] = useState(props.allPublicTasks)
  const [privateTasks, setPrivateTasks] = useState(props.allPrivateTasks)
  const [allTasks, setAllTasks] = useState([])
  const checkIcon = ["check-circle", "circle"];
  const arrowIcon = ["chevron-down-outline", "chevron-up-outline"];
  const [header, setHeader] = useState(false)
  const [headerCompleted, setHeaderCompleted] = useState(false)
  const isFocused = useIsFocused();

  useEffect(() => {
    setPublicTasks(props.allPublicTasks)
    setPrivateTasks(props.allPrivateTasks)
    combineTasks(props.allPrivateTasks, props.allPublicTasks)
  }, [props.allPublicTasks, props.allPrivateTasks])

  const handleAddBtnPress = () => {
    setModalVisible(true);
  }

  const combineTasks = (privateTask, publicTasks) => {
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

  const handleModalClose = () => {
    setModalVisible(false);
    props.refreshPublicTask()
    props.refreshPrivateTask()
  }

  const refreshPublicTask = () => {
    props.refreshPublicTask()
  }

  const refreshPrivateTask = () => {
    props.refreshPrivateTask()
  }

  const toggleHeaderCompleted = () => {
    setTimeout(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setHeaderCompleted(!headerCompleted);
    }, 200);
  }

  const toggleHeader = () => {
    setTimeout(() => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setHeader(!header);
    }, 200);
  }

  const sendNavigtion = (task) => {
    //if it is shop task go to shop screen
    if (task.type == false) {
      navigation.navigate('Shop', { task: task });

    }
    // if it is not shop task check if medical task and go to medical screen(just today tasks)
    else if (task.type == true) {
      //check if today task
      let today = new Date();
      let taskDate = new Date(task.taskDate);
      console.log(today.getDate(), taskDate.getDate())
      if (today.getDate() == taskDate.getDate()) {
        navigation.navigate('Medicine', { task: task });
      }
    }
    //all other tasks go to main screen
    else {
      navigation.navigate('Main', { task: task });
    }

  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ width: SCREEN_WIDTH * 0.92, marginVertical: 20 }}>
        <View>
          <TouchableOpacity style={styles.headerForTasks} onPress={toggleHeader}>
            <Text style={styles.tasksTitle}>Next To Do</Text>
            <Ionicons name={header ? arrowIcon[0] : arrowIcon[1]} size={30} color="#548DFF" />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={[styles.tasksView, header ? { display: 'none' } : {}]} >
            {allTasks.map((task, index) => {
              let isPrivate = false;
              if (task.patientId == null) {
                isPrivate = true;
              }
              return (<TaskCheckBox key={index} task={task} isPrivate={isPrivate} moveScreens={sendNavigtion} refreshPublicTask={refreshPublicTask} refreshPrivateTask={refreshPrivateTask} />)
            })}
          </View>
        </ScrollView>
      </View>

      {/* <View style={{ width: SCREEN_WIDTH * 0.92, marginVertical: 20 }}>
        <View>
          <TouchableOpacity style={styles.headerForTasks} onPress={toggleHeaderCompleted}>
            <Text style={styles.tasksTitle}>Completed</Text>
            <Ionicons name={headerCompleted ? arrowIcon[0] : arrowIcon[1]} size={30} color="#548DFF" />
          </TouchableOpacity>
        </View>
      </View> */}

      <View style={styles.addBtnView}>
        <AddBtn onPress={handleAddBtnPress} />
      </View>
      <NewTaskModal isVisible={modalVisible} onClose={handleModalClose} />
    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
  headerForTasks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  tasksTitle: {
    fontSize: 24,
    fontFamily: 'Urbanist-Bold',
    color: '#000',
  },
  addBtnView: {
    position: 'absolute',
    bottom: 20,
    right: 10,
  },
  tasksView: {
    width: SCREEN_WIDTH * 0.88,
    alignItems: 'flex-start',
    marginBottom: 30,
  },
});