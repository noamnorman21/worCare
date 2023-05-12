import { View, Text, SafeAreaView, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useState } from 'react';
import { AddBtn, AddNewMedicine } from '../HelpComponents/AddNewTask';
import MedCard from '../HelpComponents/MedCard';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import { useEffect } from 'react';
const Stack = createStackNavigator();

function MedDetail({ navigation, route }) {
   const isFocused = useIsFocused();

   useIsFocused(() => {
      console.log("isFocused")
   })

   useEffect(() => {
      if (isFocused) {
         route.params.changeHeader("none")
       
      }
      else {
         route.params.changeHeader("flex")
      }

   }, [isFocused])




   return (
      <View>
         <Text>{
            route.params.med.drug.drugName}
         </Text>

      </View>
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

   const navigateToMed = (med) => {
      navigation.navigate("MedDetail", { med: med })
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
            <Stack.Screen initialParams={{changeHeader:changeHeader}} options={{ headerShown: true }} name="MedDetail" component={MedDetail} />
         </Stack.Navigator>
      </NavigationContainer>
   );
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
