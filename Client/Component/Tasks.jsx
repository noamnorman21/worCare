import { StyleSheet, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { useUserContext } from '../UserContext';
import { MenuProvider } from "react-native-popup-menu";

import Main from './TasksComponents/MainTasks';
import General from './TasksComponents/GeneralTasks';
import Shop from './TasksComponents/ShopTasks';
import Medicine from './TasksComponents/MedicineTasks';

const Tab = createMaterialTopTabNavigator();

export default function Tasks() {
  const { userContext, userId, getAllPublicTasks, getAllPrivateTasks, allPublicTasks, allPrivateTasks, GetAllDrugs } = useUserContext();
  const [userType, setUserType] = useState(userContext.userType);
  const [allMedicineTasks, setAllMedicineTasks] = useState([]);
  const [allShopTasks, setAllShopTasks] = useState([]);
  const [showHeader, setShowHeader] = useState("flex");

  useEffect(() => {
    filterTasks(allPublicTasks);
    GetAllDrugs();
  }, [allPublicTasks, allPrivateTasks]);

  const filterTasks = (tasks) => {
    const filteredTasks = tasks.filter(task => task.type === false);
    setAllShopTasks(filteredTasks);
    const filteredMedicineTasks = tasks.filter(task => task.type === true && isTodayTask(task));
    filteredMedicineTasks.sort((a, b) => new Date(a.taskDate) - new Date(b.taskDate));
    setAllMedicineTasks(filteredMedicineTasks);
  }

  const isTodayTask = (task) => {
    const today = new Date();
    const taskDate = new Date(task.taskDate);
    return taskDate.getDate() === today.getDate() && taskDate.getMonth() === today.getMonth() && taskDate.getFullYear() === today.getFullYear();
  }

  const refreshPublicTask = () => {
    getAllPublicTasks(userContext);
    filterTasks(allPublicTasks);
  }

  const refreshPrivateTask = () => {
    getAllPrivateTasks(userContext);
  }

  const changeHeader = (header) => {
    setShowHeader(header);
  }

  return (
    <MenuProvider customStyles={{
      optionsContainer: {
        borderRadius: 0,
        elevation: 100,
      },
    }}>
      <Tab.Navigator
        initialRouteName="Main"
        screenOptions={{
          tabBarStyle: { backgroundColor: 'transparent', width: 'auto', display: showHeader, },
          tabBarPressColor: '#548DFF',
          tabBarPressOpacity: 0.5,
          tabBarLabelStyle: {
            marginTop: 15,
            height: 25,
            fontSize: 15,
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
        <Tab.Screen name="General" children={() => <General allPrivateTasks={allPrivateTasks} allPublicTasks={allPublicTasks}  refreshPrivateTask={refreshPrivateTask} refreshPublicTask={refreshPublicTask} />} />
        <Tab.Screen name="Shop" children={() => <Shop allShopTasks={allShopTasks} refreshPublicTask={refreshPublicTask} refreshPrivateTask={refreshPrivateTask} />} />
        <Tab.Screen name="Medicine" children={() => <Medicine changeHeader={changeHeader} allMedicineTasks={allMedicineTasks} refreshPublicTask={refreshPublicTask} refreshPrivateTask={refreshPrivateTask} />} />
      </Tab.Navigator>
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'none',
    fontFamily: 'Urbanist-Regular',
  }
});
