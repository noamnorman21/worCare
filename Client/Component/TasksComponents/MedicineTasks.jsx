import { View, Text, SafeAreaView, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useState, useEffect } from 'react';

import { AddBtn, AddNewMedicine } from '../HelpComponents/AddNewTask';
import MedCard from '../HelpComponents/MedCard';
import MedDetail from '../HelpComponents/MedDetail';
import { useUserContext } from '../../UserContext';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';

const Stack = createStackNavigator();
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

function MedTask({ navigation, route }) {
   const [modalVisible, setModalVisible] = useState(false)
   const { getAllPublicTasks, userContext, allMedicineTasks } = useUserContext()
   const [userData, setUserData] = useState(useUserContext().userContext);

   useEffect(() => { }, [allMedicineTasks])

   const handleAddBtnPress = () => {
      setModalVisible(true);
   };

   const handleModalClose = () => {
      setModalVisible(false);
      getAllPublicTasks(userData);
   };

   const navigateToMed = (task, runlow, medTypeIcon, timeInDay) => {
      navigation.navigate("MedDetail", { task: task, runlow: runlow, medTypeIcon: medTypeIcon, timeInDay: timeInDay })
   }

   return (
      <SafeAreaView style={styles.container}>
         <View>
            <ScrollView alwaysBounceVertical={false}>
               {
                  allMedicineTasks.map((medicine, index) => {
                     return (<MedCard key={index} task={medicine} navigateToMed={navigateToMed} />)
                  })
               }
            </ScrollView>
         </View>
         <View style={styles.addBtnView}>
            <AddBtn onPress={handleAddBtnPress} />
         </View>
         <AddNewMedicine isVisible={modalVisible} onClose={handleModalClose} />
      </SafeAreaView>
   )
}

export default function MedicineTasks(props) {
   const changeHeader = (header) => {
      props.changeHeader(header)
   }
   const refreshPublicTask = () => {
      props.refreshPublicTask()
   }

   return (
      <NavigationContainer independent={true}>
         <Stack.Navigator>
            <Stack.Screen
               options={{ headerShown: false }}
               initialParams={{ refreshPublicTask: refreshPublicTask, refreshPrivateTask: props.refreshPrivateTask, allMedicineTasks: props.allMedicineTasks }}
               name="MedTask" component={MedTask} />
            <Stack.Screen
               initialParams={{ changeHeader: changeHeader, refreshPublicTask: refreshPublicTask }}
               options={{ headerShown: false }}
               name="MedDetail" component={MedDetail} />
         </Stack.Navigator>
      </NavigationContainer>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: 'center',
   },
   detailsTxt: {
      fontFamily: 'Urbanist-Regular',
      fontSize: 16,
      color: '#000',
      marginVertical: 5,
   },
   iconContainer: {
      flex: 0.75,
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
   },
   icon: {
      backgroundColor: '#D0DFFF',
      alignItems: 'center',
      justifyContent: 'center',
      height: 48,
      width: 48,
      borderRadius: 54,
   },
   MedNameTxt: {
      fontSize: 15,
      fontFamily: 'Urbanist-SemiBold',
   },
   runningLowView: {
      backgroundColor: 'rgba(255, 60, 60, 0.25)',
      flexDirection: 'row',
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 5,
      height: 25,
      flex: 1.25,
   },
   firstRowContainer: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      // width: '100%',
   },
   runningLowTxt: {
      fontSize: 14,
      fontFamily: 'Urbanist-SemiBold',
      color: '#FF3C3C',
      marginLeft: 5,
   },
   line: {
      width: '91%',
      height: 1.5,
      backgroundColor: '#808080',
      opacity: 0.5,
      marginBottom: 20,
   },
   medMainView: {
      flex: 2.5,
      justifyContent: 'center',
      alignItems: 'flex-start',
      height: '100%',
   },
   headerContainer: {
      height: 60,
      paddingHorizontal: 10,
      marginTop: 10,
      flexDirection: 'row',
   },
   leftHeaderContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
   },
   rightHeaderContainer: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingRight: 10,
   },
   medDetailContainer: {
      flex: 1,
      width: SCREEN_WIDTH,
      flexDirection: 'row',
      marginRight: 10,
   },
   bottomBtn: {
      width: '91%',
      height: 46,
      borderRadius: 16,
      backgroundColor: '#7DA9FF',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 10,
      border: '1.5px solid #7DA9FF'
   },
   bottomBtnTxt: {
      fontSize: 16,
      fontFamily: 'Urbanist-SemiBold',
      color: '#fff',
   },
   middleContainer: {
      flex: 3.5,
      width: '91%',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
   },
   bottomContainer: {
      flex: 1.75,
      width: SCREEN_WIDTH,
      alignItems: 'center',
      justifyContent: 'center',
   },
   headerTxt: {
      fontSize: 24,
      fontFamily: 'Urbanist-SemiBold',
      marginLeft: 10,
   },
   addBtn: {
      width: 54,
      height: 54,
      borderRadius: 54,
      backgroundColor: '#548DFF',
      alignItems: 'center',
      justifyContent: 'center',
      // drop shadow
      shadowColor: '#548DFF',
      shadowOffset: {
         width: 3,
         height: 3,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
   },
   txtAddBtn: {
      fontSize: 30,
      color: '#fff',
      fontFamily: 'Urbanist-SemiBold',
      justifyContent: 'center',
      alignItems: 'center',
   },
   addBtnView: {
      position: 'absolute',
      bottom: 30,
      right: 20,
   },
   options: {
      flexDirection: 'row',
      borderBottomColor: '#80808080',
      borderBottomWidth: 0.2,
      padding: 7,
      fontFamily: 'Urbanist-Medium',
   },
   optionsWrapperOpened: {
      position: 'absolute',
      bottom: -100,
      backgroundColor: '#fff',
      borderRadius: 10,
      left: SCREEN_WIDTH * 0.07,
      elevation: 100,
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
   },
   optionsText: {
      fontFamily: 'Urbanist-Medium',
      marginLeft: 10,
      fontSize: 16,
   },
})