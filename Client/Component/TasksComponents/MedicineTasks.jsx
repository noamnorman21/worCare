import { View, Text, SafeAreaView, StyleSheet, Dimensions, ScrollView } from 'react-native'
import { useState } from 'react'
import { AddBtn, AddNewMedicine } from '../HelpComponents/AddNewTask'
import MedCard from '../HelpComponents/MedCard';

import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

export default function MedicineTasks(props) {
   return (
      <Stack.Navigator>
         <Stack.Screen options={{ headerShown: false }} name="MedTask" children={() => <MedTask allMedicineTasks={props.allMedicineTasks} refreshPublicTask={props.refreshPublicTask} refreshPrivateTask={props.refreshPrivateTask} />} />
         {/* <Stack.Screen name="MedDetail" component={MedDetail} /> */}
      </Stack.Navigator>
   );
}

function MedDetail({ navigation, route }) {
   return (
      <View>
         <Text>Medicine Detail</Text>
      </View>
   )
}

function MedTask(props) {
   const [modalVisible, setModalVisible] = useState(false)
   const handleAddBtnPress = () => {
      setModalVisible(true);
   };

   const handleModalClose = () => {
      setModalVisible(false);
      props.refreshPublicTask()
      props.refreshPrivateTask()
   };

   const navigateToMed = (med) => {
      // props.navigation.navigate('Medicine', { med: med })
   }

   return (
      <SafeAreaView style={styles.container}>
         <View>
            <ScrollView alwaysBounceVertical={false}>
               {
                  props.allMedicineTasks.map((medicine, index) => {
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

const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
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