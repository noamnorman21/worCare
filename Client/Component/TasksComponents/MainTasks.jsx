import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TaskView from '../HelpComponents/TaskView';
import { AddBtn, NewTaskModal } from '../HelpComponents/AddNewTask';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function MainTasks(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [publicTasks, setPublicTasks] = useState(props.allPublicTasks);
  const [privateTasks, setPrivateTasks] = useState(props.allPrivateTasks);
  const [allTasks, setAllTasks] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [tommorowTasks, setTommorowTasks] = useState([]);
  const [headerToday, setHeaderToday] = useState(false);
  const [headerTommorow, setHeaderTommorow] = useState(true);
  const arrowIcon = ["chevron-down-outline", "chevron-up-outline"];
  const todayScrollViewRef = useRef(null);
  const tommorowScrollViewRef = useRef(null);

  useEffect(() => {
    setPublicTasks(props.allPublicTasks);
    setPrivateTasks(props.allPrivateTasks);
    filterTasks(props.allPrivateTasks, props.allPublicTasks);
  }, [props.allPublicTasks, props.allPrivateTasks]);

  //דוגמא לאיך לגלול, למחוק אחרי המימוש
  // useEffect(() => {
  //   if (props.scrollToIndex == undefined) {
  //     scrollToIndex(tommorowScrollViewRef, 6);
  //   }
  // }, [props.scrollToIndex]);

  const filterTasks = (privateTask, publicTasks) => {
    //combine private and public tasks for today task and sort by time
    let allTasks = privateTask.concat(publicTasks);
    allTasks.sort((a, b) => (a.TimeInDay > b.TimeInDay ? 1 : -1));
    setAllTasks(allTasks);
    //filter today tasks
    let todayTasks = allTasks.filter(task => {
      let today = new Date();
      let taskDate = new Date(task.taskDate);
      return (
        taskDate.getDate() === today.getDate() &&
        taskDate.getMonth() === today.getMonth() &&
        taskDate.getFullYear() === today.getFullYear()
      );
    });
    setTodayTasks(todayTasks);
    //filter all task that are not today and not done
    let tommorowTasks = allTasks.filter(task => {
      let today = new Date();
      let taskDate = new Date(task.taskDate);
      return (
        taskDate.getDate() !== today.getDate() ||
        taskDate.getMonth() !== today.getMonth() ||
        taskDate.getFullYear() !== today.getFullYear()
      );
    });
    //sort by date and then by time
    tommorowTasks.sort((a, b) => (a.taskDate > b.taskDate ? 1 : -1));
    setTommorowTasks(tommorowTasks);
  };

  const handleAddBtnPress = () => {
  // setModalVisible(true);
  //בינתיים לעכשיו בשביל לנסות 
  setHeaderTommorow(false);
  setHeaderToday(true);
  //awit for the animation to finish and then scroll to 5th index
  setTimeout(() => {
    scrollToIndex(tommorowScrollViewRef, 4);
  }, 100);
  };

  const toggleHeaderTodayView = () => {
    LayoutAnimation.easeInEaseOut();
    setHeaderToday(!headerToday);
  };

  const toggleHeaderTommorowView = () => {
    LayoutAnimation.easeInEaseOut();
    setHeaderTommorow(!headerTommorow);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    props.refreshPublicTask();
    props.refreshPrivateTask();
  };

  const scrollToIndex = (scrollViewRef, index) => {
    if (scrollViewRef && scrollViewRef.current) {
      const yOffset = index * 100; // Adjust this value as per your requirement
      scrollViewRef.current.scrollTo({ y: yOffset, animated: true });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.todayView}>
        <View>
          <TouchableOpacity style={styles.headerForTasks} onPress={toggleHeaderTodayView}>
            <Text style={styles.tasksTitle}>Today</Text>
            <Ionicons name={headerToday ? arrowIcon[0] : arrowIcon[1]} size={30} color="#548DFF" />
          </TouchableOpacity>
        </View>
        <ScrollView alwaysBounceVertical={false} ref={todayScrollViewRef}>
          <View style={[styles.taskList, headerToday ? { display: 'none' } : {}]}>
            {todayTasks.map((task, index) => (
              <TaskView
                today={true}
                key={index}
                task={task}
                isPrivate={task.patientId === null}
                hideDate={true}
                onLayout={() => scrollToIndex(todayScrollViewRef, index)}
              />
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={[styles.TommorowView, headerToday ? { flex: 33 } : {}]}>
        <View>
          <TouchableOpacity style={styles.headerForTasks} onPress={toggleHeaderTommorowView}>
            <Text style={styles.tasksTitle}>Upcoming</Text>
            <Ionicons name={headerTommorow ? arrowIcon[0] : arrowIcon[1]} size={30} color="#548DFF" />
          </TouchableOpacity>
        </View>
        <ScrollView alwaysBounceVertical={false} ref={tommorowScrollViewRef}>
          <View style={[styles.taskList, headerTommorow ? { display: 'none' } : {}]}>
            {tommorowTasks.map((task, index) => (
              <TaskView
                today={false}
                key={index}
                task={task}
                isPrivate={task.patientId === null}
                hideDate={false}
                onLayout={() => scrollToIndex(tommorowScrollViewRef, index)}
              />
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.addBtnView}>
        <AddBtn onPress={handleAddBtnPress} />
      </View>
      <NewTaskModal isVisible={modalVisible} onClose={handleModalClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  todayView: {
    flex: 3.6,
    width: '100%',
    marginBottom: 20,
  },
  TommorowView: {
    flex: 1.25,
    width: '100%',
  },
  addBtnView: {
    position: 'absolute',
    bottom: 20,
    right: 10,
  },
  headerForTasks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginLeft: 15,
    marginRight: SCREEN_WIDTH * 0.035,
  },
  tasksTitle: {
    fontSize: 24,
    fontFamily: 'Urbanist-Bold',
    color: '#000',
  },
  taskList: {
    marginTop: 10,
  },
});
