import { View, Text, StyleSheet, SafeAreaView, Dimensions, FlatList } from 'react-native';
import React, { useEffect, useState, useMemo } from 'react';
import TaskView from './HelpComponents/TaskView';
import { useUserContext } from '../UserContext';
import { AddBtn, NewTaskModal } from './HelpComponents/AddNewTask';
import { Fontisto } from '@expo/vector-icons';
import { Agenda, CalendarProvider } from 'react-native-calendars';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const { allPublicTasks, allPrivateTasks, holidays } = useUserContext();
  const isFocused = useIsFocused();

  const allTasks = useMemo(() => {
    return filterTasks(allPrivateTasks, allPublicTasks);
  }, [allPrivateTasks, allPublicTasks]);

  const agendaItems = useMemo(() => {
    const items = {};
    holidays.forEach((holiday) => {
      const date = moment(holiday.date).format('YYYY-MM-DD');
      if (!items[date]) {
        items[date] = [];
      }
      items[date].push({ name: holiday.name, desc: holiday.desc });
    });

    allTasks.forEach((task) => {
      let today = false;
      const taskDate = moment(task.taskDate).format('YYYY-MM-DD');
      const todayDate = moment().format('YYYY-MM-DD');
      if (taskDate === todayDate) {
        today = true;
      }
      const isPrivate = task.patientId === null;

      if (!items[taskDate]) {
        items[taskDate] = [];
      }
      items[taskDate].push({ task, isPrivate, today, key: task.actualId });
    });

    return items;
  }, [allTasks, holidays]);

  useEffect(() => {
    if (isFocused) {
      filterTasks(allPrivateTasks, allPublicTasks);
    }
  }, [allPrivateTasks, allPublicTasks, isFocused]);

  function filterTasks(privateTask, publicTasks) {
    const allTasks = privateTask.concat(publicTasks);
    allTasks.sort((a, b) => {
      return a.TimeInDay > b.TimeInDay ? 1 : -1;
    });
    return allTasks;
  }

  const handleAddBtnPress = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.calendarContainer}>
        <CalendarProvider>
          <Agenda
            futureScrollRange={12}
            pastScrollRange={12}
            showOnlySelectedDayItems={true}
            refreshing={false}
            showClosingKnob={true}
            renderEmptyData={() => (
              <View>
                <Text style={styles.emptyDataText}>
                  There are no holidays or tasks today...
                </Text>
              </View>
            )}
            items={agendaItems}
            renderItem={(item) => {
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
            rowHasChanged={(r1, r2) => { return r1.text !== r2.text; }}
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
  emptyDataText: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 20,
    fontFamily: 'Urbanist-Medium',
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
