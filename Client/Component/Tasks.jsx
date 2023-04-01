import { View, Text, StyleSheet } from 'react-native'
import { useEffect, useState } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Main from './TasksComponents/MainTasks';
import General from './TasksComponents/GeneralTasks';
import Shop from './TasksComponents/ShopTasks';
import Medicine from './TasksComponents/MedicineTasks';

const Tab = createMaterialTopTabNavigator();

export default function Tasks() {
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userType, setUserType] = useState(null);
  const [allPrivateTasks, setAllPrivateTasks] = useState([]);
  useEffect(() => {
    getUserData();
  }, []);
  const getUserData = async () => {
    const user = await AsyncStorage.getItem('userData');
    const userData = JSON.parse(user);
    setUserId(userData.Id);
    setUserData(userData);
    setUserType(userData.userType);
    if (userData.userType === 'Caregiver') {
      console.log('userType is caregiver');
      getAllPrivateTasks(userData.Id);
    }
  }
  const getAllPrivateTasks = async (IdToSend) => {
    console.log('getAllPrivateTasks');
    let getAllPrivateTasksUrl = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Task/GetAllPrivateTasks';
    try {
      const response = await fetch(getAllPrivateTasksUrl, {
        method: 'post',
        headers: new Headers({ 'Content-Type': 'application/json; charset=UTF-8', }),
        body: JSON.stringify({ Id: IdToSend }),
      });
      const result = await response.json();
      setAllPrivateTasks(result);
      console.log('allPrivateTasks=', allPrivateTasks);
    } catch (error) {
      console.log('err post=', error);
    }
  }

  return (
    <Tab.Navigator
      initialRouteName="Main"
      screenOptions={{
        tabBarStyle: { backgroundColor: 'transparent', width: 'auto' },
        tabBarPressColor: '#548DFF',
        tabBarPressOpacity: 0.5,
        tabBarLabelStyle: {
          marginTop: 15,
          height: 25,
          fontSize: 15, // <-- change this size to 18 when we have the font family 'Urbanist'
          color: '#9E9E9E',
          fontFamily: 'Urbanist-SemiBold',
          alignItems: 'center',
          textTransform: 'none',
        },
        tabBarIndicatorStyle: {
          backgroundColor: '#548DFF',
          height: 3,
          borderRadius: 50,
        },
      }}
    >
      <Tab.Screen name="Main"
        //send allPrivateTasks to MainTasks, if userType is caregiver
        children={() => <Main allPrivateTasks={allPrivateTasks} />}
      />
      <Tab.Screen name="General" component={General} />
      <Tab.Screen name="Shop" component={Shop} />
      <Tab.Screen name="Medicine" component={Medicine} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'none',
    fontFamily: 'Urbanist',
  }
})