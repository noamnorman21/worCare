import { View, Text, StyleSheet } from 'react-native'
import { useEffect, useState } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Main from './TasksComponents/MainTasks';
import General from './TasksComponents/GeneralTasks';
import Shop from './TasksComponents/ShopTasks';
import Medicine from './TasksComponents/MedicineTasks';
import { useUserContext } from '../UserContext';
const Tab = createMaterialTopTabNavigator();

export default function Tasks() {

  const [userData, setUserData] = useState(useUserContext().userContext);
  const [userId, setUserId] = useState(useUserContext.userId);
  const [userType, setUserType] = useState(userData.userType);

  const [allPrivateTasks, setAllPrivateTasks] = useState([]);
  const [allPublicTasks, setAllPublicTasks] = useState([]);
  const [allMedicineTasks, setAllMedicineTasks] = useState([]);
  const [allShopTasks, setAllShopTasks] = useState([]);
  useEffect(() => {
    getAllPublicTasks();
  }, []);

  const getAllPrivateTasks = async (IdToSend) => {
    console.log('getAllPrivateTasks');
    let getAllPrivateTasksUrl = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Task/GetAllPrivateTasks';
    try {
      const response = await fetch(getAllPrivateTasksUrl, {
        method: 'POST',
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

  const getAllPublicTasks = async () => {
    console.log('getAllPublicTasks');
    let getAllPublicTasksUrl = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Task/GetAllTasks';
    try {
      const response = await fetch(getAllPublicTasksUrl, {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json; charset=UTF-8', }),
        body: JSON.stringify(userData.patientId),
      });
      const result = await response.json();
      setAllPublicTasks(result);
      filterTasks(result);
    } catch (error) {
      console.log('err post=', error);
    }
  }
  const filterTasks = (tasks) => {
    let filteredTasks = tasks.filter(task => task.type == false);
    setAllShopTasks(filteredTasks);
    let filteredMedicineTasks = tasks.filter(task => task.type == true);
    setAllMedicineTasks(filteredMedicineTasks);
    console.log('allShopTasks=', allShopTasks);
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
        children={() => <Main allPrivateTasks={allPrivateTasks} allTask={allPublicTasks} />}
      />
      <Tab.Screen name="General"
        children={() => <General allPrivateTasks={allPrivateTasks} />}
      />
      <Tab.Screen name="Shop" children={
        () => <Shop allShopTasks={allShopTasks
        } />
      } />
      <Tab.Screen name="Medicine" children={
        () => <Medicine allMedicineTasks={allMedicineTasks} />
      } />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'none',
    fontFamily: 'Urbanist-Regular',
  }
})