import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView, Modal, Dimensions, ScrollView, LayoutAnimation } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TaskView from './HelpComponents/TaskView';
import { useUserContext } from '../UserContext';
import { AddBtn, NewTaskModal } from './HelpComponents/AddNewTask'
import { Fontisto, Ionicons } from '@expo/vector-icons';
import { Agenda, CalendarProvider } from 'react-native-calendars';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Home({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [headerToday, setHeaderToday] = useState(false);
  const [userData, setUserData] = useState(useUserContext().userContext);
  const [userId, setUserId] = useState(useUserContext.userId);
  const { getAllPublicTasks, getAllPrivateTasks, allPublicTasks, allPrivateTasks, holidays } = useUserContext();
  const [userType, setUserType] = useState(userData.userType);
  const [allTasks, setAllTasks] = useState([])
  const agendaItems = {};
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      filterTasks(allPrivateTasks, allPublicTasks)
    }
  }, [allPrivateTasks, allPublicTasks, isFocused])

  holidays.forEach((holiday) => {
    const date = moment(holiday.date).format('YYYY-MM-DD');
    if (!agendaItems[date]) {
      agendaItems[date] = [];
    }
    agendaItems[date].push({ name: holiday.name, desc: holiday.desc });
  });

  allTasks.forEach((task) => {
    let today = false;
    // check if task is today
    let taskDate = new Date(task.taskDate)
    let todayDate = new Date()
    if (taskDate.getDate() == todayDate.getDate() && taskDate.getMonth() == todayDate.getMonth() && taskDate.getFullYear() == todayDate.getFullYear()) {
      today = true
    }
    // check if task is private
    let isPrivate = false;
    if (task.patientId == null) {
      isPrivate = true;
    }

    const date = moment(task.taskDate).format('YYYY-MM-DD');
    if (!agendaItems[date]) {
      agendaItems[date] = [];
    }
    agendaItems[date].push({ task: task, isPrivate: isPrivate, today: today, key: task.actualId });
  });

  const filterTasks = async (privateTask, publicTasks) => {
    //combine private and public tasks for today task and sort by time
    let allTasks = privateTask.concat(publicTasks)
    allTasks.sort((a, b) => {
      return a.TimeInDay > b.TimeInDay ? 1 : -1
    })
    setAllTasks(allTasks)
    //filter today tasks
    let todayTasks = allTasks.filter(task => {
      let today = new Date()
      let taskDate = new Date(task.taskDate)
      return taskDate.getDate() == today.getDate() && taskDate.getMonth() == today.getMonth() && taskDate.getFullYear() == today.getFullYear()
    })
    // setTodayTasks(todayTasks)
  }

  const handleAddBtnPress = () => {
    // setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.calendarContainer}>
        <CalendarProvider
          theme={{
            todayButtonTextColor: '#548DFF',
            todayButtonPosition: 'right',
            calendarBackground: '#000',
            textSectionTitleColor: '#fff',
            selectedDayBackgroundColor: '#548DFF',
            selectedDayTextColor: '#fff',
            todayTextColor: '#548DFF',
            dayTextColor: '#fff',
            textDisabledColor: '#fff',
            dotColor: '#548DFF',
            selectedDotColor: '#fff',
            arrowColor: '#548DFF',
          }}
        >

          <Agenda
            theme={{
              agendaKnobColor: '#548DFF',
            }}
            futureScrollRange={12}
            pastScrollRange={12}
            showOnlySelectedDayItems={true}
            refreshing={false}
            showClosingKnob={true}
            renderEmptyData={() => (
              <View>
                <Text style={{ fontSize: 15, textAlign: 'center', marginTop: 20, fontFamily: 'Urbanist-Medium' }}>
                  There are no holidays Or Tasks today...
                </Text>
              </View>
            )}
            items={agendaItems}
            renderItem={(item, firstItemInDay) => {
              {
                if (item.key == null) {
                  return (
                    <View style={styles.item}>
                      <View style={styles.itemTitle}>
                        <View style={styles.iconContainer}>
                          <View style={styles.icon}>
                            <Fontisto name="holiday-village" size={24} color="#32D081" />
                          </View>
                        </View>
                        <Text style={styles.itemTitleTxt}>
                          {item.name}
                        </Text>
                      </View>
                      <View style={styles.taskDetails}>
                      </View>
                      <View style={styles.taskComment}>
                        <Text style={styles.itemText}>
                          {item.desc}
                        </Text>
                      </View>
                      <View style={styles.line} />
                    </View>
                  )
                }
                else {
                  return (
                    <TaskView today={item.today} key={item.key} task={item.task} isPrivate={item.isPrivate} hideDate={true} />
                  )
                }
              }
            }}
            renderDay={(day, item) => { return <View />; }}
            rowHasChanged={(r1, r2) => { return r1.text !== r2.text }}
          />
        </CalendarProvider>
      </View >
      <View style={styles.addBtnView}>
        <AddBtn onPress={handleAddBtnPress} />
      </View>
      <NewTaskModal isVisible={modalVisible} onClose={handleModalClose} />
    </SafeAreaView >
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
    right: 10,
  },
  calendarContainer: {
    flex: 1,
    width: SCREEN_WIDTH,
  },
  tasksTitle: {
    fontSize: 24,
    fontFamily: 'Urbanist-Bold',
    color: '#000',

  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#333',
    color: '#fff',
  },
  item: {
    flex: 1,
    width: SCREEN_WIDTH * 0.9,
    flexDirection: 'column',
    height: 'auto',
    minHeight: 75,
    marginVertical: 7,
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
    flexDirection: 'row',
    marginLeft: 30,
  },
  icon: {
    borderRadius: 54,
    height: 54,
    width: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CCEFAB',
  },
  itemTitle: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: 'auto',
  },
  itemTitleTxt: {
    fontSize: 18,
    fontFamily: 'Urbanist-SemiBold',
    marginBottom: 5,
    color: '#000',
  },
  itemText: {
    fontSize: 16,
    fontFamily: 'Urbanist-Regular',
    color: '#000',
    marginVertical: 7,
  },
  taskComment: {
    flex: 1.5,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: SCREEN_WIDTH * 0.9,
    paddingLeft: 30,
  },
  line: {
    height: 0.5,
    backgroundColor: '#808080',
    opacity: 0.5,
    marginTop: 7,
    marginHorizontal: 30,
  },
});