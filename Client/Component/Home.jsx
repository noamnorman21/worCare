import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView, Modal, Dimensions,ScrollView,LayoutAnimation } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AddBtn, NewTaskModal } from './HelpComponents/AddNewTask'
import { Ionicons } from '@expo/vector-icons';

import TaskView from './HelpComponents/TaskView';
import { useUserContext } from '../UserContext';

const SCREEN_WIDTH = Dimensions.get('window').width;
export default function Home({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [headerToday, setHeaderToday] = useState(false);
  const [userData, setUserData] = useState(useUserContext().userContext);
  const [userId, setUserId] = useState(useUserContext.userId);
  const { getAllPublicTasks, getAllPrivateTasks, allPublicTasks, allPrivateTasks } = useUserContext();
  const [userType, setUserType] = useState(userData.userType);
  const [allTasks, setAllTasks] = useState([])
  const [todayTasks, setTodayTasks] = useState([])



  useEffect(() => {
    getAllPublicTasks(userData);
    getAllPrivateTasks(userData);
    filterTasks(allPrivateTasks, allPublicTasks)
  },[] )
  const arrowIcon = ["chevron-down-outline", "chevron-up-outline"];
  // useEffect(() => {
  //   const getData = async () => {
  //     try {
  //       const jsonValue = await AsyncStorage.getItem('userData')
  //       if (jsonValue != null) {
  //         const json = JSON.parse(jsonValue);
  //         setUserData(json);
  //       }
  //     }
  //     catch (e) {
  //       console.log(e);
  //     }
  //   };
  //   getData(allPublicTasks);
  // }, []);
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
  }

  const handleAddBtnPress = () => {
    setModalVisible(true);  
  };
  const handleModalClose = () => {
    setModalVisible(false);
  };
  const toggleHeaderTodayView = () => {
    LayoutAnimation.easeInEaseOut(setHeaderToday(!headerToday));
  }


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.calendarContainer}>
      </View >
      <View style={styles.tasksViewContainer}>
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
      <View style={styles.addBtnView}>
        <AddBtn onPress={handleAddBtnPress} />
      </View>
      <NewTaskModal isVisible={modalVisible} onClose={handleModalClose} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  addBtnView: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  calendarContainer: {
    flex: 8,
    width: '100%',
    backgroundColor: '#EEF4FF',
  },
  tasksViewContainer: {
    flex: 24,
    width: SCREEN_WIDTH ,
  },
  headerForTasks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 15,
    marginRight: 15,
  },
  tasksTitle: {
    fontSize: 24,
    fontFamily: 'Urbanist-Bold',
    color: '#000',
  },
  todayView: {
    width: '100%',
    marginBottom: 20,
    marginRight: 20,
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#333',
    color: '#fff',
  },

});