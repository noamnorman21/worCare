import { View, Text, SafeAreaView, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { AddBtn, AddNewMedicine } from '../HelpComponents/AddNewTask';
import MedCard from '../HelpComponents/MedCard';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const Stack = createStackNavigator();
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

function MedDetail({ navigation, route }) {
   const timeInDay = route.params.timeInDay;
   const medTypeIcon = route.params.medTypeIcon;
   const runlow = route.params.runlow;
   const task = route.params.task;
   const backGroundColorIcon = ["#D0DFFF", "rgba(255, 60, 60, 0.25)"];
   const iconColors = ["#548DFF", "#FF3C32"]

   const isFocused = useIsFocused();
   useEffect(() => {
      if (isFocused) {
         route.params.changeHeader("none")
      }
      else {
         route.params.changeHeader("flex")
      }
   }, [isFocused])

   return (
      <View style={styles.container}>
         <View style={styles.headerContainer}>

            <TouchableOpacity style={styles.leftHeaderContainer} onPress={() => navigation.goBack()} >
               <Feather name="chevron-left" size={32} color="black" />
               <Text style={styles.headerTxt}>Med List</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.rightHeaderContainer} onPress={() => navigation.goBack()} >
               <Feather name="more-horizontal" size={32} color="black" />
            </TouchableOpacity>

         </View>

         <View style={styles.medDetailContainer}>
            <View style={styles.iconContainer} >
               <View style={[styles.icon, { backgroundColor: runlow ? backGroundColorIcon[1] : backGroundColorIcon[0] }]} >
                  <Image source={medTypeIcon} style={{ width: 25, height: 25 }} />
               </View>
            </View>

            <View style={styles.medMainView}>
               <View style={styles.firstRowContainer}>
                  <View style={styles.medName}>
                     <Text style={styles.MedNameTxt}>{task.taskName}</Text>
                  </View>
               </View>
            </View>
            {
               runlow &&
               <View style={styles.runningLowView}>
                  <Feather name="alert-triangle" size={18} color="#FF3C3C" />
                  <Text style={styles.runningLowTxt}>Running Low</Text>
               </View>
            }
         </View>
         <View style={styles.line}></View>

         <View style={styles.middleContainer}>
            <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 16, marginBottom: 7 }}>Schedule</Text>
            <Text style={styles.detailsTxt}>Frequency : {task.frequency}</Text>
            <Text style={styles.detailsTxt}>Quantity : {task.drug.dosage}</Text>
            <Text style={styles.detailsTxt}>Time : {timeInDay}</Text>
            <Text style={styles.detailsTxt}>End Date : {task.drug.toDate}</Text>
            {
               runlow && // need to change for if there is instruction
               <Text style={styles.detailsTxt}>Instruction : </Text>
            }
            <View>
               <Image source={medTypeIcon} style={{ width: 100, height: 100, marginTop: 20, alignItems: 'center', justifyContent: 'center' }} />
            </View>
         </View>

         <View style={styles.bottomContainer}>
            <TouchableOpacity style={styles.bottomBtn} onPress={() => navigation.navigate("EditMed", { task: task })}>
               <Text style={styles.bottomBtnTxt}>Log A Refill</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.bottomBtn} onPress={() => navigation.navigate("DeleteMed", { task: task })}>
               <Text style={styles.bottomBtnTxt}>Take Extra Dose</Text>
            </TouchableOpacity>
         </View>

      </View >
   )
}

function MedTask({ navigation, route }) {
   const [modalVisible, setModalVisible] = useState(false)
   const handleAddBtnPress = () => {
      setModalVisible(true);
   };

   const handleModalClose = () => {
      setModalVisible(false);
      route.params.refreshPublicTask()
      route.params.refreshPrivateTask()
   };

   const navigateToMed = (task, runlow, medTypeIcon, timeInDay) => {
      navigation.navigate("MedDetail", { task: task, runlow: runlow, medTypeIcon: medTypeIcon, timeInDay: timeInDay })
   }

   return (
      <SafeAreaView style={styles.container}>
         <View>
            <ScrollView alwaysBounceVertical={false}>
               {
                  route.params.allMedicineTasks.map((medicine, index) => {
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

   return (
      <NavigationContainer independent={true}>
         <Stack.Navigator>
            <Stack.Screen
               options={{ headerShown: false }}
               initialParams={{ refreshPublicTask: props.refreshPublicTask, refreshPrivateTask: props.refreshPrivateTask, allMedicineTasks: props.allMedicineTasks }}
               name="MedTask" component={MedTask} />
            <Stack.Screen
               initialParams={{ changeHeader: changeHeader }}
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
   }
})