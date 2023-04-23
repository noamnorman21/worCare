import { Alert, View, Text, StyleSheet, SafeAreaView, Modal, TouchableOpacity, Dimensions, TextInput } from 'react-native'
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useState, useEffect } from 'react'
import { MaterialCommunityIcons, MaterialIcons, Octicons, Ionicons } from '@expo/vector-icons';
//import DateTimePicker from '@react-native-community/datetimepicker';

import { useUserContext } from '../../UserContext';
import DatePicker from 'react-native-datepicker';
import { Dropdown } from 'react-native-element-dropdown';
import DateRangePicker from "rn-select-date-range";
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from "moment";

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

function AddBtn(props) {
   return (
      <TouchableOpacity onPress={props.onPress}>
         <View style={styles.addBtn}>
            <Octicons name="plus" size={26} color="#fff" />
         </View>
      </TouchableOpacity>
   );
}

function AddNewMedicine(props) {
   //const {useUserContext} = useUserContext();
   const [userData, setUserData] = useState(useUserContext().userContext);
   const [userId, setUserId] = useState(useUserContext.userId);
   const [numberPerDay, setNumberPerDay] = useState(0)
   const [quantity, setQuantity] = useState(0)
   const [capacity, setCapacity] = useState(0)
   const [selectedFrequency, setSelectedFrequency] = useState('')
   const [medComment, setMedComment] = useState('')
   const [medFromDate, setMedFromDate] = useState(Date.now)
   const [medToDate, setMedToDate] = useState('')
   const [medTime, setMedTime] = useState('')
   const [medTimeArr, setMedTimeArr] = useState([]) //we will use this to get all the times from the user
   const [medDosage, setMedDosage] = useState('')
   const [medDosageUnit, setMedDosageUnit] = useState('')
   const [selectedRange, setRange] = useState({});
   const [modalVisibleDate, setModalVisibleDate] = useState(false);
   const [allDrugs, setAllDrugs] = useState([]);//we will use this to get all the drugs from the server
   const [selectedDrugName, setSelectedDrugName] = useState('');//we will use this to get the selected drug from the user
   const [editMode, setEditMode] = useState(true);
   const timePickers = [];

   const [modalTimesVisible, setModalTimesVisible] = useState(false);
   const medFrequencies = [
      { id: 0, name: 'Once' },
      { id: 1, name: 'Daily' },
      { id: 3, name: 'Weekly' },
      { id: 4, name: 'Monthly' },
   ]

   useEffect(() => {
      let allDrugsUrl = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Drug/GetAllDrugs';
      fetch(allDrugsUrl, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json; charset=UTF-8',
         },
      })
         .then(res => {
            if (res.ok) {
               return res.json()
            }
            else {
               console.log("not found")
            }
         })
         .then(data => {
            if (data != null) {
               //exmaple of data object: {drugId:1, drugName:"פרסקוטיקס", drugUrl:"https://www.drugs.com/images/pills/augmentin.jpg", modifyDate:"2021-05-05T00:00:00",Type:"pills"} 
               setAllDrugs(data);
            }
         })
         .catch((error) => {
            console.log("err=", error);
         });

   }, []);

   const addMed = () => {
      if (medTime != '' && medTimeArr.length == 0) {
         medTimeArr.push(medTime);
      }
      let newMedForDb = {
         drugName: selectedDrugName.drugName,
         drugId: selectedDrugName.drugId,
         timesInDayArr: medTimeArr,
         fromDate: medFromDate,
         toDate: medToDate,
         qtyInBox: capacity,
         patientId: userData.patientId,
         workerId: userData.workerId,
         userId: userData.involvedInId,
         dosage: quantity,
         taskComment: medComment,
         frequency: selectedFrequency,
         //dosageUnit: medDosageUnit, //not relevant for now
      }
      console.log(newMedForDb);

      let addMedUrl = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Task/InsertActualList';
      fetch(addMedUrl, {
         method: 'POST',
         body: JSON.stringify(newMedForDb),
         headers: {
            'Content-Type': 'application/json; charset=UTF-8',
         },
      })
         .then(res => {
            if (res.ok) {
               return res.json()
            }
            else {
               console.log("not found")
            }
         }
         )
         .then(data => {
            if (data != null) {
               console.log(data);
               clearInputs();
            }
         }
         )
         .catch((error) => {
            console.log("err=", error);
         }
         );


   }

   const clearInputs = () => {
      setNumberPerDay(0);
      setQuantity(0);
      setCapacity(0);
      setSelectedFrequency('');
      setMedComment('');
      setMedFromDate(moment().format('YYYY-MM-DD'));
      setMedToDate('');
      setMedTime('');
      setMedTimeArr([]);
      setMedDosage('');
      setMedDosageUnit('');
      setSelectedDrugName('');
      props.onClose();
   }

   const handeleDrugChange = (item) => {
      setSelectedDrugName(item);
      // להוסיף את הסוגים שאותם ניתן לספור לא רק pills
      if (item.Type != 'Pill') {
         setNumberPerDay(1);
         setQuantity(1);
         setEditMode(false);
      }
      else {
         setEditMode(true);
         setNumberPerDay(0);
         setQuantity(0);
      }
   }
   const stylesForTimeModal = StyleSheet.create({
      timePicker: {
         flexDirection: 'row',
         justifyContent: 'space-between',
         alignItems: 'center',
         width: '100%',
         marginVertical: 10,
      },
      doubleRowItem: {
         width: SCREEN_WIDTH * 0.5,
         height: 54,
         justifyContent: 'center',
         alignItems: 'center',
         borderColor: '#E6EBF2',
         borderWidth: 1.5,
         borderRadius: 16,
         padding: 5,
      }

   })

   function rowForEachTime() {
      for (let i = 0; i < numberPerDay; i++) {
         timePickers.push(
            <View key={i} style={stylesForTimeModal.timePicker}>
               <View>
                  <Text style={{ fontFamily: 'Urbanist-Light', fontSize: 16, color: '#000' }}>Time {i + 1}</Text>
               </View>
               <View>
                  <DatePicker
                     style={[stylesForTimeModal.doubleRowItem, medTimeArr[i] != null && { borderColor: '#000' }]}
                     date={medTimeArr[i]}
                     iconComponent={<MaterialCommunityIcons style={styles.addIcon} name="timer-outline" size={24} color="#808080" />}
                     placeholder="Add Time"
                     mode="time"
                     format="HH:mm"
                     is24Hour={true}
                     confirmBtnText="Confirm"
                     cancelBtnText="Cancel"
                     showIcon={true}
                     customStyles={{
                        dateInput: {
                           borderWidth: 0,
                           alignItems: 'flex-start',
                           paddingLeft: 10,
                        },
                        placeholderText: {
                           color: '#9E9E9E',
                           fontSize: 16,
                           textAlign: 'left',
                           fontFamily: 'Urbanist-Light',
                        },
                        dateText: {
                           color: '#000',
                           fontSize: 16,
                           fontFamily: 'Urbanist-SemiBold',
                        },
                     }}
                     onDateChange={(date) => {
                        let newArr = [...medTimeArr];
                        newArr[i] = date;
                        setMedTimeArr(newArr);
                     }}
                  />
               </View>
            </View>
         )
      }
      return timePickers;
   }

   const saveTimeArr = () => {
      for (let i = 0; i < timePickers.length; i++) {
         if (medTimeArr[i] == '' || medTimeArr[i] == null) {
            Alert.alert('Please Fill all the time fields');
            return;
         }
      }
      setMedTimeArr(medTimeArr);
      setModalTimesVisible(false);
   }

   return (
      <>
         <Modal visible={props.isVisible} presentationStyle='formSheet' animationType='slide' onRequestClose={props.onClose}>
            <KeyboardAvoidingView style={[styles.container, modalTimesVisible && { backgroundColor: 'rgba(0, 0, 0, 0.75)' }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
               <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                  <View style={styles.centeredView}>
                     <View style={styles.modalView}>
                        <Text style={styles.modalText}>Add new Medicine </Text>
                        {/* SEARCH MED */}
                        <View style={[styles.inputView, modalTimesVisible && { display: 'none' }]}>
                           <Dropdown
                              search={true}
                              searchPlaceholder="Search..."
                              renderLeftIcon={() => <MaterialIcons name="search" size={30} color="gray" />}
                              inputSearchStyle={styles.inputSearchStyle}
                              data={allDrugs}
                              labelField="drugName"
                              valueField="drugName"
                              placeholder="Medicine Name"
                              maxHeight={300}
                              fontFamily='Urbanist-Light'
                              // style={[styles.input, taskAssignee && { borderColor: '#000' }]}
                              style={[styles.input, { textAlign: 'center', backgroundColor: '#EEEEEE' }, selectedDrugName && { borderColor: '#000' }]}
                              itemTextStyle={styles.itemStyle}
                              placeholderStyle={styles.placeholderStyle}
                              containerStyle={styles.containerStyle}
                              value={selectedDrugName}
                              onChange={(item) => handeleDrugChange(item)}
                           />
                        </View>
                        <Text style={styles.subTitle}>More Details...</Text>
                        <View style={styles.inputView}>
                           {/* FIRST ROW */}
                           <View style={styles.doubleRow}>
                              <View style={styles.doubleRowItem}>
                                 <TouchableOpacity onPress={() =>
                                    setNumberPerDay(parseInt(numberPerDay + 1))
                                 } style={styles.arrowUp}>
                                    {/* Change icon color only onPress to #548DFF  */}
                                    <Ionicons name="md-caret-up-outline" size={17} color="#808080" />
                                 </TouchableOpacity>
                                 <TextInput
                                    style={[styles.inputNumber, numberPerDay && { textAlign: 'center' }]}
                                    placeholder="Number per day"
                                    placeholderTextColor="#9E9E9E"
                                    keyboardType='numeric'
                                    returnKeyType='done'
                                    value={numberPerDay == 0 ? '' : numberPerDay.toString()}
                                    onChangeText={text => text == '' ? setNumberPerDay(0) && setMedTime('') : setNumberPerDay(parseInt(text))}
                                 />
                                 {/* Change icon color only onPress to #548DFF  */}
                                 <TouchableOpacity style={styles.arrowDown} onPress={() => numberPerDay == 0 ? setNumberPerDay(0) : setNumberPerDay(parseInt(numberPerDay - 1))}>
                                    <Ionicons name="md-caret-down-outline" size={17} color="#808080" />
                                 </TouchableOpacity>
                              </View>
                              <Dropdown
                                 data={medFrequencies}
                                 labelField="name"
                                 valueField="name"
                                 placeholder="Frequency"
                                 fontFamily='Urbanist-Light'
                                 // style={[styles.input, taskAssignee && { borderColor: '#000' }]}
                                 style={[styles.doubleRowItem, { paddingRight: 10, paddingLeft: 10 }, selectedFrequency && { borderColor: '#000' }]}
                                 itemTextStyle={styles.itemStyle}
                                 placeholderStyle={{
                                    color: '#9E9E9E',
                                    fontSize: 16,
                                    fontFamily: 'Urbanist-Light',
                                 }}
                                 containerStyle={styles.containerMedStyle}
                                 inputSearchStyle={styles.inputSearchStyle}
                                 value={selectedFrequency}
                                 onChange={item => { setSelectedFrequency(item.name) }}
                              />
                           </View>
                           {/* SECOND ROW */}
                           <View style={styles.doubleRow}>
                              <View style={[styles.doubleRowItem, quantity && { borderColor: '#000' }]}>
                                 <TouchableOpacity style={styles.arrowUp} disabled={!editMode} onPress={() => setQuantity(parseInt(quantity + 1))}>
                                    {/* //setNumberPerDay using the function handleIncrement */}
                                    {/* Change icon color only onPress to #548DFF  */}
                                    <Ionicons name="md-caret-up-outline" size={17} color="#808080" />
                                 </TouchableOpacity>
                                 <TextInput
                                    style={[styles.inputNumber, quantity && { textAlign: 'center' }]}
                                    placeholder="Qty taken"
                                    placeholderTextColor="#9E9E9E"
                                    keyboardType='numeric'
                                    editable={editMode}
                                    returnKeyType='done'
                                    value={quantity == 0 ? '' : quantity.toString()}
                                    onChangeText={text => text == '' ? setQuantity(0) : setQuantity(parseInt(text))}
                                 />
                                 <TouchableOpacity style={styles.arrowDown} disabled={!editMode} onPress={() => quantity == 0 ? setQuantity(0) : setQuantity(parseInt(quantity - 1))}>
                                    {/* Change icon color only onPress to #548DFF  */}
                                    <Ionicons name="md-caret-down-outline" size={17} color="#808080" />
                                 </TouchableOpacity>
                              </View>
                              <View style={[styles.doubleRowItem, capacity && { borderColor: '#000' }]}>
                                 <TouchableOpacity style={styles.arrowUp} onPress={() => setCapacity(parseInt(capacity + 1))}>
                                    {/* setNumberPerDay using the function handleIncrement */}
                                    {/* Change icon color only onPress to #548DFF  */}
                                    <Ionicons name="md-caret-up-outline" size={17} color="#808080" />
                                 </TouchableOpacity>
                                 <TextInput
                                    style={[styles.inputNumber, capacity && { textAlign: 'center' }]}
                                    placeholder="Capacity In box"
                                    pointerEvents='box-none'
                                    placeholderTextColor="#9E9E9E"
                                    keyboardType='numeric'
                                    returnKeyType='done'
                                    value={capacity == 0 ? '' : capacity.toString()}
                                    onChangeText={text => text == '' ? setCapacity(0) : setCapacity(parseInt(text))}
                                 />
                                 <TouchableOpacity style={styles.arrowDown} onPress={() => capacity == 0 ? setCapacity(0) : setCapacity(parseInt(capacity - 1))}>
                                    {/* Change icon color only onPress to #548DFF  */}
                                    <Ionicons name="md-caret-down-outline" size={17} color="#808080" />
                                 </TouchableOpacity>
                              </View>
                           </View>

                           <Text style={styles.subTitle}>
                              {
                                 selectedFrequency == 'Once' ? 'Set date' : 'Set end date'
                              }

                           </Text>
                           {/* THIRD ROW */}
                           <View style={[styles.doubleRow, modalTimesVisible && { display: 'none' }]}>
                              <DatePicker
                                 useNativeDriver={'true'}
                                 iconComponent={<MaterialCommunityIcons style={styles.addIcon} name="calendar-outline" size={24} color="#808080" />}
                                 style={[styles.doubleRowItem, medToDate && { borderColor: '#000' }]}
                                 date={medToDate}
                                 mode="date"
                                 placeholder="dd/mm/yyyy"
                                 format="YYYY-MM-DD"
                                 minDate={new Date()}
                                 // maxDate={new Date()+36}
                                 confirmBtnText="Confirm"
                                 cancelBtnText="Cancel"
                                 customStyles={{
                                    dateInput: {
                                       marginLeft: 0,
                                       alignItems: 'flex-start', //change to center for android
                                       borderWidth: 0,
                                    },
                                    placeholderText: {
                                       color: "#9E9E9E",
                                       fontFamily: 'Urbanist-Light',
                                       paddingLeft: 8,
                                       fontSize: 16,
                                       textAlign: 'left',
                                    },
                                    dateText:
                                       [styles.inputNumber, medToDate && { fontFamily: 'Urbanist-Medium' }]

                                 }}
                                 onDateChange={(date) => setMedToDate(date)}
                              />
                              {numberPerDay == 0 | numberPerDay == 1 ?
                                 <View >
                                    <DatePicker
                                       style={[styles.doubleRowItem, medTime != '' && { borderColor: '#000' }]}
                                       date={medTime}
                                       iconComponent={<MaterialCommunityIcons style={styles.addIcon} name="timer-outline" size={24} color="#808080" />}
                                       placeholder="Add Time"
                                       mode="time"
                                       format="HH:mm"
                                       is24Hour={true}
                                       confirmBtnText="Confirm"
                                       cancelBtnText="Cancel"
                                       showIcon={true}
                                       customStyles={{
                                          dateInput: {
                                             borderWidth: 0,
                                             alignItems: 'flex-start',
                                             paddingLeft: 10,
                                          },
                                          placeholderText: {
                                             color: '#9E9E9E',
                                             fontSize: 16,
                                             textAlign: 'left',
                                             fontFamily: 'Urbanist-Light',
                                          },
                                          dateText: {
                                             color: '#000',
                                             fontSize: 16,
                                             fontFamily: 'Urbanist-Medium',
                                          },
                                       }}
                                       onDateChange={(date) => {
                                          setMedTime(date)
                                       }}
                                    />
                                 </View>
                                 :
                                 <View>
                                    <TouchableOpacity onPress={() => { setModalTimesVisible(true) }}>
                                       <View style={[styles.doubleRowItem, medTimeArr.length == numberPerDay && { borderColor: '#000' }]}>
                                          <Text style={[styles.inputNumber, { color: '#9E9E9E' }, medTimeArr.length == numberPerDay && { color: '#000' }]}>
                                             {numberPerDay == medTimeArr.length ? 'Times Selected' : 'Add Times'}
                                          </Text>
                                          <MaterialCommunityIcons style={styles.addIcon} name="timer-outline" size={24} color="#808080" />
                                       </View>
                                    </TouchableOpacity>
                                 </View>
                              }
                           </View>

                           {/* Modal Box For TIMES ARRAY */}
                           <View>
                              <Modal visible={modalTimesVisible} transparent={true} style={styles.modalDate} animationType='slide' onRequestClose={() => setModalTimesVisible(false)}>
                                 <View style={styles.modalTimesView}>
                                    {/* Header for add times*/}
                                    <View style={styles.modalTimesHeader}>
                                       <Text style={styles.modalText}>Select Med Times</Text>
                                    </View>
                                    {/* Body */}
                                    <View style={styles.modalTimesBody}>
                                       <View style={styles.modalTimesBodyContent}>
                                          {rowForEachTime()}
                                       </View>
                                    </View>

                                    <View style={styles.btnModalDate}>
                                       <TouchableOpacity
                                          style={styles.saveBtnDate}
                                          onPress={saveTimeArr}
                                       >
                                          <Text style={styles.textStyle}>Save</Text>
                                       </TouchableOpacity>
                                       <TouchableOpacity
                                          style={styles.closeBtnDate}
                                          onPress={() => {
                                             setMedTime('');
                                             setModalTimesVisible(false);
                                          }}
                                       >
                                          <Text style={styles.closeTxt}>Cancel</Text>
                                       </TouchableOpacity>
                                    </View>
                                 </View>
                              </Modal>
                           </View>

                        </View>
                        <TextInput
                           style={[styles.commentInput, { padding: 0 }, medComment && { borderColor: '#000' }, modalTimesVisible && { display: 'none' }]}
                           placeholder="Custom Instruction ( Optional )"
                           placeholderTextColor="#9E9E9E"
                           value={medComment}
                           multiline={true}
                           returnKeyType='done'
                           keyboardType='default'
                           numberOfLines={4}
                           onChangeText={text => setMedComment(text)}
                        />
                        <View style={[styles.btnModal, modalTimesVisible && { display: 'none' }]}>
                           <TouchableOpacity style={styles.saveBtn} onPress={addMed}>
                              <Text style={styles.textStyle}>Save</Text>
                           </TouchableOpacity>
                           <TouchableOpacity style={styles.closeBtn} onPress={clearInputs}>
                              <Text style={styles.closeTxt}>Cancel</Text>
                           </TouchableOpacity>
                        </View>
                     </View>
                  </View>
               </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
         </Modal>
      </>
   )
}

function NewTaskModal(props) {
   const [userData, setUserData] = useState(useUserContext().userContext);
   const [userId, setUserId] = useState(useUserContext.userId);
   const [userType, setUserType] = useState(userData.userType);
   const [taskName, setTaskName] = useState('')
   const [taskComment, setTaskComment] = useState('')
   const [taskFromDate, setTaskFromDate] = useState('')
   const [taskToDate, setTaskToDate] = useState('')
   const [taskFrequency, setTaskFrequency] = useState('')
   const [taskTime, setTaskTime] = useState('')
   const [taskTimeArr, setTaskTimeArr] = useState([]) //will only be used if to general tasks
   const [taskCategory, setTaskCategory] = useState('')
   const [isPrivate, setIsPrivate] = useState(false)//for the assignee
   const [taskAssignee, setTaskAssignee] = useState('')
   const [selectedRange, setRange] = useState({});
   const [taskNameBorder, setTaskNameBorder] = useState('')
   const taskCategorys = [
      { id: 1, name: 'General', color: '#FFC0CB' },
      { id: 2, name: 'Shop', color: '#FFC0CB' },
   ]
   const taskFrequencies = [
      { id: 0, name: 'Once' },
      { id: 1, name: 'Daily' },
      { id: 2, name: 'Weekly' },
      { id: 3, name: 'Monthly' },
   ]
   const privateOrPublic = [
      { id: 1, name: 'Private' },
      { id: 2, name: 'Public' },
   ]
   // Relevant only for General Task
   const [modalVisibleDate, setModalVisibleDate] = useState(false);
   const [numberPerDay, setNumberPerDay] = useState(0)
   const timePickers = [];
   const [modalTimesVisible, setModalTimesVisible] = useState(false);
   const stylesForTimeModal = StyleSheet.create({
      timePicker: {
         flexDirection: 'row',
         justifyContent: 'space-between',
         alignItems: 'center',
         width: '100%',
         marginVertical: 10,
      },
      doubleRowItem: {
         width: SCREEN_WIDTH * 0.5,
         height: 54,
         justifyContent: 'center',
         alignItems: 'center',
         borderColor: '#E6EBF2',
         borderWidth: 1.5,
         borderRadius: 16,
         padding: 5,
      }

   })

   function rowForEachTime() {
      for (let i = 0; i < numberPerDay; i++) {
         timePickers.push(
            <View key={i} style={stylesForTimeModal.timePicker}>
               <View>
                  <Text style={{ fontFamily: 'Urbanist-Light', fontSize: 16, color: '#000' }}>Time {i + 1}</Text>
               </View>
               <View>
                  <DatePicker
                     style={[stylesForTimeModal.doubleRowItem, taskTimeArr[i] != null && { borderColor: '#000' }]}
                     date={taskTimeArr[i]}
                     iconComponent={<MaterialCommunityIcons style={styles.addIcon} name="timer-outline" size={24} color="#808080" />}
                     placeholder="Add Time"
                     mode="time"
                     format="HH:mm"
                     is24Hour={true}
                     confirmBtnText="Confirm"
                     cancelBtnText="Cancel"
                     showIcon={true}
                     customStyles={{
                        dateInput: {
                           borderWidth: 0,
                           alignItems: 'flex-start',
                           paddingLeft: 10,
                        },
                        placeholderText: {
                           color: '#9E9E9E',
                           fontSize: 16,
                           textAlign: 'left',
                           fontFamily: 'Urbanist-Light',
                        },
                        dateText: {
                           color: '#000',
                           fontSize: 16,
                           fontFamily: 'Urbanist-SemiBold',
                        },
                     }}
                     onDateChange={(date) => {
                        let newArr = [...taskTimeArr];
                        newArr[i] = date;
                        setTaskTimeArr(newArr);
                     }}
                  />
               </View>
            </View>
         )
      }
      return timePickers;
   }

   const saveTimeArr = () => {
      for (let i = 0; i < timePickers.length; i++) {
         if (taskTimeArr[i] == '' || taskTimeArr[i] == null) {
            Alert.alert('Please Fill all the time fields');
            return;
         }
      }
      setTaskTimeArr(taskTimeArr);
      setModalTimesVisible(false);
   }

   const changeDateFormat = (date) => {
      return moment(date).format('DD/MM/YYYY');
   }

   const addPrivateTask = () => {
      let taskUrl = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Task/InsertPrivateTask';
      let taskData = {
         taskName: taskName,
         taskFromDate: taskFromDate,
         taskToDate: taskToDate,
         taskComment: taskComment,
         status: 'P',
         workerId: userId,
         TimeInDay: taskTime,
         period: taskFrequency
      }

      console.log("taskData= ", taskData);
      fetch(taskUrl, {
         method: 'POST',
         body: JSON.stringify(taskData),
         headers: new Headers({
            'Content-Type': 'application/json; charset=UTF-8',
         })
      })
         .then(res => { return res.json() })
         .then(
            (result) => {
               console.log("fetch POST= ", result);
               clearInputs();
            }
         )
         .catch((error) => {
            console.log('Error=', error);
         }
         );
   }
   const addTask = () => {
      //if it caregiver than check if the task is private or public
      if (userType == "Caregiver") {
         if (isPrivate) {
            addPrivateTask();
         } else {
            addPublicTask();
         }
      } else {
         if (taskCategory == 'General') {
            addPublicTask();
         }
         else {
            addShopTask();
         }
      }
   }
   const addShopTask = () => {
      console.log("addShopTask");
   }
   const addPublicTask = () => {
      if (taskTime != '' && taskTimeArr.length == 0) {
         taskTimeArr.push(taskTime);
      }
      let newTaskForDb = {
         taskName: taskName,
         timesInDayArr: taskTimeArr,
         fromDate: taskFromDate,
         toDate: taskToDate,
         patientId: userData.patientId,
         workerId: userData.workerId,
         userId: userData.involvedInId,
         taskComment: taskComment,
         frequency: taskFrequency,
      }
      console.log( newTaskForDb);
      let addTaskUrl = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Task/InsertActualList';
      fetch(addTaskUrl, {
         method: 'POST',
         body: JSON.stringify(newTaskForDb),
         headers: {
            'Content-Type': 'application/json; charset=UTF-8',
         },
      })
         .then(res => {
            if (res.ok) {
               return res.json()
            }
            else {
               console.log("not found")
            }
         }
         )
         .then(data => {
            if (data != null) {
               console.log(data);
               clearInputs();
            }
         }
         )
         .catch((error) => {
            console.log("err=", error);
         }
         );
      
   }

   const clearInputs = () => {
      setTaskName('')
      setTaskNameBorder('')
      setTaskCategory('')
      setTaskAssignee('')
      setTaskFromDate('')
      setTaskToDate('')
      setTaskTime('')
      setTaskFrequency('')
      setTaskComment('')
      setTaskTimeArr([])
      setNumberPerDay(0)
      setIsPrivate(false)
      props.onClose()
   }

   return (
      <SafeAreaView>
         <Modal visible={props.isVisible} presentationStyle='formSheet' animationType='slide' onRequestClose={props.onClose}>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
               <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View style={styles.centeredView}>
                     <Text style={styles.modalText}>Add new task </Text>
                     <View style={styles.modalView}>
                        <View style={styles.inputView}>
                           <TextInput
                              style={[styles.input, taskNameBorder && { borderColor: '#000' }]}
                              placeholder='Task Name'
                              placeholderTextColor='#9E9E9E'
                              value={taskName}
                              returnKeyType='done'
                              onChangeText={text => setTaskName(text)}
                              onEndEditing={() => { setTaskNameBorder(true)  }}
                              
                           />
                           { // if the user is a caregiver than display the assignee
                              userType == "Caregiver" ?
                                 <Dropdown
                                    data={privateOrPublic}
                                    labelField="name"
                                    valueField="name"
                                    placeholder="Assignees"
                                    itemTextStyle={styles.itemStyle}
                                    placeholderStyle={styles.placeholderStyle}
                                    containerStyle={styles.containerStyle}
                                    style={[styles.input, taskAssignee && { borderColor: '#000' }]}
                                    value={taskAssignee}
                                    maxHeight={300}
                                    onChange={item => {
                                       setTaskAssignee(item.name)
                                       if (item.name == 'Private') {
                                          setTaskCategory(taskCategorys[0].name)
                                          setIsPrivate(true)
                                       } else {
                                          setIsPrivate(false)
                                       }
                                    }}
                                 />
                                 : null
                           }
                           {
                              !isPrivate ?
                                 <Dropdown
                                    data={taskCategorys}
                                    labelField="name"
                                    valueField="name"
                                    placeholder="Category"
                                    placeholderStyle={styles.placeholderStyle}
                                    style={[styles.input, taskCategory && { borderColor: '#000' }]}
                                    containerStyle={styles.containerStyle}
                                    maxHeight={300}
                                    value={taskCategory}
                                    onChange={item => { setTaskCategory(item.name) }}
                                 /> : //if is private= true than display like the user already choose the category of General
                                 <TextInput
                                    style={[styles.input, { borderColor: '#000' }]}
                                    placeholder='Category'
                                    placeholderTextColor='#9E9E9E'
                                    value='General'
                                    editable={false}
                                 />
                           }

                           <TouchableOpacity onPress={() => { setModalVisibleDate(true); }}>
                              {
                                 taskFromDate && taskToDate ?
                                    <View style={[styles.input, { borderColor: '#000' }]}>
                                       <Text style={[styles.regularTxt, { color: '#000', fontFamily: 'Urbanist-SemiBold' }]}>
                                          {changeDateFormat(taskFromDate)} - {changeDateFormat(taskToDate)}
                                       </Text>
                                    </View>
                                    :
                                    <View style={styles.input}>
                                       <Text style={[styles.regularTxt, { color: '#9E9E9E' }]}>Start Date - End Date</Text>
                                    </View>
                              }
                           </TouchableOpacity>

                           <Modal visible={modalVisibleDate} transparent={true} style={styles.modalDate} animationType='slide' onRequestClose={() => setModalVisibleDate(false)}>
                              <View style={styles.modalDateView}>
                                 <DateRangePicker
                                    onSelectDateRange={(range) => { setRange(range); }}
                                    blockSingleDateSelection={true}
                                    responseFormat="YYYY-MM-DD"
                                    maxDate={moment().add(3, "year")}
                                    minDate={moment()}
                                    confirmBtnTitle=""
                                    clearBtnTitle=""
                                    selectedDateContainerStyle={styles.selectedDateContainerStyle}
                                    selectedDateStyle={styles.selectedDateStyle}
                                    selectedDateTextStyle={styles.selectedDateTextStyle}
                                    font='Urbanist-SemiBold'
                                 />

                                 <View style={{ height: 30 }}>
                                    {selectedRange.firstDate && selectedRange.secondDate && (
                                       <Text style={styles.textStyleDate}>Selected Date: {changeDateFormat(selectedRange.firstDate)} - {changeDateFormat(selectedRange.secondDate)}</Text>
                                    )}
                                 </View>

                                 <View style={styles.btnModalDate}>
                                    <TouchableOpacity
                                       style={styles.saveBtnDate}
                                       onPress={() => {
                                          setTaskFromDate(selectedRange.firstDate)
                                          setTaskToDate(selectedRange.secondDate)
                                          setModalVisibleDate(false);
                                       }}
                                    >
                                       <Text style={styles.textStyle}>Save</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                       style={styles.closeBtnDate}
                                       onPress={() => {
                                          setRange({});
                                          setModalVisibleDate(false);
                                       }}
                                    >
                                       <Text style={styles.closeTxt}>Cancel</Text>
                                    </TouchableOpacity>
                                 </View>
                              </View>
                           </Modal>
                           {taskCategory == 'General' ?
                              <View style={styles.doubleRow}>
                                 <View style={[styles.doubleRowItem, numberPerDay >= 1 && { borderColor: "black" }]}>
                                    <TouchableOpacity onPress={() =>
                                       setNumberPerDay(parseInt(numberPerDay + 1))
                                    } style={styles.arrowUp}>
                                       {/* Change icon color only onPress to #548DFF  */}
                                       <Ionicons name="md-caret-up-outline" size={17} color="#808080" />
                                    </TouchableOpacity>
                                    <TextInput
                                       style={[styles.inputNumber, numberPerDay && { textAlign: 'center' }]}
                                       placeholder="Number per day"
                                       placeholderTextColor="#9E9E9E"
                                       keyboardType='numeric'
                                       returnKeyType='done'
                                       value={numberPerDay == 0 ? '' : numberPerDay.toString()}
                                       onChangeText={text => text == '' ? setNumberPerDay(0) && setMedTime('') : setNumberPerDay(parseInt(text))}
                                    />
                                    {/* Change icon color only onPress to #548DFF  */}
                                    <TouchableOpacity style={styles.arrowDown} onPress={() => numberPerDay == 0 ? setNumberPerDay(0) : setNumberPerDay(parseInt(numberPerDay - 1))}>
                                       <Ionicons name="md-caret-down-outline" size={17} color="#808080" />
                                    </TouchableOpacity>
                                 </View>
                                 {numberPerDay > 1 ?
                                    <View>
                                       <TouchableOpacity onPress={() => { setModalTimesVisible(true) }}>
                                          <View style={[styles.doubleRowItem, taskTimeArr.length == numberPerDay && { borderColor: '#000' }]}>
                                             <Text style={[styles.inputNumber, { color: '#9E9E9E' }, taskTimeArr.length == numberPerDay && { color: '#000' }]}>
                                                {numberPerDay == taskTimeArr.length ? 'Times Selected' : 'Add Times'}
                                             </Text>
                                             <MaterialCommunityIcons style={styles.addIcon} name="timer-outline" size={24} color="#808080" />
                                          </View>
                                       </TouchableOpacity>
                                    </View>
                                    :
                                    <View >
                                       <DatePicker
                                          style={[styles.doubleRowItem, taskTime != '' && { borderColor: '#000' }]}
                                          date={taskTime}
                                          iconComponent={<MaterialCommunityIcons style={styles.addIcon} name="timer-outline" size={24} color="#808080" />}
                                          placeholder="Add Time"
                                          mode="time"
                                          format="HH:mm"
                                          is24Hour={true}
                                          confirmBtnText="Confirm"
                                          cancelBtnText="Cancel"
                                          showIcon={true}
                                          customStyles={{
                                             dateInput: {
                                                borderWidth: 0,
                                                alignItems: 'flex-start',
                                                paddingLeft: 10,
                                             },
                                             placeholderText: {
                                                color: '#9E9E9E',
                                                fontSize: 16,
                                                textAlign: 'left',
                                                fontFamily: 'Urbanist-Light',
                                             },
                                             dateText: {
                                                color: '#000',
                                                fontSize: 16,
                                                fontFamily: 'Urbanist-Medium',
                                                textAlign: 'center',
                                             },
                                          }}
                                          onDateChange={(date) => {
                                             setTaskTime(date)
                                          }}
                                       />
                                    </View>
                                 }
                              </View>

                              :
                              <DatePicker
                                 style={[styles.input, taskTime != '' && { borderColor: '#000' }]}
                                 date={taskTime}
                                 mode="time"
                                 placeholder="Time"
                                 format="HH:mm"
                                 is24Hour={true}
                                 confirmBtnText="Confirm"
                                 cancelBtnText="Cancel"
                                 showIcon={false}
                                 customStyles={{
                                    dateInput: {
                                       borderWidth: 0,
                                       alignItems: 'flex-start',
                                    },
                                    placeholderText: {
                                       color: '#9E9E9E',
                                       fontSize: 16,
                                       fontFamily: 'Urbanist-Light',
                                    },
                                    dateText: {
                                       color: '#000',
                                       fontSize: 16,
                                       fontFamily: 'Urbanist-SemiBold',
                                    },
                                 }}
                                 onDateChange={(date) => { setTaskTime(date) }}
                              />

                           }
                           {/* {taskCategory == 'General' ?

                              : null} */}

                           <Dropdown
                              data={taskFrequencies}
                              labelField="name"
                              valueField="name"
                              placeholder="Frequency"
                              placeholderStyle={styles.placeholderStyle}
                              style={[styles.input, taskFrequency && { borderColor: '#000' }]}
                              maxHeight={200}
                              value={taskFrequency}
                              containerStyle={styles.containerStyle}
                              onChange={item => { setTaskFrequency(item.name) }}
                           />
                           {/* Modal Box For TIMES ARRAY */}
                           <View>
                              <Modal visible={modalTimesVisible} transparent={true} style={styles.modalDate} animationType='slide' onRequestClose={() => setModalTimesVisible(false)}>
                                 <View style={styles.modalTimesView}>
                                    {/* Header for add times*/}
                                    <View style={styles.modalTimesHeader}>
                                       <Text style={styles.modalText}>Select Med Times</Text>
                                    </View>
                                    {/* Body */}
                                    <View style={styles.modalTimesBody}>
                                       <View style={styles.modalTimesBodyContent}>
                                          {rowForEachTime()}
                                       </View>
                                    </View>

                                    <View style={styles.btnModalDate}>
                                       <TouchableOpacity
                                          style={styles.saveBtnDate}
                                          onPress={saveTimeArr}
                                       >
                                          <Text style={styles.textStyle}>Save</Text>
                                       </TouchableOpacity>
                                       <TouchableOpacity
                                          style={styles.closeBtnDate}
                                          onPress={() => {
                                             setTaskTime('');
                                             setModalTimesVisible(false);
                                          }}
                                       >
                                          <Text style={styles.closeTxt}>Cancel</Text>
                                       </TouchableOpacity>
                                    </View>
                                 </View>
                              </Modal>
                           </View>
                           <TextInput
                              style={[styles.commentInput, { padding: 0 }, taskComment && { borderColor: '#000' }, modalTimesVisible && { display: 'none' }]}
                              placeholder="Comment ( Optional )"
                              placeholderTextColor="#9E9E9E"
                              value={taskComment}
                              multiline={true}
                              returnKeyType='done'
                              onSubmitEditing={Keyboard.dismiss}
                              keyboardType='default'
                              numberOfLines={4}
                              onChangeText={text => setTaskComment(text)}
                           />
                        </View>
                        <View style={styles.btnModal}>
                           <TouchableOpacity style={styles.saveBtn} onPress={addTask}>
                              <Text style={styles.textStyle}>Create</Text>
                           </TouchableOpacity>

                           <TouchableOpacity style={styles.closeBtn} onPress={clearInputs}>
                              <Text style={styles.closeTxt}>Cancel</Text>
                           </TouchableOpacity>
                        </View>
                     </View>
                  </View>
               </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
         </Modal>
      </SafeAreaView>
   )
}

export { NewTaskModal, AddBtn, AddNewMedicine }

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   doubleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: SCREEN_HEIGHT * 0.1,
      width: SCREEN_WIDTH * 0.95,
   },
   doubleRowItem: {
      fontSize: 16,
      width: SCREEN_WIDTH * 0.45,
      borderWidth: 1.5,
      borderColor: '#E6EBF2',
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'flex-start',
      height: 50,
   },
   addIcon: {
      position: 'absolute',
      right: 10,
   },
   containerStyle: {
      width: SCREEN_WIDTH * 0.95,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#F5F8FF',
   },
   containerMedStyle: {
      width: SCREEN_WIDTH * 0.45,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#F5F8FF',
   },
   centeredView: {
      alignItems: 'center',
      marginTop: 30,
   },
   itemStyle: {
      justifyContent: 'flex-start',
      color: '#9E9E9E',
      fontSize: 16,
      fontFamily: 'Urbanist',
   },
   placeholderStyle: {
      color: '#9E9E9E',
      fontSize: 16,
      fontFamily: 'Urbanist-Light',
      // paddingLeft: 10
   },
   textStyleDate: {
      padding: 10,
      color: 'black',
      fontFamily: 'Urbanist-SemiBold',
      textAlign: 'left',
      fontSize: 16,
   },
   regularTxt: {
      fontFamily: 'Urbanist-Light',
      textAlign: 'left',
      fontSize: 16,
   },
   textStyle: {
      color: '#fff',
      fontFamily: 'Urbanist-SemiBold',
      textAlign: 'center',
      fontSize: 16,
   },
   modalText: {
      marginVertical: 20,
      fontFamily: 'Urbanist-Bold',
      fontSize: 24,
      textAlign: 'center',
   },
   closeTxt: {
      color: '#548DFF',
      textAlign: 'center',
      fontFamily: 'Urbanist-SemiBold',
      fontSize: 16,
   },
   addBtnTxt: {
      color: '#fff',
      fontSize: 28,
      marginBottom: 2,
      fontFamily: 'Urbanist-SemiBold',
   },
   btnModal: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
      width: SCREEN_WIDTH * 0.95,
   },
   closeBtn: {
      backgroundColor: '#F5F8FF',
      borderRadius: 16,
      height: 44,
      width: SCREEN_WIDTH * 0.45,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: '#548DFF',
   },
   saveBtn: {
      backgroundColor: '#548DFF',
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      height: 44,
      width: SCREEN_WIDTH * 0.45,
   },
   saveBtnDate: {
      backgroundColor: '#548DFF',
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      height: 44,
      width: SCREEN_WIDTH * 0.4,
   },
   closeBtnDate: {
      backgroundColor: '#F5F8FF',
      borderRadius: 16,
      height: 44,
      width: SCREEN_WIDTH * 0.4,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: '#548DFF',
   },
   addBtn: {
      backgroundColor: '#548DFF',
      borderRadius: 54,
      height: 54,
      width: 54,
      justifyContent: 'center',
      alignItems: 'center',
   },
   inputView: {
      width: SCREEN_WIDTH * 0.95,
   },
   input: {
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: '#E6EBF2',
      height: 54,
      width: SCREEN_WIDTH * 0.95,
      marginVertical: 7,
      paddingHorizontal: 10,
      fontFamily: 'Urbanist-Light',
      fontSize: 16,
      justifyContent: 'center',
   },
   commentInput: {
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: '#E6EBF2',
      height: 90,
      width: SCREEN_WIDTH * 0.95,
      marginVertical: 7,
      paddingHorizontal: 10,
      fontFamily: 'Urbanist-Light',
      fontSize: 16,
      justifyContent: 'center',
   },
   modalDateView: {
      marginTop: SCREEN_HEIGHT * 0.2,
      backgroundColor: 'white',
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      width: SCREEN_WIDTH * 0.95,
      height: SCREEN_HEIGHT * 0.65,
      position: 'absolute',
      top: SCREEN_HEIGHT * 0.025,
      left: SCREEN_WIDTH * 0.025,
   },
   modalTimesView: {
      marginTop: SCREEN_HEIGHT * 0.15,
      backgroundColor: 'white',
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      width: SCREEN_WIDTH * 0.95,
      height: 'auto',
      maxHeight: SCREEN_HEIGHT * 0.8,
      position: 'absolute',
      top: SCREEN_HEIGHT * 0.07,
      left: SCREEN_WIDTH * 0.025,
   },
   btnModalDate: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
      width: '100%',
   },
   selectedDateTxt: {
      color: 'white',
      textAlign: 'center',
      fontFamily: 'Urbanist-SemiBold',
      fontSize: 16,
   },
   selectedDateStyle: {
      fontFamily: 'Urbanist-SemiBold',
      fontSize: 16,
      color: '#fff',
   },
   selectedDateContainerStyle: {
      backgroundColor: '#548DFF',
      borderRadius: 30,
      height: 35,
      width: 35,
      alignItems: "center",
      justifyContent: "center",
   },
   inputSearchStyle: {
      height: 54,
      width: SCREEN_WIDTH * 0.925,
      fontSize: 16,
      fontFamily: 'Urbanist',
      color: '#9E9E9E',
      borderRadius: 16,
      borderWidth: 0,
      borderBottomColor: '#E6EBF2',
      borderBottomWidth: 1.5,
   },
   arrowUp: {
      marginLeft: 10,
      position: 'absolute',
      right: 5,
      top: 0,
      alignItems: 'center',
      justifyContent: 'flex-end',
      height: 26,
      width: 28,
   },
   arrowDown: {
      marginLeft: 10,
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      height: 24,
      width: 28,
      right: 5,
      top: 22,
   },
   inputNumber: {
      width: SCREEN_WIDTH * 0.38,
      fontFamily: 'Urbanist-Light',
      fontSize: 16,
      paddingLeft: 10,
   },
   iconDropDown: {
      paddingTop: 7
   },
   subTitle: {
      fontFamily: 'Urbanist-Bold',
      fontSize: 16,
      color: '#000',
      marginVertical: 5,
      paddingLeft: 5,
   },
})