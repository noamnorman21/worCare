import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import { useState, useEffect } from 'react'
import { useIsFocused } from '@react-navigation/native';
import { AddBtn, NewTaskModal } from '../HelpComponents/AddNewTask'
import TaskCheckBox from '../HelpComponents/TaskCheckBox';
import { List } from 'react-native-paper';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function GeneralTasks(props) {
  const [modalVisible, setModalVisible] = useState(false)
  const [publicTasks, setPublicTasks] = useState(props.allPublicTasks)
  const [privateTasks, setPrivateTasks] = useState(props.allPrivateTasks)
  const [medicineTasks, setMedicineTasks] = useState(props.allMedicineTasks)
  const checkIcon = ["check-circle", "circle"]
  const isFocused = useIsFocused();

  useEffect(() => {
    setPublicTasks(props.allPublicTasks)
    setPrivateTasks(props.allPrivateTasks)
    setMedicineTasks(props.allMedicineTasks)
  }, [props.allPublicTasks, props.allPrivateTasks, props.allMedicineTasks])

  const handleAddBtnPress = () => {
    setModalVisible(true);
  };
  const handleModalClose = () => {
    setModalVisible(false);
    //props.refreshlPublicTask()
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ width: SCREEN_WIDTH * 0.92 }}>
        <List.Section>
          <ScrollView>
            <List.Accordion
              style={{ backgroundColor: '#F2F2F2' }}
              left={() => <Text style={styles.tasksTitle}>Next To Do</Text>}
            >
              <View style={styles.tasksView}>
                {publicTasks.map((task, index) => {
                  return (<TaskCheckBox key={index} task={task} />)
                })}
              </View>
            </List.Accordion>
          </ScrollView>
        </List.Section>
      </View>
      <View style={styles.addBtnView}>
        <AddBtn onPress={handleAddBtnPress} />
      </View>
      <NewTaskModal isVisible={modalVisible} onClose={handleModalClose} />
    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  tasksTitle: {
    fontSize: 25,
    fontFamily: 'Urbanist-Bold',
    color: '#000',
    marginBottom: 10,
  },
  addBtnView: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  tasksView: {
    width: SCREEN_WIDTH * 0.88,
    alignItems: 'flex-start',
    marginVertical: 10,
  },
});