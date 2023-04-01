import { Alert, View, Text, StyleSheet, SafeAreaView, KeyboardAvoidingView, Modal, LayoutAnimation, TouchableOpacity, Keyboard, Dimensions, TextInput } from 'react-native'
import { useState, useEffect } from 'react'
import { AntDesign, Ionicons, SimpleLineIcons } from '@expo/vector-icons';
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
            <Text style={styles.addBtnTxt}>+</Text>
         </View>
      </TouchableOpacity>
   );
}

function NewTaskModal(props) {
   const [userData, setUserData] = useState('');
   const [userId, setUserId] = useState('');
   const [userType, setUserType] = useState('');

   const [taskName, setTaskName] = useState('')
   const [taskComment, setTaskComment] = useState('')
   const [taskFromDate, setTaskFromDate] = useState('')
   const [taskToDate, setTaskToDate] = useState('')
   const [taskFrequency, setTaskFrequency] = useState('')
   const [taskTime, setTaskTime] = useState('')
   const [taskCategory, setTaskCategory] = useState('')
   const [isPrivate, setIsPrivate] = useState(false)//for the assignee
   const [taskAssignee, setTaskAssignee] = useState('')
   const [selectedRange, setRange] = useState({});
   const [taskNameBorder, setTaskNameBorder] = useState('')
   const [modalVisibleDate, setModalVisibleDate] = useState(false);
   //const [keyboardOpen, setKeyboardOpen] = useState(false);
   const [animation, setAnimation] = useState({});
   let animationInProgress = false;

   const taskCategorys = [
      { id: 1, name: 'General', color: '#FFC0CB' },
      { id: 2, name: 'Shop', color: '#FFC0CB' },
      { id: 3, name: 'Medicines', color: '#FFC0CB' },
   ]
   const taskFrequencies = [
      { id: 0, name: 'Once' },
      { id: 1, name: 'Daily' },
      { id: 2, name: 'Weekly' },
      { id: 3, name: 'Monthly' },
      { id: 4, name: 'Yearly' },
   ]

   useEffect(() => {

      getUserData();
      //use Keyboard.addListener to detect if the keyboard is open or not, if so add layout animation with margin bottom
      Keyboard.addListener('keyboardDidShow', () => {
         if (!animationInProgress) {
            animationInProgress = true;
            LayoutAnimation.configureNext({
                update: {
                    type: LayoutAnimation.Types.easeIn,
                    duration: 250,
                    useNativeDriver: true,
                },
            });
            setAnimation({ marginBottom: Dimensions.get('window').height * 0.355
          });
            animationInProgress = false;
        }
      }
      );
      Keyboard.addListener('keyboardDidHide', () => {
         if (!animationInProgress) {
            animationInProgress = true;
            LayoutAnimation.configureNext({
                update: {
                    type: LayoutAnimation.Types.easeOut,
                    duration: 250,
                    useNativeDriver: true,
                },
            });
            setAnimation({ marginBottom: 0 });
            animationInProgress = false;
        }
      }
      );
      




   }, []);
   const getUserData = async () => {
      const user = await AsyncStorage.getItem('userData');
      const userData = JSON.parse(user);
      setUserId(userData.Id);
      setUserData(userData);
      setUserType(userData.userType);
   }
   const changeDateFormat = (date) => {
      return moment(date).format('DD/MM/YYYY');
   }

   const privateOrPublic = [
      { id: 1, name: 'Private' },
      { id: 2, name: 'Public' },
   ]
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
         .then(res => {
            return res.json()
         }
         )
         .then(
            (result) => {
               console.log("fetch POST= ", result);

               props.onClose();

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
         addPublicTask();
      }
   }
   const addPublicTask = () => {
      Alert.alert("Add Public Task");

   }
   return (
      <SafeAreaView>

         <Modal visible={props.isVisible} presentationStyle='formSheet' animationType='slide' onRequestClose={props.onClose}>
            <View style={[styles.centeredView, animation]}>

         
               <View style={styles.modalView}>
                  <Text style={styles.modalText}>Add new task </Text>
                  <View style={styles.inputView}>
                     <TextInput
                        style={[styles.input, taskNameBorder && { borderColor: '#000' }]}
                        placeholder='Task Name'
                        placeholderTextColor='#9E9E9E'
                        value={taskName}
                        returnKeyType='done'
                        onChangeText={text => setTaskName(text)}
                        onEndEditing={() => { setTaskNameBorder(taskName) }}
                     />
                     { // if the user is a caregiver than display the assignee
                        userType == "Caregiver" ?
                           <Dropdown
                              data={privateOrPublic}
                              labelField="name"
                              valueField="name"
                              placeholder="Assignees"
                              placeholderStyle={styles.placeholderStyle}
                              style={[styles.input, taskAssignee && { borderColor: '#000' }]}
                              value={taskAssignee}
                              maxHeight={300}
                              containerStyle={styles.containerStyle}
                              onChange={item => {
                                 setTaskAssignee(item.name)
                                 if (item.name == 'Private') {
                                    setIsPrivate(true)
                                 } else {
                                    setIsPrivate(false)
                                 }
                              }}
                           />
                           : null
                     }
                     {
                        //if is private= true than display the category
                        !isPrivate ?
                           <Dropdown
                              data={taskCategorys}
                              labelField="name"
                              valueField="name"
                              placeholder="Category"
                              placeholderStyle={styles.placeholderStyle}
                              style={[styles.input, taskCategory && { borderColor: '#000' }]}
                              maxHeight={300}
                              value={taskCategory}
                              containerStyle={styles.containerStyle}
                              onChange={item => {
                                 setTaskCategory(item.name)
                              }
                              }
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
                                 <Text style={[styles.regularTxt, { color: '#9E9E9E' }]}>
                                    Start Date - End Date
                                 </Text>
                              </View>
                        }
                     </TouchableOpacity>

                     <Modal visible={modalVisibleDate}
                      transparent={true} style={styles.modalDate} animationType='slide' onRequestClose={() => setModalVisibleDate(false)}>
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

                     <DatePicker
                        style={[styles.input, taskTime != '' && { borderColor: '#000' }]}
                        date={taskTime}
                        mode="time"
                        placeholder="Time"
                        format="HH:mm"
                        is24Hour={true}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                           dateIcon: {
                              display: 'none',
                           },
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

                     <TextInput
                        style={[styles.commentInput, taskComment != '' && { borderColor: '#000' }

                        ]}
                        placeholder='Comment ( optional )'
                        value={taskComment}
                        numberOfLines={4}
                        returnKeyType='done'
                        keyboardType='default'
                        onSubmitEditing={() => Keyboard.dismiss()}
                        placeholderTextColor='#9E9E9E'
                        onChangeText={text => setTaskComment(text)}
                     />
                  </View>
                  <View style={styles.btnModal}>
                     <TouchableOpacity style={styles.SaveBtn} onPress={() => { addTask(); props.onClose }}>
                        <Text style={styles.textStyle}>Create</Text>
                     </TouchableOpacity>

                     <TouchableOpacity style={styles.closeBtn} onPress={() => {
                        setTaskName('')
                        setTaskNameBorder('')
                        setTaskCategory('')
                        setTaskAssignee('')
                        setTaskFromDate('')
                        setTaskToDate('')
                        setTaskTime('')
                        setTaskFrequency('')
                        setTaskComment('')
                        setIsPrivate(false)
                        props.onClose()
                     }}>
                        <Text style={styles.closeTxt}>Cancel</Text>
                     </TouchableOpacity>
                  </View>
               </View>
            </View>
         </Modal>

      </SafeAreaView>
   )
}

export { NewTaskModal, AddBtn }

const styles = StyleSheet.create({
   centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
   },
   containerStyle: {
      width: SCREEN_WIDTH * 0.95,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#F5F8FF',
   },
   SaveBtn: {
      backgroundColor: '#548DFF',
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      height: 44,
      width: SCREEN_WIDTH * 0.45,
   },
   placeholderStyle: {
      color: '#9E9E9E',
      fontSize: 16,
      fontFamily: 'Urbanist-Light',
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
   textStyle: {
      color: 'white',
      fontFamily: 'Urbanist-SemiBold',
      textAlign: 'center',
      fontSize: 16,
   },
   modalText: {
      marginBottom: 5,
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
   addBtn: {
      backgroundColor: '#548DFF',
      borderRadius: 54,
      height: 54,
      width: 54,
      justifyContent: 'center',
      alignItems: 'center',
   },
   addBtnTxt: {
      color: 'white',
      fontSize: 28,
      marginBottom: 2,
      fontFamily: 'Urbanist-SemiBold',
   },
   inputView: {
      width: SCREEN_WIDTH * 0.95,
      marginTop: 10,
   },
   input: {
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: '#E6EBF2',
      height: 54,
      width: SCREEN_WIDTH * 0.95,
      marginBottom: 10,
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
      marginBottom: 10,
      paddingLeft: 20,
      fontFamily: 'Urbanist-Light',
      fontSize: 16,
      textAlignVertical: 'top',
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
   btnModalDate: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
      width: '100%',
   },
   // selectedDateContainerStyle: {
   //    width: SCREEN_WIDTH * 1,
   // },
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
})