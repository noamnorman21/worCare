import { View, Text, Dimensions, Platform, TouchableOpacity, Image, Alert, StyleSheet, TextInput, Modal, SafeAreaView } from 'react-native';
import { KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useEffect, useState } from 'react'
import { Dropdown } from 'react-native-element-dropdown';
import DatePicker from 'react-native-datepicker';
import DateRangePicker from "rn-select-date-range";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useUserContext } from '../../UserContext';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function EditMed(props) {
    const navigation = useNavigation();
    const [show, setShow] = useState(false);
    const [timePickerVisable, setTimePickerVisable] = useState();
    const PlatformType = Platform.OS;
    const task = props.task;
    const [editMode, setEditMode] = useState(true);
    const [frequency, setFrequency] = useState(task.frequency);
    const [medTime, setMedTime] = useState('');
    const medTimes = task.timesInDayArray;
    const [medTimesArr, setMedTimesArr] = useState(medTimes.split(','));
    const originDate = moment(task.drug.toDate).format('DD/MM/YYYY');
    const [toDate, setToDate] = useState(originDate);
    const [modalTimesVisible, setModalTimesVisible] = useState(false);
    const { UpdateDrugForPatientDTO, getAllPublicTasks, userContext } = useUserContext();
    const [visibleEditMed, setVisibleEditMed] = useState(false);

    const medFrequencies = [
        { id: 0, name: 'Once' },
        { id: 1, name: 'Daily' },
        { id: 3, name: 'Weekly' },
        { id: 4, name: 'Monthly' },
    ];
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
        },
    });
    const [userData, setUserData] = useState(useUserContext().userContext);
    const [numberPerDay, setNumberPerDay] = useState(medTimesArr.length);
    const [quantity, setQuantity] = useState(task.drug.dosage);
    const [isEdited, setIsEdited] = useState(false);
    const toggleOverlayEditMed = () => {
        setVisibleEditMed(!props.visibleEditMed);
    };

    function rowForEachTime() {
        const timePickers = [];
        for (let i = 0; i < numberPerDay; i++) {
            {
                Platform.OS === "ios" ?
                    timePickers.push(
                        <View key={i} style={stylesForTimeModal.timePicker}>
                            <View>
                                <Text style={{ fontFamily: 'Urbanist-Light', fontSize: 16, color: '#000' }}>Time {i + 1}</Text>
                            </View>
                            <View>
                                <DatePicker
                                    style={[stylesForTimeModal.doubleRowItem, medTimesArr[i] != null && { borderColor: '#000' }]}
                                    date={medTimesArr[i]}
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
                                        let newArr = [...medTimesArr];
                                        newArr[i] = date;
                                        console.log(newArr);
                                        setMedTimesArr(newArr);
                                    }}
                                />
                            </View>
                        </View>
                    ) :
                    timePickers.push(
                        <RowForAdnriod key={i} index={i} addTimeAndroid={addTimeAndroid} />
                    )
            }
        }
        return timePickers;
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
                    <TouchableOpacity onPress={() => setShow(true)} style={[stylesForTimeModal.doubleRowItem, medTimesArr[props.index] != null && { borderColor: '#000' }]}>
                        <Text style={{ fontFamily: 'Urbanist-Light', fontSize: 16, color: '#000' }}>{medTimesArr[props.index] ? medTimesArr[props.index] : "Add Time"}</Text>
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

    const addTimeAndroid = (time, index) => {
        console.log("time= ", time);
        let newArr = [...medTimesArr];
        console.log("newArr= ", newArr);
        newArr[index] = time;
        console.log("newArr= ", newArr);
        setMedTimesArr(newArr);
    }

    const saveTimeArr = () => {
        for (let i = 0; i < medTimesArr.length; i++) {
            if (medTimesArr[i] === '' || medTimesArr[i] === null) {
                Alert.alert('Please fill in all the time fields');
                return;
            }
        }
        setMedTimesArr(medTimesArr);
        setModalTimesVisible(false);
    };

    const cancelEdit = () => {
        setEditMode(false);
        setFrequency(task.frequency);
        setNumberPerDay(medTimesArr.length);
        setQuantity(task.drug.dosage);
        if (Platform.OS === 'ios') {
            setToDate(originDate);
        }
        else {
            let day = originDate.substring(0, 2);
            let month = originDate.substring(3, 5);
            let year = originDate.substring(6, 10);
            let temp = year + '-' + month + '-' + day;
            let date = moment(temp).format('YYYY-MM-DD');
            setToDate(date);
        }
        setMedTimesArr(medTimesArr);
        setModalTimesVisible(false);
        props.onClose();
    };

    const showDatepicker = () => {
        setShow(true);
    };

    const handleDrugEdited = () => {
        if (quantity == null || quantity == 0) {
            Alert.alert('Please select a quantity');
            return;
        }
        if (numberPerDay == null || numberPerDay == 0) {
            Alert.alert('Please select a number of times per day');
            return;
        }

        if (numberPerDay == null && medTime == '') {
            Alert.alert("please select Time")
            return;
        }
        if (numberPerDay == 1 && medTime) {
            if (Platform.OS === "ios") {
                medTimesArr[0] = medTime
            }
            else {
                medTimesArr[0] = new Date(medTime).toTimeString().substring(0, 5) + ":00"
            }
        }
        if (medTimesArr == null || medTimesArr == '') {
            Alert.alert('Please select a time');
            return;
        }
        //check the type the user for the push notification
        let pushToken = '';
        if (userContext.userType == 'User') {
            pushToken = userContext.pushToken2;
        }
        else {
            pushToken = userContext.pushToken;
        }
        let newDrugForPatient = {
            drugNameEn: task.drug.drugNameEn,
            drugId: task.drug.drugId,
            timesInDayArr: medTimesArr,
            fromDate: moment().format('YYYY-MM-DD'),
            toDate: toDate,
            patientId: task.patientId,
            dosage: quantity,
            taskComment: task.taskComment,
            frequency: frequency,
            qtyInBox: task.drug.qtyInBox,
            workerId: userData.workerId,
            userId: userData.involvedInId,
            pushToken: pushToken,
        }
        let taskForDelete = {
            taskId: task.taskId,
            listId: task.listId,
        }
        let objToSend = {
            newDrugForPatient: newDrugForPatient,
            taskForDelete: taskForDelete,
        }
        console.log(objToSend);
        let addTaskUrl = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Task/InsertActualList';
        fetch(addTaskUrl, {
            method: 'POST',
            body: JSON.stringify(objToSend),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
        })
            .then(async res => {
                if (res.ok) {
                    setModalTimesVisible(false);
                    await getAllPublicTasks(userContext);
                    await props.onClose();
                    navigation.goBack();
                    return res.json();
                }
                else {
                    console.log("not found")
                }
            }
            )
            .catch((error) => {
                console.log("err=", error);
            }
            );
    }

    useEffect(() => {
        let day = toDate.substring(0, 2);
        let month = toDate.substring(3, 5);
        let year = toDate.substring(6, 10);
        let temp = year + '-' + month + '-' + day;
        let date = moment(temp).format('YYYY-MM-DD');
        setToDate(date);
    }, [])

    useEffect(() => {
        console.log("toDate", toDate);
    }, [toDate])

    const onChangeDate = (selectedDate) => {
        const currentDate = new Date(selectedDate.nativeEvent.timestamp).toISOString().substring(0, 10);
        setShow(false);
        if (selectedDate.type == 'set') {
            setToDate(currentDate);
        }
    };

    const onChangeTime = (selectedDate) => {
        const currentTime = new Date(selectedDate.nativeEvent.timestamp).toISOString();
        setTimePickerVisable(false);
        if (selectedDate.type === "set")
            setMedTime(currentTime)
    }

    const showTimePicker = () => {
        setTimePickerVisable(true);
    };

    return (
        <KeyboardAvoidingView style={[styles.container, modalTimesVisible && { backgroundColor: 'rgba(0, 0, 0, 0.75)' }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            {/* Edit Med */}
            <Modal visible={props.visibleEditMed} presentationStyle='pageSheet' animationType='slide' onRequestClose={props.onClose}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                    <View style={[{ flex: 1 }]}>
                        <View style={[{ flex: 1, marginTop: 25 }, modalTimesVisible && { display: 'none' }]}>
                            <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 24, marginVertical: 7, textAlign: 'center' }}>Edit Medication:</Text>
                            <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 22, marginVertical: 7, textAlign: 'center' }}>{task.drug.drugNameEn}</Text>
                        </View>
                        <View style={[styles.editMedContainer, modalTimesVisible && { display: 'none' }]}>
                            {/* End Date */}
                            <View style={[styles.doubleRow]}>
                                <Text style={styles.txtLabel}>End Date: </Text>
                                {PlatformType !== 'ios' ?
                                    <TouchableOpacity style={[styles.doubleRowItem, originDate && { borderColor: '#000' }]} onPress={showDatepicker}>
                                        <Text style={{
                                            color: "#000",
                                            fontFamily: 'Urbanist-Medium',
                                            paddingLeft: 8,
                                            fontSize: 16,
                                        }}>{moment(toDate).format("DD/MM/YYYY")}</Text>
                                    </TouchableOpacity>
                                    :
                                    <DatePicker
                                        useNativeDriver={'true'}
                                        iconComponent={<Feather style={styles.addIcon} name="calendar" size={24} color="#808080" />}
                                        style={[styles.doubleRowItem, originDate && { borderColor: '#000' }]}
                                        date={toDate}
                                        mode="date"
                                        placeholder="dd/mm/yyyy"
                                        format='DD/MM/YYYY'
                                        minDate={new Date()}
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        customStyles={{
                                            dateInput: {
                                                marginLeft: 10,
                                                alignItems: 'center',
                                                borderWidth: 0,
                                            },
                                            placeholderText: {
                                                color: "#000",
                                                fontFamily: 'Urbanist-Medium',
                                                paddingLeft: 8,
                                                fontSize: 16,
                                                textAlign: 'left',
                                            },
                                            dateText: [styles.inputNumber2]
                                        }}
                                        onDateChange={(date) => setToDate(date)}
                                    />
                                }
                                {show && (
                                    <DateTimePicker
                                        value={new Date(toDate)}
                                        // mode={"date"}
                                        is24Hour={true}
                                        placeholder="Date"
                                        minimumDate={new Date()}
                                        onChange={(date) => onChangeDate(date)}
                                        display="default"
                                    />
                                )}
                            </View>
                            {/* number Of intakes */}
                            <View style={styles.doubleRow}>
                                <View>
                                    <Text style={styles.txtLabel}>Number Of Intakes:</Text>
                                </View>
                                <View style={[styles.doubleRowItem, numberPerDay && { borderColor: '#000' }]}>
                                    <TouchableOpacity onPress={() => setNumberPerDay(parseInt(numberPerDay + 1))} style={styles.arrowUp}>
                                        <Ionicons name="md-caret-up-outline" size={18} color="#808080" />
                                    </TouchableOpacity>
                                    <TextInput
                                        style={[styles.inputNumber, numberPerDay && { textAlign: 'center' }]}
                                        placeholderTextColor="#9E9E9E"
                                        placeholder="Number of intakes"
                                        keyboardType='numeric'
                                        returnKeyType='done'
                                        value={numberPerDay == 0 ? '' : numberPerDay.toString()}
                                        onChangeText={text => text == '' ? setNumberPerDay(0) && setMedTime('') : setNumberPerDay(parseInt(text))}
                                    />
                                    {/* Change icon color only onPress to #548DFF  */}
                                    <TouchableOpacity style={styles.arrowDown} onPress={() => numberPerDay == 0 ? setNumberPerDay(0) : setNumberPerDay(parseInt(numberPerDay - 1))}>
                                        <Ionicons name="md-caret-down-outline" size={18} color="#808080" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {/* Quantity */}
                            <View style={styles.doubleRow}>
                                <View>
                                    <Text style={styles.txtLabel}>Quantity:</Text>
                                </View>
                                <View style={[styles.doubleRowItem, quantity && { borderColor: '#000' }]}>
                                    <TouchableOpacity style={styles.arrowUp} disabled={!editMode} onPress={() => setQuantity(parseInt(quantity + 1))}>
                                        <Ionicons name="md-caret-up-outline" size={18} color="#808080" />
                                    </TouchableOpacity>
                                    <TextInput
                                        style={[styles.inputNumber, quantity && { textAlign: 'center' }]}
                                        placeholder="Qty taken"
                                        placeholderTextColor="#9E9E9E"
                                        keyboardType='numeric'
                                        editable={editMode}
                                        returnKeyType='done'
                                        value={quantity.toString()}
                                        onChangeText={text => text == '' ? setQuantity(0) : setQuantity(parseInt(text))}
                                    />
                                    <TouchableOpacity style={styles.arrowDown} disabled={!editMode} onPress={() => quantity == 0 ? setQuantity(0) : setQuantity(parseInt(quantity - 1))}>
                                        <Ionicons name="md-caret-down-outline" size={18} color="#808080" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {/* frequency */}
                            <View style={styles.doubleRow}>
                                <Text style={styles.txtLabel}>Frequency:</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Dropdown
                                        data={medFrequencies}
                                        labelField="name"
                                        valueField="name"
                                        placeholder="Frequency"
                                        fontFamily='Urbanist-Medium'
                                        style={[styles.doubleRowItem, { paddingRight: 10, paddingLeft: 10 }, frequency && { borderColor: '#000' }]}
                                        itemTextStyle={styles.itemStyle}
                                        placeholderStyle={{
                                            color: '#9E9E9E',
                                            fontSize: 16,
                                            fontFamily: 'Urbanist-Medium',
                                        }}
                                        selectedTextStyle={{ color: '#000', textAlign: 'center', paddingLeft: 15 }}
                                        containerStyle={styles.containerMedStyle}
                                        value={frequency}
                                        onChange={item => { setFrequency(item.name) }}
                                        inputSearchStyle={styles.inputSearchStyle}
                                    />
                                </View>
                            </View>
                            {/* Times Array */}
                            {numberPerDay == 0 | numberPerDay == 1 ?
                                <View style={styles.doubleRow}>
                                    <View><Text style={styles.txtLabel}>Intakes Time:</Text></View>
                                    {Platform.OS === "ios" ?
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
                                                    color: '#000',
                                                    fontSize: 16,
                                                    textAlign: 'left',
                                                    fontFamily: 'Urbanist-Medium',
                                                },
                                                dateText: {
                                                    color: '#000',
                                                    fontSize: 16,
                                                    fontFamily: 'Urbanist-Medium',
                                                },
                                            }}
                                            onDateChange={(date) => { setMedTime(date) }}
                                        />
                                        :
                                        <TouchableOpacity style={[styles.doubleRowItem, originDate && { borderColor: '#000' }]} onPress={showTimePicker}>
                                            <Text style={{
                                                color: "#000",
                                                fontFamily: 'Urbanist-Medium',
                                                paddingLeft: 8,
                                                fontSize: 16,
                                            }}>{medTime ? new Date(medTime).toTimeString().substring(0, 5) : "Add Time"}
                                            </Text>
                                            {!medTime && <MaterialCommunityIcons style={styles.addIcon} name="timer-outline" size={24} color="#808080" />}
                                        </TouchableOpacity>
                                    }
                                    {timePickerVisable && (
                                        <DateTimePicker
                                            value={medTime ? new Date(medTime) : new Date()}
                                            mode={"time"}
                                            is24Hour={true}
                                            placeholder="Date"
                                            minimumDate={new Date()}
                                            onChange={(date) => onChangeTime(date)}
                                            display="default"
                                        />
                                    )}
                                </View>
                                :
                                <View style={styles.doubleRow}>
                                    <View><Text style={styles.txtLabel}>Intakes Time:</Text></View>
                                    <TouchableOpacity onPress={() => { setModalTimesVisible(true) }}>
                                        <View style={[styles.doubleRowItem, medTimesArr.length == numberPerDay && { borderColor: '#000' }]}>
                                            <Text style={[styles.inputNumber2, medTimesArr.length == numberPerDay && { color: '#000' }]}>
                                                Change Times
                                            </Text>
                                            <MaterialCommunityIcons style={styles.addIcon} name="timer-outline" size={24} color="#808080" />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>
                        {/* Modal Box For TIMES ARRAY */}
                        <View>
                            <Modal visible={modalTimesVisible} transparent={true} animationType='slide' onRequestClose={() => setModalTimesVisible(false)}>
                                <View style={styles.modalTimesView}>
                                    {/* Header for add times*/}
                                    <View style={styles.modalTimesHeader}>
                                        <Text style={styles.modalText}>Change Medicine</Text>
                                        <Text style={styles.modalText}>Intakes Time</Text>
                                    </View>
                                    {/* Body */}
                                    <View style={{ marginVertical: 15 }}>
                                        <View style={styles.modalTimesBodyContent}>
                                            {rowForEachTime()}
                                        </View>
                                    </View>

                                    <View style={styles.btnModalDate}>
                                        <TouchableOpacity style={styles.footerBtn1} onPress={() => {
                                            setMedTime('');
                                            setModalTimesVisible(false);
                                        }}
                                        >
                                            <Text style={styles.footerTxt1}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.footerBtn2} onPress={saveTimeArr}>
                                            <Text style={styles.footerTxt2}>Save</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>
                        </View>

                        {/* Footer */}
                        <View style={[styles.footer, modalTimesVisible && { display: 'none' }]}>
                            <TouchableOpacity style={styles.footerBtn1} onPress={cancelEdit}>
                                <Text style={styles.footerTxt1}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.footerBtn2} onPress={handleDrugEdited}>
                                <Text style={styles.footerTxt2}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View >
                </TouchableWithoutFeedback>
            </Modal >
        </KeyboardAvoidingView >
    )
}

const styles = StyleSheet.create({
    editMedContainer: {
        flex: 4,
        alignItems: 'center',
        width: SCREEN_WIDTH * 0.975,
    },
    btnModal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        width: SCREEN_WIDTH * 0.95,
    },
    textStyle: {
        color: '#fff',
        fontFamily: 'Urbanist-SemiBold',
        textAlign: 'center',
        fontSize: 16,
    },
    modalText: {
        marginVertical: 5,
        fontFamily: 'Urbanist-SemiBold',
        fontSize: 24,
        textAlign: 'center',
    },
    containerMedStyle: {
        width: SCREEN_WIDTH * 0.45,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F5F8FF',
    },
    txtLabel: {
        fontFamily: 'Urbanist-Medium',
        fontSize: 17,
        color: '#000',
        paddingLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addIcon: {
        position: 'absolute',
        right: 5,
    },
    doubleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: SCREEN_HEIGHT * 0.1,
        width: SCREEN_WIDTH * 0.9,
    },
    doubleRowItem: {
        fontSize: 16,
        width: SCREEN_WIDTH * 0.4,
        borderBottomWidth: 1.5,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
    },
    inputNumber: {
        width: SCREEN_WIDTH * 0.4,
        fontFamily: 'Urbanist-Medium',
        fontSize: 16,
        textAlign: 'center',
    },
    inputNumber2: {
        width: SCREEN_WIDTH * 0.4,
        fontFamily: 'Urbanist-Medium',
        fontSize: 16,
        textAlign: 'center',
        paddingRight: 20,
    },
    iconDropDown: {
        paddingTop: 7
    },
    arrowUp: {
        marginLeft: 10,
        position: 'absolute',
        right: 0,
        top: -5,
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
        right: 0,
        top: 17,
    },
    itemStyle: {
        justifyContent: 'flex-start',
        color: '#9E9E9E',
        fontSize: 16,
        fontFamily: 'Urbanist-Regular',
    },
    placeholderStyle: {
        color: '#9E9E9E',
        fontSize: 16,
        fontFamily: 'Urbanist-Light',
        // paddingLeft: 10
    },
    textStyle: {
        color: '#fff',
        fontFamily: 'Urbanist-SemiBold',
        textAlign: 'center',
        fontSize: 16,
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
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        flex: 1,
        paddingHorizontal: 20, // Added horizontal padding
    },
    footerBtn1: {
        backgroundColor: '#F5F8FF',
        borderRadius: 16,
        height: 54,
        flex: 1,
        width: SCREEN_WIDTH * 0.4,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#548DFF',
    },
    footerBtn2: {
        backgroundColor: '#548DFF',
        borderRadius: 16,
        height: 54,
        flex: 1, // Use flex: 1 to distribute the width evenly
        marginLeft: 10, // Added margin between buttons
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerTxt2: {
        color: '#fff',
        fontFamily: 'Urbanist-SemiBold',
        textAlign: 'center',
        fontSize: 16,
    },
    footerTxt1: {
        color: '#548DFF',
        textAlign: 'center',
        fontFamily: 'Urbanist-SemiBold',
        fontSize: 16,
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
        marginTop: SCREEN_HEIGHT * 0.2,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5
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
        marginVertical: 25,
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
})