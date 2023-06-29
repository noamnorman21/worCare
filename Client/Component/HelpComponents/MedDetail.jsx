import { View, Text, Dimensions, TouchableOpacity, Image, Alert, StyleSheet, TextInput, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import { useUserContext } from '../../UserContext';
import { useIsFocused } from '@react-navigation/native';
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import { Overlay } from '@rneui/themed';
import * as WebBrowser from 'expo-web-browser';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function MedDetail({ navigation, route }) {
   const medTypeIcon = route.params.medTypeIcon;
   const runlow = route.params.runlow;
   const task = route.params.task;
   const backGroundColorIcon = ["#D0DFFF", "rgba(255, 60, 60, 0.25)"];
   const isFocused = useIsFocused();
   const radioIcon = ["circle", "check-circle"]
   const [commentModalVisible, setCommentModalVisible] = useState(false);
   const [visible, setVisible] = useState(false);
   const [isPause, setIsPause] = useState(false);
   const [visiblePause, setVisiblePause] = useState(false);
   const [visibleTakeExtraValue, setVisibleTakeExtraValue] = useState(false);
   const [visibleTakeExtra, setVisibleTakeExtra] = useState(false);
   const [visibleEditMed, setVisibleEditMed] = useState(false);
   const [sameChecked, setSameChecked] = useState(false);
   const [differentDosage, setDifferentDosage] = useState(true);
   const [takeExtraValue, setTakeExtraValue] = useState(0);
   const [newDosege, setNewDosege] = useState(0);
   const [visibleLogRefill, setVisibleLogRefill] = useState(false);
   const [differentRefill, setDifferentRefill] = useState(true);
   const [refillValue, setRefillValue] = useState(0);
   const { UpdateDrugForPatientDTO, getAllPublicTasks } = useUserContext();
   const [userData, setUserData] = useState(useUserContext().userContext);
   const [differentEdit, setDifferentEdit] = useState(true);
   const [editValue, setEditValue] = useState(0);
   const { refreshPublicTask } = route.params;
   const timeInDay = route.params.timeInDay;
   const taskDate = task.drug.toDate;
   const dateString = taskDate.split('T')[0];

   useEffect(() => {
      if (isFocused) {
         route.params.changeHeader("none")
      }
      else {
         route.params.changeHeader("flex")
      }
   }, [isFocused])

   const openUrl = async (url) => {
      await WebBrowser.openBrowserAsync(url);
   }

   const openModal = (value) => {
      if (value == 1) {
         let url = task.drug.drugUrl
         if (userData.userType == "Caregiver") {
            url = task.drug.drugUrlEn
         }
         openUrl(url)
      }
      else if (value == 2) {
         console.log("add instruction")
         toggleOverlayEditMed()
      }
      if (value == 3) {
         toggleOverlayPause()
      }
      if (value == 4) {
         toggleOverlay()
      }
   }

   const toggleOverlayPause = () => {
      setVisiblePause(!visiblePause);
   };

   const toggleOverlay = () => {
      setVisible(!visible);
   };

   const toggleOverlayTakeExtra = () => {
      setVisibleTakeExtra(!visibleTakeExtra);
   };

   const toggleOverlayRefill = () => {
      setVisibleLogRefill(!visibleLogRefill);
   };

   const toggleOverlayEditMed = () => {
      setVisibleEditMed(!visibleEditMed)
   };

   const deleteMed = () => {
      console.log("Delete Medicine")
      let newDrugForPatient = {
         drugId: task.drug.drugId,
         listId: task.listId,
         patientId: task.patientId,
         //lastTakenDate will be now time in Israel
         toDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
      }
      UpdateDrugForPatientDTO(newDrugForPatient)
      getAllPublicTasks(userData)
      toggleOverlay()
   }

   const pauseMed = () => {
      setIsPause(!isPause)
      if (isPause) {
         console.log("Resume Medicine")
      }
      else {
         console.log("Pause Medicine")
      }
      toggleOverlayPause()
   }

   const takeExtraMed = () => {
      if (differentDosage) {
         setTakeExtraValue(task.drug.dosage)
         console.log(takeExtraValue, "takeExtraValue")
      }
      else if (isNaN(takeExtraValue) || takeExtraValue <= 0 || takeExtraValue > 5) {
         Alert.alert("Invalid input", "Please enter a number for the new dosage");
      }
      let newDrugForPatient = {
         qtyInBox: task.drug.qtyInBox - takeExtraValue,
         drugId: task.drug.drugId,
         listId: task.listId,
         patientId: task.patientId,
         //lastTakenDate will be now time in Israel
         lastTakenDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
      }
      UpdateDrugForPatientDTO(newDrugForPatient)
      setVisibleTakeExtra(false)
      // getAllPublicTask(userData)
      // refreshPublicTask()
   }

   const logRefill = () => {
      let addNum = 0
      if (differentRefill) {
         // setRefillValue(task.drug.minQuantity*5)
         addNum = task.drug.minQuantity * 5
      }
      else if (isNaN(refillValue) || refillValue <= 0) {
         Alert.alert("Invalid input", "Please enter a number for the new dosage");
      }
      else {
         addNum = refillValue
         addNum = parseInt(addNum)
      }
      let newDrugForPatient = {
         qtyInBox: task.drug.qtyInBox + addNum,
         drugId: task.drug.drugId,
         listId: task.listId,
         patientId: task.patientId,
      }
      UpdateDrugForPatientDTO(newDrugForPatient)
      setVisibleLogRefill(false)
   }

   const editMed = () => {
      let newDrugForPatient = {
         drugId: task.drug.drugId,
         listId: task.listId,
         patientId: task.patientId,
         toDate: taskDate,
         dosage: task.drug.dosage,
         qtyInBox: task.drug.qtyInBox,
         frequency: task.frequency,
      }



      UpdateDrugForPatientDTO(newDrugForPatient)
      toggleOverlayEdit()
   }

   return (
      <View style={styles.container}>
         <View style={styles.headerContainer}>

            <TouchableOpacity style={styles.leftHeaderContainer} onPress={() => navigation.goBack()} >
               <Feather name="chevron-left" size={32} color="black" />
               <Text style={styles.headerTxt}>Med List</Text>
            </TouchableOpacity>

            <View style={styles.rightHeaderContainer}>
               <Menu style={{ flexDirection: 'column', marginVertical: 0 }} onSelect={value => openModal(value)} >
                  <MenuTrigger children={<View><Feather name="more-horizontal" size={32} color="#000" /></View>} />
                  <MenuOptions customStyles={{ optionsWrapper: styles.optionsWrapperOpened }}  >
                     <MenuOption value={1} children={<View style={styles.options}><Feather name='eye' size={20} /><Text style={styles.optionsText}>Show Leaflet</Text></View>} />
                     <MenuOption value={2} children={<View style={styles.options}><Feather name='edit-3' size={20} /><Text style={styles.optionsText}>Edit this Med</Text></View>} />
                     {/* <MenuOption value={3} children={<View style={styles.options}><Feather name={isPause ? 'play-circle' : 'pause-circle'} size={20} /><Text style={styles.optionsText}>{isPause ? 'Resume this med' : 'Pause this med'}</Text></View>} /> */}
                     <MenuOption value={4} children={<View style={styles.options}><Feather name='trash-2' size={20} color='#FF3C3C' /><Text style={[styles.optionsText, { color: '#FF3C3C' }]}>Delete this med</Text></View>} />
                  </MenuOptions>
               </Menu>
            </View>
         </View>

         <View style={styles.medDetailContainer}>
            <View style={styles.iconContainer} >
               <View style={[styles.icon, { backgroundColor: backGroundColorIcon[0] }]} >
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
            <Text style={styles.detailsTxt}>End Date : {dateString}</Text>
            {/* {
               runlow && // need to change for if there is instruction
               <Text style={styles.detailsTxt}>Instruction : </Text>
            } */}
            {/* <View>
               <Image source={medTypeIcon} style={{ width: 100, height: 100, marginTop: 20, alignItems: 'center', justifyContent: 'center' }} />
            </View> */}
         </View>

         <View style={styles.bottomContainer}>
            <TouchableOpacity style={styles.bottomBtn} onPress={toggleOverlayRefill}>
               <Text style={styles.bottomBtnTxt}>Log A Refill</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.bottomBtn} onPress={toggleOverlayTakeExtra}>
               <Text style={styles.bottomBtnTxt}>Take Extra Dose</Text>
            </TouchableOpacity>
         </View>

         {/* Delete med */}
         <Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={{ width: 300, height: 250, borderRadius: 20 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
               <View style={{ flex: 0.85, justifyContent: 'center', alignItems: 'center' }}>
                  <Feather name='alert-triangle' size={30} color='#FF3C3C' />
                  <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 20, marginVertical: 10, textAlign: 'center' }}>Are you sure you want to delete this med ?</Text>
                  <Text style={{ fontFamily: 'Urbanist-Medium', fontSize: 15, textAlign: 'center', marginVertical: 10 }}>*Tip: You can pause this med instead</Text>
               </View>
               <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                  <TouchableOpacity style={{ backgroundColor: '#FF3C3C', width: 120, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 20 }} onPress={toggleOverlay}>
                     <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 16, color: '#fff' }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ backgroundColor: '#fff', width: 120, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#FF3C3C' }} onPress={deleteMed}>
                     <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 16, color: '#FF3C3C' }}>Delete Med</Text>
                  </TouchableOpacity>
               </View>
            </View>
         </Overlay>

         {/* Pause Med */}
         <Overlay isVisible={visiblePause} onBackdropPress={toggleOverlayPause} overlayStyle={{ width: 300, height: 250, borderRadius: 20 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
               <View style={{ flex: 0.85, justifyContent: 'center', alignItems: 'center' }}>
                  <Feather name='alert-triangle' size={30} color='#FF3C3C' />
                  <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 20, marginVertical: 10, textAlign: 'center' }}>Pause</Text>
                  <Text style={{ fontFamily: 'Urbanist-Medium', fontSize: 18, marginVertical: 10, textAlign: 'center' }}>Are you sure you want to pause this medicine ?</Text>
               </View>
               <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                  <TouchableOpacity style={{ backgroundColor: '#FF3C3C', width: 120, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 20 }} onPress={toggleOverlayPause}>
                     <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 16, color: '#fff' }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ backgroundColor: '#fff', width: 120, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#FF3C3C' }} onPress={pauseMed}>
                     <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 16, color: '#FF3C3C' }}>Pause</Text>
                  </TouchableOpacity>
               </View>
            </View>
         </Overlay>

         {/* Take Extra Med */}
         <Overlay isVisible={visibleTakeExtra} onBackdropPress={toggleOverlayTakeExtra} overlayStyle={{ width: 300, height: 300, borderRadius: 20 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
               <View style={{ flex: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                  <Ionicons name="medical-outline" size={30} color="black" />
                  <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 20, marginVertical: 10, textAlign: 'center' }}>Take Extra Dose</Text>
               </View>
               <View>
                  <View>
                     <View style={styles.sameDosContainer}>
                        <TouchableOpacity style={styles.dosBtn} onPress={() => setDifferentDosage(true)}>
                           <Feather name={!differentDosage ? radioIcon[0] : radioIcon[1]} size={25} color='#7DA9FF' style={{ marginRight: 10 }} />
                           <Text style={styles.extraTxt}>Same dosage</Text>
                        </TouchableOpacity>
                     </View>
                     <View style={styles.diffDosContainer}>
                        <TouchableOpacity style={styles.dosBtn} onPress={() => setDifferentDosage(false)}>
                           <Feather name={differentDosage ? radioIcon[0] : radioIcon[1]} size={25} color='#7DA9FF' />
                           <Text style={[styles.extraTxt, { marginHorizontal: 10 }]}>Different dosage</Text>
                        </TouchableOpacity>
                        {!differentDosage && (
                           <>
                              <TextInput
                                 style={{ width: SCREEN_WIDTH * 0.2, borderBottomColor: '#7DA9FF', borderBottomWidth: 1.5, textAlign: 'center', fontFamily: 'Urbanist-Regular', marginLeft: 20 }}
                                 onChangeText={text => setTakeExtraValue(text)}
                                 value={takeExtraValue}
                                 placeholder='type here...'
                                 keyboardType='numeric'
                                 returnKeyType='done'
                              />
                           </>
                        )}
                     </View>
                  </View>
               </View>
               <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: SCREEN_WIDTH * 0.70, marginVertical: 10 }}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={toggleOverlayTakeExtra}>
                     <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 16, color: '#fff' }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.okBtn} onPress={takeExtraMed}>
                     <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 16, color: '#7DA9FF' }}>Okay</Text>
                  </TouchableOpacity>
               </View>
            </View>
         </Overlay>

         {/* Refill Med */}
         <Overlay isVisible={visibleLogRefill} onBackdropPress={toggleOverlayRefill} overlayStyle={{ width: 300, height: 300, borderRadius: 20 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
               <View style={{ flex: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                  <FontAwesome5 name="hand-holding-medical" size={30} color="black" />
                  <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 20, marginVertical: 10, textAlign: 'center' }}>Log a refill</Text>
               </View>
               <View>
                  <View>
                     <View style={styles.sameDosContainer}>
                        <TouchableOpacity style={styles.dosBtn} onPress={() => setDifferentRefill(true)}>
                           <Feather name={!differentRefill ? radioIcon[0] : radioIcon[1]} size={25} color='#7DA9FF' style={{ marginRight: 10 }} />
                           <Text style={styles.extraTxt}>Same qty?</Text>
                        </TouchableOpacity>
                     </View>
                     <View style={styles.diffDosContainer}>
                        <TouchableOpacity style={styles.dosBtn} onPress={() => setDifferentRefill(false)}>
                           <Feather name={differentRefill ? radioIcon[0] : radioIcon[1]} size={25} color='#7DA9FF' />
                           <Text style={[styles.extraTxt, { marginHorizontal: 10 }]}>Different qty</Text>
                        </TouchableOpacity>
                        {!differentRefill && (
                           <>
                              <TextInput
                                 style={{ width: SCREEN_WIDTH * 0.2, borderBottomColor: '#7DA9FF', borderBottomWidth: 1.5, textAlign: 'center', fontFamily: 'Urbanist-Regular', marginLeft: 20 }}
                                 onChangeText={text => setRefillValue(text)}
                                 value={refillValue}
                                 placeholder='type here...'
                                 keyboardType='numeric'
                                 returnKeyType='done'
                              />
                           </>
                        )}
                     </View>
                  </View>
               </View>
               <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: SCREEN_WIDTH * 0.70, marginVertical: 10 }}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={toggleOverlayRefill}>
                     <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 16, color: '#fff' }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.okBtn} onPress={logRefill}>
                     <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 16, color: '#7DA9FF' }}>Okay</Text>
                  </TouchableOpacity>
               </View>
            </View>
         </Overlay>

         {/* Edit Med */}
         <Modal presentationStyle='pageSheet' visible={visibleEditMed} onRequestClose={toggleOverlayEditMed} animationType="slide">
            <View style={{ flex: 1 }}>
               <View style={{ flex: 0.7, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 20, marginVertical: 5, textAlign: 'center' }}>Edit Medication:</Text>
                  <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 18, marginVertical: 5, textAlign: 'center' }}>{task.drug.drugNameEn}</Text>
               </View>
               <View>

               </View>
               <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: SCREEN_WIDTH * 0.975, marginVertical: 10 }}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={toggleOverlayEditMed}>
                     <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 16, color: '#fff' }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.okBtn} onPress={editMed}>
                     <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 16, color: '#7DA9FF' }}>Okay</Text>
                  </TouchableOpacity>
               </View>
            </View>
         </Modal>
      </View >
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: 'center',
   },
   extraTxt: {
      fontFamily: 'Urbanist-Regular',
      fontSize: 16,
      color: '#000',
   },
   detailsTxt: {
      fontFamily: 'Urbanist-Regular',
      fontSize: 16,
      color: '#000',
      marginVertical: 5,
   },
   iconContainer: {
      flex: 1,
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
   },
   dosBtn: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: SCREEN_WIDTH * 0.4,
      flexDirection: 'row',
      marginVertical: 10,
   },
   okBtn: {
      backgroundColor: '#fff',
      width: SCREEN_WIDTH * 0.425,
      height: 45,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: '#7DA9FF'
   },
   cancelBtn: {
      backgroundColor: '#7DA9FF',
      width: SCREEN_WIDTH * 0.425,
      height: 45,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      // marginRight: 20
   },
   diffDosContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: SCREEN_WIDTH * 0.7,
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
      flex: 1.7,
   },
   firstRowContainer: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
   },
   runningLowTxt: {
      fontSize: 14,
      fontFamily: 'Urbanist-SemiBold',
      color: '#FF3C3C',
      marginLeft: 5,
   },
   line: {
      width: '94%',
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
      bottom: -65,
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