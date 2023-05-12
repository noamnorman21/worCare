import { View, Text, StyleSheet } from 'react-native'
import { useEffect, useState } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import Main from './TasksComponents/MainTasks';
import General from './TasksComponents/GeneralTasks';
import Shop from './TasksComponents/ShopTasks';
import Medicine from './TasksComponents/MedicineTasks';
import { useUserContext } from '../UserContext';
import React from 'react';

const Tab = createMaterialTopTabNavigator();

export default function Tasks() {
  const [userData, setUserData] = useState(useUserContext().userContext);
  const [userId, setUserId] = useState(useUserContext.userId);
  const { getAllPublicTasks, getAllPrivateTasks, allPublicTasks, allPrivateTasks } = useUserContext();
  const [userType, setUserType] = useState(userData.userType);
  const [allMedicineTasks, setAllMedicineTasks] = useState([]);
  const [allShopTasks, setAllShopTasks] = useState([]);
  const[showHeader,setShowHeader]=useState("flex");


  useEffect(() => {
    getAllPublicTasks();
    getAllPrivateTasks();
  }, []);


  //filter tasks by type, medicine or shop, other tasks will be in allTasks
  useEffect(() => {
    filterTasks(allPublicTasks);
  }, [allPublicTasks]);

  const filterTasks = (tasks) => {
    let filteredTasks = tasks.filter(task => task.type == false);
    setAllShopTasks(filteredTasks);
    let filteredMedicineTasks = tasks.filter(task => task.type == true);
    //save only today tasks
    filteredMedicineTasks = filteredMedicineTasks.filter(task => {
      let today = new Date()
      let taskDate = new Date(task.taskDate)
      return taskDate.getDate() == today.getDate() && taskDate.getMonth() == today.getMonth() && taskDate.getFullYear() == today.getFullYear()
    })
    //sort by time from erliest to latest
    filteredMedicineTasks.sort((a, b) => {
      let aTime = new Date(a.taskDate);
      let bTime = new Date(b.taskDate);
      return aTime - bTime;
    })



    setAllMedicineTasks(filteredMedicineTasks);
  }
  const moveScreens = (task) => {
    alert(task.taskId);
  }
  const refreshPublicTask = () => {
    getAllPublicTasks(userData);
  }
  const refreshPrivateTask = () => {
    getAllPrivateTasks(userData);
  }
  const changeHeader=(header)=>{
    setShowHeader(header);
  }

  return (
    <Tab.Navigator      
      initialRouteName="Main"
      screenOptions={{
        tabBarStyle: { backgroundColor: 'transparent', width: 'auto',display: showHeader, },
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
      <Tab.Screen name="Main" children={() => <Main allPrivateTasks={allPrivateTasks} allPublicTasks={allPublicTasks} refreshPublicTask={refreshPublicTask} refreshPrivateTask={refreshPrivateTask} />} />
      <Tab.Screen name="General" children={() => <General allPrivateTasks={allPrivateTasks} allPublicTasks={allPublicTasks} moveScreens={moveScreens} refreshPrivateTask={refreshPrivateTask} refreshPublicTask={refreshPublicTask} />} />
      <Tab.Screen name="Shop" children={() => <Shop allShopTasks={allShopTasks} refreshPublicTask={refreshPublicTask} refreshPrivateTask={refreshPrivateTask} />} />
      <Tab.Screen

        name="Medicine" children={() => <Medicine changeHeader={changeHeader} allMedicineTasks={allMedicineTasks} refreshPublicTask={refreshPublicTask} refreshPrivateTask={refreshPrivateTask} />} />
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