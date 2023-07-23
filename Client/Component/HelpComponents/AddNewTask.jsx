import { Alert, View, Text, StyleSheet, SafeAreaView, Modal, TouchableOpacity, Dimensions } from 'react-native'
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useState, useEffect } from 'react'
import { MaterialCommunityIcons, MaterialIcons, Octicons, Ionicons } from '@expo/vector-icons';
import { useUserContext } from '../../UserContext';
import { Dropdown } from 'react-native-element-dropdown';
import DatePicker from 'react-native-datepicker';
import DateRangePicker from "rn-select-date-range";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from "moment";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { TextInput } from 'react-native-paper';
import { ScreenWidth } from '@rneui/base';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

function AddBtn(props) {
   return (
      <TouchableOpacity style={styles.addBtnContainer} onPress={props.onPress}>
         <View style={styles.addBtn}>
            <Octicons name="plus" size={26} color="#fff" />
         </View>
      </TouchableOpacity>
   );
}

function AddNewMedicine(props) {
   const PlatformType = Platform.OS;
   const [userData, setUserData] = useState(useUserContext().userContext);
   const [userId, setUserId] = useState(useUserContext.userId);
   const [numberPerDay, setNumberPerDay] = useState(0)
   const [quantity, setQuantity] = useState(0)
   const [capacity, setCapacity] = useState(0)
   const [selectedFrequency, setSelectedFrequency] = useState('')
   const [medComment, setMedComment] = useState('')
   const [medFromDate, setMedFromDate] = useState(Date.now())
   const [medToDate, setMedToDate] = useState('')
   const [medTime, setMedTime] = useState('')
   const [medTimeArr, setMedTimeArr] = useState([]) //we will use this to get all the times from the user
   const [medDosage, setMedDosage] = useState('')
   const [medDosageUnit, setMedDosageUnit] = useState('')
   const [selectedRange, setRange] = useState({});
   const [modalVisibleDate, setModalVisibleDate] = useState(false);
   const [selectedDrugName, setSelectedDrugName] = useState(''); //we will use this to get the selected drug from the user
   const [editMode, setEditMode] = useState(true);
   const timePickers = [];
   const { getAllPublicTasks, userContext, allDrugs } = useUserContext()
   const [showDatePicker, setShowDatePicker] = useState(false);
   const [datePickerVisable, setDatePickerVisable] = useState(false);
   const [timePickerVisable, setTimePickerVisable] = useState(false);
   const [modalTimesVisible, setModalTimesVisible] = useState(false);
   const medFrequencies = [
      { id: 0, name: 'Once' },
      { id: 1, name: 'Daily' },
      { id: 3, name: 'Weekly' },
      { id: 4, name: 'Monthly' },
   ]

   const addMed = () => {
      if (medTime != '' && medTimeArr.length == 0) {
         medTimeArr.push(medTime);
      }
      console.log(selectedDrugName);
      // push token for notification - if user is a involved, we will use the push token of the worker
      let pushToken;
      if (userData.userType == "User") {
         pushToken = userData.pushToken2;
      }
      else {
         pushToken = userData.pushToken;
      }

      let newMedForDb = {
         drugNameEn: selectedDrugName.drugNameEn,
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
         pushToken: pushToken,
      }

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
               clearInputs("Added");
            }
         }
         )
         .catch((error) => {
            console.log("err=", error);
         }
         );
   }

   const clearInputs = async (type) => {
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
      if (type == "Cancel") {
         console.log(type)
         props.onClose();
      }
      else {
         console.log(type)
         await getAllPublicTasks(userData)
         props.onClose();
      }
   }

   const handeleDrugChange = (item) => {
      setSelectedDrugName(item);
      if (item.Type != 'Pill') {
         setEditMode(false);
         setCapacity(1);
         setQuantity(1);
      }
      else {
         setEditMode(true);
         setCapacity(0);
         setQuantity(0);
      }
   }

   function rowForEachTime() {
      if (Platform.OS === 'ios') {
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
      else {
         for (let i = 0; i < numberPerDay; i++) {
            timePickers.push(
               <RowForAdnriod key={i} index={i} addTimeAndroid={addTimeAndroid} />
            )
         }
         return timePickers;
      }
   }

   const addTimeAndroid = (time, index) => {
      console.log("time= ", time);
      let newArr = [...medTimeArr];
      console.log("newArr= ", newArr);
      newArr[index] = time;
      console.log("newArr= ", newArr);
      setMedTimeArr(newArr);
   }

   const RowForAdnriod = (props) => {
      const [show, setShow] = useState(false);
      const [time, setTime] = useState('');

      const onchangeTime = (date) => {
         setShow(false);
         const currentTime = new Date(date.nativeEvent.timestamp).toTimeString().substring(0, 5);
         console.log("currentDate= ", currentTime);
         setTime(currentTime);
         props.addTimeAndroid(currentTime, props.index);
      }


      return (
         <View style={stylesForTimeModal.timePicker}>
            <View>
               <Text style={{ fontFamily: 'Urbanist-Light', fontSize: 16, color: '#000' }}>Time {props.index + 1}</Text>
            </View>
            <View>
               <TouchableOpacity onPress={() => setShow(true)} style={[stylesForTimeModal.doubleRowItem, medTimeArr[props.index] != null && { borderColor: '#000' }]}>
                  <Text style={{ fontFamily: 'Urbanist-Light', fontSize: 16, color: '#000' }}>{medTimeArr[props.index] ? medTimeArr[props.index] : "Add Time"}</Text>
               </TouchableOpacity>
            </View>
            {show && (
               <DateTimePicker
                  value={time ? new Date(time) : new Date()}
                  mode={"time"}
                  is24Hour={true}
                  placeholder="Time"
                  minimumDate={new Date(2000, 0, 1)}
                  onChange={(date) => onchangeTime(date)}
                  display="default"
                  maximumDate={new Date()}
               />
            )}
         </View>
      )
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
   const showdatePicker = () => {
      console.log("showDatePicker");
      setDatePickerVisable(true);
   };

   const showTimePicker = () => {
      console.log("showTimePicker");
      setTimePickerVisable(true);
   };

   const onChangeDate = (selectedDate) => {
      console.log("onChangeDate");
      const currentDate = new Date(selectedDate.nativeEvent.timestamp).toISOString().substring(0, 10);
      setDatePickerVisable(false);
      setMedToDate(currentDate);
   };

   const onChangeTime = (selectedTime) => {
      console.log("onChangeTime");
      const currentTime = new Date(selectedTime.nativeEvent.timestamp).toTimeString().substring(0, 5);
      console.log(currentTime);
      setTimePickerVisable(false);
      setMedTime(currentTime);
   };

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

   return (
      <Modal visible={props.isVisible} presentationStyle='formSheet' animationType='slide' onRequestClose={props.onClose}>
         <KeyboardAwareScrollView
            style={{ flex: 1 }}
            resetScrollToCoords={{ x: 0, y: 0 }}
            contentContainerStyle={{ flex: 1 }}
            scrollEnabled={false}
         >
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
                           labelField={userData.userType == "Caregiver" ? "drugNameEn" : "drugName"}
                           valueField={userData.userType == "Caregiver" ? "drugNameEn" : "drugName"}
                           placeholder="Medicine Name"
                           maxHeight={300}
                           fontFamily='Urbanist-Light'
                           // style={[styles.input, taskAssignee && { borderColor: '#000' }]}
                           style={[styles.input, { textAlign: 'center', backgroundColor: '#EEEEEE', borderRadius: 16, }]}
                           itemTextStyle={styles.itemStyle}
                           placeholderStyle={styles.placeholderStyle}
                           containerStyle={styles.containerStyle}
                           value={selectedDrugName}
                           onChange={(item) => handeleDrugChange(item)}
                           selectedTextStyle={{ fontFamily: 'Urbanist-Medium' }}
                        />
                     </View>

                     <Text style={styles.subTitle}>More Details</Text>
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
                                 outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
                                 contentStyle={{ fontFamily: 'Urbanist-Regular' }}
                                 activeOutlineColor="#548DFF"
                                 outlineColor='#E6EBF2'
                                 mode='outlined'
                                 label={<Text style={{ fontFamily: "Urbanist-Medium" }}>Num of intakes</Text>}
                                 style={[styles.inputNumber, { width: ScreenWidth * 0.45 }, numberPerDay && { textAlign: 'center' }]}
                                 placeholderTextColor="#9E9E9E"
                                 placeholder="Number of intakes"
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
                              style={[styles.doubleRowItem, { paddingRight: 10, paddingLeft: 10, marginTop: 7 }, styles.regInput]}
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
                              selectedTextStyle={{ fontFamily: 'Urbanist-Medium' }}
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
                                 outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
                                 contentStyle={{ fontFamily: 'Urbanist-Regular' }}
                                 activeOutlineColor="#548DFF"
                                 outlineColor='#E6EBF2'
                                 mode='outlined'
                                 label={<Text style={{ fontFamily: "Urbanist-Medium" }}>Qty taken</Text>}
                                 style={[styles.inputNumber, { width: ScreenWidth * 0.45 }, quantity && { textAlign: 'center' }]}
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
                                 style={[styles.inputNumber, { width: ScreenWidth * 0.45 }, capacity && { textAlign: 'center' }]}
                                 placeholder="Capacity In box"
                                 label={<Text style={{ fontFamily: "Urbanist-Medium" }}>Capacity In box</Text>}
                                 pointerEvents='box-none'
                                 placeholderTextColor="#9E9E9E"
                                 keyboardType='numeric'
                                 outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
                                 contentStyle={{ fontFamily: 'Urbanist-Regular' }}
                                 activeOutlineColor="#548DFF"
                                 outlineColor='#E6EBF2'
                                 mode='outlined'
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
                           {selectedFrequency == 'Once' ? 'Set date' : 'Set end date'}
                        </Text>
                        {/* THIRD ROW */}
                        <View style={[styles.doubleRow, modalTimesVisible && { display: 'none' }]}>
                           {PlatformType === 'ios' ?
                              <DatePicker
                                 useNativeDriver={true}
                                 iconComponent={<MaterialCommunityIcons style={styles.addIcon} name="calendar-outline" size={24} color="#808080" />}
                                 style={[styles.doubleRowItem]}
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
                                    dateText: [styles.inputNumber, medToDate && { fontFamily: 'Urbanist-Medium' }]
                                 }}
                                 onDateChange={(date) => setMedToDate(date)}
                              />
                              :
                              <TouchableOpacity style={[styles.medDatePicker]} onPress={showdatePicker}>
                                 <Text style={styles.dateInputTxt}>{medToDate ? medToDate : "dd/mm/yyyy"}</Text>
                              </TouchableOpacity>
                           }
                           {datePickerVisable && (
                              <DateTimePicker
                                 //testID="dateTimePicker"
                                 value={medToDate ? new Date(medToDate) : new Date()}
                                 // mode={"date"}
                                 is24Hour={true}
                                 onChange={(value) => onChangeDate(value)}
                                 display="default"
                                 minimumDate={new Date()}
                              />
                           )}
                           {numberPerDay == 0 | numberPerDay == 1 ?
                              <View >
                                 {Platform.OS === 'ios' ?
                                    <DatePicker
                                       style={[styles.doubleRowItem, styles.regInput, medTime != '' && { borderColor: '#000' }]}
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
                                    /> :
                                    <TouchableOpacity style={[styles.medDatePicker, medTime && { borderColor: "#000" }]} onPress={showTimePicker}>
                                       <Text style={styles.dateInputTxt}>{medTime ? medTime : "Add Time"}</Text>
                                       <MaterialCommunityIcons style={styles.addIcon} name="timer-outline" size={24} color="#808080" />
                                    </TouchableOpacity>
                                 }
                              </View>
                              :
                              <View>
                                 <TouchableOpacity onPress={() => { setModalTimesVisible(true) }}>
                                    <View style={[styles.doubleRowItem, medTimeArr.length == numberPerDay && { borderColor: '#000' }]}>
                                       <Text style={[styles.inputNumber, { color: '#9E9E9E' }, medTimeArr.length == numberPerDay && { color: '#000' }]}>
                                          {medTimeArr.length == numberPerDay ? "Times Selected" : "Add Times"}
                                       </Text>
                                       <MaterialCommunityIcons style={styles.addIcon} name="timer-outline" size={24} color="#808080" />
                                    </View>
                                 </TouchableOpacity>
                              </View>
                           }
                        </View>
                        {timePickerVisable && (
                           <DateTimePicker
                              //testID="dateTimePicker"
                              value={medToDate ? new Date(medToDate) : new Date()}
                              // mode={"date"}
                              mode='time'
                              is24Hour={true}
                              onChange={(value) => onChangeTime(value)}
                              display="default"
                           />
                        )}

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
                        outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
                        contentStyle={{ fontFamily: 'Urbanist-Regular' }}
                        activeOutlineColor="#548DFF"
                        outlineColor='#E6EBF2'
                        mode='outlined'
                        multiline={false}
                        label={<Text style={{ fontFamily: "Urbanist-Medium" }}>Custom Instruction ( Optional )</Text>}
                        returnKeyType='done'
                        keyboardType='default'
                        numberOfLines={4}
                        onSubmitEditing={() => Keyboard.dismiss()}
                        onChangeText={text => setMedComment(text)}
                     />
                     <View style={[styles.btnModal, modalTimesVisible && { display: 'none' }]}>
                        <TouchableOpacity style={styles.saveBtn} onPress={addMed}>
                           <Text style={styles.textStyle}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeBtn} onPress={() => clearInputs("Cancel")}>
                           <Text style={styles.closeTxt}>Cancel</Text>
                        </TouchableOpacity>
                     </View>
                  </View>
               </View>
            </TouchableWithoutFeedback>
         </KeyboardAwareScrollView>
      </Modal >
   )
}

function NewTaskModal(props) {
   const [userData, setUserData] = useState(useUserContext().userContext);
   const [userId, setUserId] = useState(useUserContext.userId);
   const [userType, setUserType] = useState(userData.userType);

   const { addPrivateTaskContext, getAllPrivateTasks, getAllPublicTasks, userContext } = useUserContext();
   const [datePickerVisable, setDatePickerVisable] = useState(false);
   const [timePickerVisable, setTimePickerVisable] = useState(false);

   const [taskName, setTaskName] = useState('')
   const [taskComment, setTaskComment] = useState('')
   const [taskCommentBorder, setTaskCommentBorder] = useState('')
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

   const addTimeAndroid = (time, index) => {
      console.log("time= ", time);
      let newArr = [...taskTimeArr];
      console.log("newArr= ", newArr);
      newArr[index] = time;
      console.log("newArr= ", newArr);
      setTaskTimeArr(newArr);
   }

   function rowForEachTime() {
      if (Platform.OS === 'ios') {
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
      else {
         for (let i = 0; i < numberPerDay; i++) {
            timePickers.push(
               <RowForAdnriod key={i} index={i} setTaskTimeArr={setTaskTimeArr} addTimeAndroid={addTimeAndroid} />
            )
         }
         return timePickers;
      }
   }

   const RowForAdnriod = (props) => {
      const [show, setShow] = useState(false);
      const [time, setTime] = useState('');

      const onchangeTime = (date) => {
         setShow(false);
         const currentTime = new Date(date.nativeEvent.timestamp).toTimeString().substring(0, 5);
         console.log("currentDate= ", currentTime);
         setTime(currentTime);
         props.addTimeAndroid(currentTime, props.index);
      }


      return (
         <View style={stylesForTimeModal.timePicker}>
            <View>
               <Text style={{ fontFamily: 'Urbanist-Light', fontSize: 16, color: '#000' }}>Time {props.index + 1}</Text>
            </View>
            <View>
               <TouchableOpacity onPress={() => setShow(true)} style={[stylesForTimeModal.doubleRowItem, taskTimeArr[props.index] != null && { borderColor: '#000' }]}>
                  <Text style={{ fontFamily: 'Urbanist-Light', fontSize: 16, color: '#000' }}>{taskTimeArr[props.index] ? taskTimeArr[props.index] : "Add Time"}</Text>
               </TouchableOpacity>
            </View>
            {show && (
               <DateTimePicker
                  value={time ? new Date(time) : new Date()}
                  mode={"time"}
                  is24Hour={true}
                  placeholder="Time"
                  minimumDate={new Date(2000, 0, 1)}
                  onChange={(date) => onchangeTime(date)}
                  display="default"
                  maximumDate={new Date()}
               />
            )}
         </View>
      )
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
      //check if all the fields are filled
      if (taskName == '' || taskFromDate == '' || taskFrequency == '') {
         Alert.alert('Please Fill all the fields');
         return;
      }
      if (taskTimeArr.length == 0 && taskTime == '') {
         Alert.alert('Please Fill all the fields');
         return;
      }
      if (taskTime != '' && taskTimeArr.length == 0) {
         if (Platform.OS === 'ios') {
            taskTimeArr.push(taskTime);
         }
         else {
            taskTimeArr.push(taskTime.substring(0, 5));
         }
      }
      let taskData = {
         taskName: taskName,
         taskFromDate: taskFromDate,
         taskToDate: taskToDate ? taskToDate : taskFromDate, //because it's once task so the date is the same
         taskComment: taskComment,
         status: 'P',
         workerId: userData.workerId,
         timesInDayArr: taskTimeArr,
         frequency: taskFrequency
      }
      console.log(taskData);
      addPrivateTaskContext(taskData)
      clearInputs("AddTask");
   }


   const addTask = () => {
      //if it caregiver than check if the task is private or public
      if (!taskName) {
         return Alert.alert("Please select Name")
      }
      if (userContext.userType=="Caregiver" && !taskAssignee) {
         return Alert.alert("Please select asignee")
      }
      if (!taskCategory) {
         return Alert.alert("Please select category")
      }
      if (!taskFrequency) {
         return Alert.alert("Please select frequency")
      }
      if (taskFrequency === "Once" && !taskFromDate) {
         return Alert.alert("Please select Date")
      }
      if (taskFrequency == "Once" && !taskTime) {
         return Alert.alert("Please select task time")
      }
      if (taskCategory == "General" && numberPerDay == 1 && !taskTime) {
         return Alert.alert("Please select task time")
      }



      if (userType == "Caregiver") {
         if (isPrivate) {
            addPrivateTask();
            return;
         }
      }
      if (taskCategory == 'General') {
         addPublicTask();
      }
      else {
         addShopTask();
      }

   }

   const addShopTask = () => {
      console.log("addShopTask");
      if (taskTime != '' && taskTimeArr.length == 0) {
         taskTimeArr.push(taskTime);
      }

      let pushToken;
      if (userType == "User") {
         pushToken = userData.pushToken2;
      }
      else {
         pushToken = userData.pushToken;
      }

      let newTaskForDb = {
         taskName: taskName,
         listName: taskName,
         timesInDayArr: taskTimeArr,
         fromDate: taskFromDate,
         toDate: taskToDate ? taskToDate : taskFromDate, //because it's once task so the date is the same
         patientId: userData.patientId,
         workerId: userData.workerId,
         userId: userData.involvedInId,
         taskComment: taskComment,
         frequency: taskFrequency,
         pushToken: pushToken,
      }
      console.log("newTaskForDb= ", newTaskForDb);
      let InsertActualList = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Task/InsertActualList';
      fetch(InsertActualList, {
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

   const addPublicTask = () => {
      if (taskTime != '' && taskTimeArr.length == 0) {
         taskTimeArr.push(taskTime);
      }
      let pushToken;
      if (userType == "User") {
         pushToken = userData.pushToken2;
      }
      else {
         pushToken = userData.pushToken;
      }

      let newTaskForDb = {
         taskName: taskName,
         timesInDayArr: taskTimeArr,
         fromDate: taskFromDate,
         toDate: taskToDate ? taskToDate : taskFromDate, //because it's once task so the date is the same
         patientId: userData.patientId,
         workerId: userData.workerId,
         userId: userData.involvedInId,
         taskComment: taskComment,
         frequency: taskFrequency,
         pushToken: pushToken,
      }
      console.log(newTaskForDb);

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
               clearInputs("AddTask");
            }
         }
         )
         .catch((error) => {
            console.log("err=", error);
         }
         );

   }

   const clearInputs = async (type) => {
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
      if (type == "Cancel") {
         console.log(type);
         props.cancel();
      }
      else {
         console.log(type);
         await getAllPrivateTasks(userData)
         await getAllPublicTasks(userData)
         props.onClose();
      }
   }

   const showDatePicker = () => {
      console.log("showDatePicker");
      setDatePickerVisable(true);
   }

   const showTimePicker = () => {
      console.log("showTimePicker");
      setTimePickerVisable(true);
   }

   const onChangeDate = (selectedDate) => {
      console.log("onChangeDate");
      const currentDate = new Date(selectedDate.nativeEvent.timestamp).toISOString().substring(0, 10);
      setDatePickerVisable(false);
      setTaskFromDate(currentDate);
   };

   const onChangeTaskTime = (selectedDate) => {
      console.log("onChangeTaskTime");
      console.log("selectedDate= ", selectedDate);
      const currentTime = new Date(selectedDate.nativeEvent.timestamp).toTimeString();
      console.log("currentDate= ", currentTime);
      setTimePickerVisable(false);
      setTaskTime(currentTime);
      console.log("taskTime= ", taskTime);
   };

   return (
      <Modal visible={props.isVisible} presentationStyle='formSheet' animationType='slide' onRequestClose={props.onClose}>
         <KeyboardAwareScrollView
            style={{ flex: 1 }}
            resetScrollToCoords={{ x: 0, y: 0 }}
            contentContainerStyle={{ flex: 1 }}
            scrollEnabled={false}
         >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
               <View style={styles.centeredView}>
                  <Text style={styles.modalText}>Add New task </Text>
                  <View style={styles.modalView}>
                     <View style={styles.inputView}>
                        <TextInput
                           style={[styles.input, taskNameBorder && { borderColor: '#000' }]}
                           placeholder='Task Name'
                           outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
                           contentStyle={{ fontFamily: 'Urbanist-Regular', paddingLeft: 2 }}
                           activeOutlineColor="#548DFF"
                           outlineColor='#E6EBF2'
                           mode='outlined'
                           placeholderTextColor='#9E9E9E'
                           label={<Text style={{ fontFamily: "Urbanist-Medium" }}>Task Name</Text>}
                           value={taskName}
                           returnKeyType='done'
                           onChangeText={text => setTaskName(text)}
                           onEndEditing={() => { taskName != '' && setTaskNameBorder(true) }}
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
                                 style={[styles.input, styles.regInput]}
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
                                 selectedTextStyle={{ fontFamily: 'Urbanist-Medium' }}

                              />
                              : null
                        }
                        {!isPrivate ?
                           <Dropdown
                              data={taskCategorys}
                              labelField="name"
                              valueField="name"
                              itemTextStyle={styles.itemStyle}
                              placeholder="Category"
                              placeholderStyle={styles.placeholderStyle}
                              style={[styles.input, styles.regInput]}
                              containerStyle={styles.containerStyle}
                              maxHeight={300}
                              value={taskCategory}
                              onChange={item => { setTaskCategory(item.name) }}
                              selectedTextStyle={{ fontFamily: 'Urbanist-Medium' }}
                           /> :
                           <TextInput
                              style={[styles.input, { borderColor: '#000' }]}
                              placeholder='Category'
                              label={<Text style={{ fontFamily: "Urbanist-Medium" }}>Category</Text>}
                              placeholderTextColor='#9E9E9E'
                              value='General'
                              outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
                              contentStyle={{ fontFamily: 'Urbanist-Regular', paddingLeft: 2 }}
                              activeOutlineColor="#548DFF"
                              outlineColor='#E6EBF2'
                              mode='outlined'
                              editable={false}
                           />
                        }
                        <Dropdown
                           data={taskFrequencies}
                           labelField="name"
                           valueField="name"
                           itemTextStyle={styles.itemStyle}
                           placeholder="Frequency"
                           placeholderStyle={styles.placeholderStyle}
                           style={[styles.input, styles.regInput]}
                           maxHeight={200}
                           value={taskFrequency}
                           containerStyle={styles.containerStyle}
                           onChange={item => { setTaskFrequency(item.name) }}
                           selectedTextStyle={{ fontFamily: 'Urbanist-Medium' }}
                        />

                        {/* If taskFrequency == 'Once' Show date picker - now date range */}
                        {taskFrequency == 'Once' ? Platform.OS == 'ios' ?
                           <DatePicker
                              useNativeDriver={'true'}
                              iconComponent={<MaterialCommunityIcons style={[styles.addIcon, { right: 0 }]} name="calendar-outline" size={24} color="#808080" />}
                              style={[styles.input, styles.regInput]}
                              date={taskFromDate}
                              mode="date"
                              placeholder="dd/mm/yyyy"
                              format="YYYY-MM-DD"
                              minDate={new Date()}
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
                                    fontSize: 16,
                                    textAlign: 'left',
                                 },
                                 dateText: [styles.inputNumber, taskFromDate && { fontFamily: 'Urbanist-Medium' }]
                              }}
                              onDateChange={(date) => setTaskFromDate(date)}
                           />
                           :
                           <TouchableOpacity style={[styles.datePicker]} onPress={showDatePicker}><Text style={[styles.dateInputTxt, taskFromDate && { color: "#000" }]}>{taskFromDate ? taskFromDate : "Date"}</Text></TouchableOpacity>
                           :
                           <TouchableOpacity onPress={() => { setModalVisibleDate(true); }}>
                              {taskFromDate && taskToDate ?
                                 <View style={[styles.input, styles.regInput, { borderColor: '#000' }]}>
                                    <Text style={[styles.regularTxt, { color: '#000', fontFamily: 'Urbanist-SemiBold' }]}>
                                       {changeDateFormat(taskFromDate)} - {changeDateFormat(taskToDate)}
                                    </Text>
                                 </View>
                                 :
                                 <View style={[styles.input, styles.regInput]}>
                                    <Text style={[styles.regularTxt, { color: '#9E9E9E' }]}>Start Date - End Date</Text>
                                 </View>
                              }
                           </TouchableOpacity>
                        }
                        {datePickerVisable && (
                           <DateTimePicker
                              //testID="dateTimePicker"
                              value={taskFromDate ? new Date(taskFromDate) : new Date()}
                              // mode={"date"}
                              is24Hour={true}
                              onChange={(value) => onChangeDate(value)}
                              display="default"
                           />
                        )}

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
                                    style={[styles.inputNumber, numberPerDay && { textAlign: 'center' }, { width: SCREEN_WIDTH * 0.45 }]}
                                    placeholder="Number per day"
                                    label={<Text style={{ fontFamily: "Urbanist-Medium" }}>Number per day</Text>}
                                    placeholderTextColor="#9E9E9E"
                                    keyboardType='numeric'
                                    outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
                                    contentStyle={{ fontFamily: 'Urbanist-Regular', paddingLeft: 2 }}
                                    activeOutlineColor="#548DFF"
                                    outlineColor='#E6EBF2'
                                    mode='outlined'
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
                                       <View style={[styles.doubleRowItem, styles.regInput, { marginTop: 7 }]}>
                                          <Text style={[styles.inputNumber, { color: '#9E9E9E' }, taskTimeArr.length == numberPerDay && { color: '#000' }]}>
                                             {numberPerDay == taskTimeArr.length ? 'Times Selected' : 'Add Times'}
                                          </Text>
                                          <MaterialCommunityIcons style={styles.addIcon} name="timer-outline" size={24} color="#808080" />
                                       </View>
                                    </TouchableOpacity>
                                 </View>
                                 :
                                 <View >
                                    {Platform.OS === 'ios' ?
                                       <DatePicker
                                          style={[styles.doubleRowItem, styles.regInput, { marginTop: 7 }, taskTime != '' && { borderColor: '#000' }]}
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
                                       /> :
                                       <TouchableOpacity onPress={showTimePicker} style={[styles.doubleRowItem, { marginTop: 7 }, styles.regInput]}>
                                          <Text style={[styles.dateInputTxt, taskTime && { color: "#000" }]}>{taskTime ? taskTime.substring(0, 5) : "Add Time"}</Text>
                                          <MaterialCommunityIcons style={styles.addIcon} name="timer-outline" size={24} color="#808080" />
                                       </TouchableOpacity>
                                    }
                                 </View>
                              }
                           </View>
                           :
                           <>
                              {Platform.OS === "ios" ? <DatePicker
                                 style={[styles.input, styles.regInput, taskTime != '' && { borderColor: '#000' }]}
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
                              /> :
                                 <TouchableOpacity style={[styles.datePicker, taskTime && { borderColor: "#000" }]} onPress={showTimePicker}>
                                    <Text style={[styles.dateInputTxt, taskTime && { color: "#000" }]}>{taskTime ? taskTime : "Time"}</Text>
                                 </TouchableOpacity>
                              }
                           </>
                        }
                        {timePickerVisable && (
                           <DateTimePicker
                              //testID="dateTimePicker"
                              value={taskTime ? new Date(taskTime) : new Date()}
                              mode={"time"}
                              is24Hour={true}
                              onChange={(value) => onChangeTaskTime(value)}
                              display="default"
                           />
                        )}
                        {/* Modal Box For TIMES ARRAY */}
                        <View>
                           <Modal visible={modalTimesVisible} transparent={true} animationType='slide' onRequestClose={() => setModalTimesVisible(false)}>
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
                           style={[styles.commentInput, { padding: 0 }, taskComment !== '' && { borderColor: '#000' }, modalTimesVisible && { display: 'none' }]}
                           placeholder="Comment (Optional)"
                           placeholderTextColor="#9E9E9E"
                           value={taskComment}
                           label={<Text style={{ fontFamily: "Urbanist-Medium" }}>Comment (Optional)</Text>}
                           outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
                           contentStyle={{ fontFamily: 'Urbanist-Medium', paddingLeft: 2 }}
                           activeOutlineColor="#548DFF"
                           outlineColor='#E6EBF2'
                           mode='outlined'
                           returnKeyType='default'
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

                        <TouchableOpacity style={styles.closeBtn} onPress={() => clearInputs("Cancel")}>
                           <Text style={styles.closeTxt}>Cancel</Text>
                        </TouchableOpacity>
                     </View>
                  </View>
               </View>
            </TouchableWithoutFeedback>
         </KeyboardAwareScrollView >
      </Modal >
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
      height: 54,
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
      height: 54,
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
      height: 54,
      width: SCREEN_WIDTH * 0.95,
      marginVertical: 7,
      paddingHorizontal: 10,
      fontFamily: 'Urbanist-Light',
      fontSize: 16,
      justifyContent: 'center',
      backgroundColor: '#fff',
   },
   regInput: {
      borderWidth: 1.5,
      borderColor: '#E6EBF2',
      borderRadius: 16,
   },
   commentInput: {
      height: 90,
      width: SCREEN_WIDTH * 0.95,
      marginVertical: 7,
      paddingHorizontal: 10,
      fontFamily: 'Urbanist-Light',
      fontSize: 16,
      backgroundColor: '#fff',
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
      zIndex: 1,
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
      backgroundColor: '#fff',
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
   addBtnContainer: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 5,
   },
   datePicker: {
      flexDirection: 'row',
      // justifyContent: 'center',
      width: Dimensions.get('window').width * 0.95,
      // paddingLeft: 10,
      marginVertical: 7,
      alignItems: 'center',
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: '#E6EBF2',
      shadowColor: '#000',
      height: 54,
      fontFamily: 'Urbanist-Light',
      fontSize: 16,
   },
   dateInputTxt: {
      color: '#9E9E9E',
      paddingHorizontal: 10,
      fontSize: 16,
      fontFamily: 'Urbanist-Regular',
      paddingRight: 10,
   },
   medDatePicker: {
      width: SCREEN_WIDTH * 0.45,
      flexDirection: 'row',
      // justifyContent: 'center',
      // paddingLeft: 10,
      marginVertical: 7,
      alignItems: 'center',
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: '#E6EBF2',
      shadowColor: '#000',
      height: 54,
      fontFamily: 'Urbanist-Light',
      fontSize: 16,
   },
})