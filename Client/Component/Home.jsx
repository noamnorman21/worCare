import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView, Modal, Dimensions, ScrollView, LayoutAnimation } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TaskView from './HelpComponents/TaskView';
import { useUserContext } from '../UserContext';
import { AddBtn, NewTaskModal } from './HelpComponents/AddNewTask'
import { Ionicons } from '@expo/vector-icons';
import { Agenda, CalendarProvider } from 'react-native-calendars';
import moment from 'moment';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Home({ navigation }) {
  const apiKey = 'fdf856faf8cb830c2424ab225e9f9d121050e2b3'; // Replace with your Calendarific API key
  const [modalVisible, setModalVisible] = useState(false);
  const [headerToday, setHeaderToday] = useState(false);
  const [userData, setUserData] = useState(useUserContext().userContext);
  const [userId, setUserId] = useState(useUserContext.userId);
  const { getAllPublicTasks, getAllPrivateTasks, allPublicTasks, allPrivateTasks } = useUserContext();
  const [userType, setUserType] = useState(userData.userType);
  const [allTasks, setAllTasks] = useState([])
  const [todayTasks, setTodayTasks] = useState([])
  const arrowIcon = ["chevron-down-outline", "chevron-up-outline"];
  const [holidays, setHolidays] = useState([]);
  const agendaItems = {};

  useEffect(() => {
    filterTasks(allPrivateTasks, allPublicTasks)
    fetchHolidays();
  }, [allPrivateTasks, allPublicTasks])

  const fetchHolidays = async () => {
    const country = ['IL', 'US']; // Replace with your country code

    country.forEach((c) => {
      getHolidays(c);
    });
  };

  const getHolidays = async (country) => {
    const year = moment().year(); // Get the current year
    const url = `https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=${country}&year=${year}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      const holidays = data.response.holidays.map((holiday) => ({
        date: holiday.date.iso,
        name: holiday.name,
        type: holiday.type,
      }));
      setHolidays((prev) => [...prev, ...holidays]);
    } catch (error) {
      console.error('Error fetching holidays:', error);
    }
  };

  holidays.forEach((holiday) => {
    const date = moment(holiday.date).format('YYYY-MM-DD');
    if (!agendaItems[date]) {
      agendaItems[date] = [];
    }
    agendaItems[date].push({ name: holiday.name });
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
    setTodayTasks(todayTasks)
  }

  const handleAddBtnPress = () => {
    // setModalVisible(true);
    console.log(userData.calendarCode)
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
        <CalendarProvider>
          <Agenda
            renderEmptyData={() => (
              <ScrollView>
                <Text style={{ textAlign: 'center', marginTop: 20 }}>
                  There are no holidays today...
                </Text>
              </ScrollView>
            )}
            items={agendaItems}
            renderItem={(item, isFirst) => (
              <TouchableOpacity style={styles.item}>
                <Text style={styles.itemText}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </CalendarProvider>
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
    flex: 15,
    width: '100%',
    backgroundColor: '#EEF4FF',
  },
  tasksViewContainer: {
    flex: 24,
    width: SCREEN_WIDTH,
  },
  headerForTasks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 15,
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
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  itemText: {
    color: '#888',
    fontSize: 16,
  }
});
