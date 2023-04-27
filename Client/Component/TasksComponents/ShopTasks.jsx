import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import { useState, useEffect } from 'react'
import { AddBtn, NewTaskModal } from '../HelpComponents/AddNewTask'
import { Feather, Ionicons } from '@expo/vector-icons';
import { useUserContext } from '../../UserContext'
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function ShopTasks(props) {
  const [modalVisible, setModalVisible] = useState(false)
  const [userData, setUserData] = useState(useUserContext().userContext);
  const [tasks, setTasks] = useState([])
  const [shopTasks, setShopTasks] = useState(props.allShopTasks) 
  useEffect(() => {
    // getActiveTasks()
  }, [])

  const handleAddBtnPress = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleAddingSubTask = () => {
    console.log(props.allShopTasks)
  }

  const updateCompleted = () => {
    console.log('Updating completed')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.taskName}>Super Market</Text>
      <View style={styles.tasksContainer}>
        <View style={styles.addSubTask}>
          {/* <TouchableOpacity style={styles.left} onPress={updateCompleted}>
            <Feather name="circle" size={30} color="#548DFF" />
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.middle} onPress={handleAddingSubTask}>
            <Text style={styles.subtaskTxt}>Click here to add a sub-task...</Text>
          </TouchableOpacity>
          <View style={styles.right}>
            <View style={styles.rightInside}>
              <TouchableOpacity style={styles.qtyTxt} onPress={handleAddingSubTask}>
                {/* <Text style={styles.subtaskTxt}>Qty</Text> */}
                {/* <Feather name="plus" size={30} color="#548DFF" /> */}
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconUp} onPress={handleAddingSubTask}>
                <Ionicons name="md-caret-up-outline" size={17} color="#808080" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconDown} onPress={handleAddingSubTask}>
                <Ionicons name="md-caret-down-outline" size={17} color="#808080" />
                {/* <Feather name="plus" size={30} color="#548DFF" /> */}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
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
    // justifyContent: 'center',
  },
  subtaskTxt: {
    fontSize: 16,
    fontFamily: 'Urbanist-Regular',
    color: '#808080',
    marginTop: 7,
  },
  qtyTxt: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightInside: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  left: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 0.5,
  },
  middle: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 4,
  },
  right: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    flex: 0.5,
  },
  taskName: {
    fontSize: 20,
    fontFamily: 'Urbanist-Bold',
    color: '#000',
    marginVertical: 10,
  },
  addBtnView: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  task: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    flex: 1,
  },
  addSubTask: {
    flexDirection: 'row',
    width: SCREEN_WIDTH * 0.9,
    height: 54,
    backgroundColor: '#EBF1FF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});