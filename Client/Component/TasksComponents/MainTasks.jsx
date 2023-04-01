import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native'
import { useState, useEffect } from 'react'
import { AddBtn, NewTaskModal } from '../HelpComponents/AddNewTask'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MainTasks() {
  const [userId, setUserId] = useState('');
  useEffect(() => {
    const getUserId = async () => {
      const user = await AsyncStorage.getItem('userData');
      const userData = JSON.parse(user);
      setUserId(userData.Id);
      console.log('userId= ', userId);
    }
    const getTasks = () => {
      const userDto = { Id: userId };
      console.log('userDto= ', userDto);
      const urlGet = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Task/GetAllPrivateTasks';
      fetch(urlGet, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json; charset=UTF-8',
        }),
        body: JSON.stringify({ userDto }),
      })
        .then((res) => {
          return res.json();
        }
        )
        .then((result) => {
          result.map((task) => {
            console.log('task= ', task);
          });
          // console.log(result);
        }
        )
        .catch((error) => {
          console.log('Error=', error);
        }
        );
    };

    getUserId();
    getTasks();
  }, []);

  const [modalVisible, setModalVisible] = useState(false)
  const handleAddBtnPress = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };
  return (
    <View style={styles.container}>
      <Text>Main Tasks</Text>
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
  },
  addBtnView: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },

});