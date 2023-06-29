import { View, Text, Dimensions, Platform, TouchableOpacity, Image, Alert, StyleSheet, TextInput, Modal, SafeAreaView } from 'react-native';
import { useEffect, useState } from 'react'
import { Dropdown } from 'react-native-element-dropdown';
import DatePicker from 'react-native-datepicker';
import DateRangePicker from "rn-select-date-range";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useUserContext } from '../../UserContext';
import moment from 'moment';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function EditMed(props) {
    const [show, setShow] = useState(false);
    const PlatformType = Platform.OS;
    const task = props.task;
    const [editMode, setEditMode] = useState(true);
    const [frequency, setFrequency] = useState(task.frequency);
    const medFrequencies = [
        { id: 0, name: 'Once' },
        { id: 1, name: 'Daily' },
        { id: 3, name: 'Weekly' },
        { id: 4, name: 'Monthly' },
    ]
    const timePickers = [];
    const [medTime, setMedTime] = useState('')
    const [medTimeArr, setMedTimeArr] = useState([])
    const [toDate, setToDate] = useState(null);
    const [modalTimesVisible, setModalTimesVisible] = useState(false);
    const { UpdateDrugForPatientDTO, getAllPublicTasks } = useUserContext();
    const [visibleEditMed, setVisibleEditMed] = useState(props.visible);
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
    const originDate = moment(task.toDate).format('YYYY-MM-DD');
    const [numberPerDay, setNumberPerDay] = useState(1);
    const [quantity, setQuantity] = useState(task.drug.dosage);
    const toggleOverlayEditMed = () => {
        setVisibleEditMed(!visibleEditMed);
    };

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
        toggleOverlayEditMed(); // <-- Fix the function name here
    }

    const handeleDrugChange = (item) => {
        setSelectedDrugName(item);
        if (task.drug.Type != 'Pill') {
            setEditMode(false);
            setQuantity(1);
        }
        else {
            setEditMode(true);
            setQuantity(0);
        }
    }

    const showMode = (currentMode) => {
        if (Platform.OS === 'android') {
            setShow(true);
            // for iOS, add a button that closes the picker
        }
        else {
            setShow(true);
        }
    };

    const showDatepicker = () => {
        showMode('date');
    };

    return (
        <SafeAreaView style={{ flex: 1, flexDirection: 'row' }}>
            {/* Edit Med */}
            <Modal presentationStyle='pageSheet' visible={true} onRequestClose={toggleOverlayEditMed} animationType="slide">
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 20, marginVertical: 5, textAlign: 'center' }}>Edit Medication:</Text>
                        <Text style={{ fontFamily: 'Urbanist-SemiBold', fontSize: 18, marginVertical: 5, textAlign: 'center' }}>{task.drug.drugNameEn}</Text>
                    </View>
                    <View style={styles.editMedContainer}>
                        {/* toDate */}
                        <View style={[styles.doubleRow, modalTimesVisible && { display: 'none' }]}>
                            <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 16 }}>To Date: </Text>
                            {PlatformType !== 'ios' ?
                                <TouchableOpacity style={styles.datePicker} onPress={showDatepicker}></TouchableOpacity>
                                :
                                <DatePicker
                                    useNativeDriver={'true'}
                                    iconComponent={<Feather style={styles.addIcon} name="calendar" size={24} color="#808080" />}
                                    style={[styles.doubleRowItem, originDate && { borderColor: '#000' }]}
                                    date={originDate}
                                    mode="date"
                                    placeholder="dd/mm/yyyy"
                                    format="YYYY-MM-DD"
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
                                            color: "#9E9E9E",
                                            fontFamily: 'Urbanist-Light',
                                            paddingLeft: 8,
                                            fontSize: 16,
                                            textAlign: 'left',
                                        },
                                        dateText: [styles.inputNumber, originDate && { fontFamily: 'Urbanist-Medium' }]
                                    }}
                                    onDateChange={(date) => setToDate(date)}
                                />
                            }
                            {show && (
                                <DateTimePicker
                                    value={new Date(originDate)}
                                    // mode={"date"}
                                    is24Hour={true}
                                    placeholder="Date"
                                    minimumDate={new Date(2000, 0, 1)}
                                    onDateChange={(date) => setToDate(date)}
                                    display="default"
                                    maximumDate={new Date()}
                                />
                            )}
                        </View>
                        {/* number Of intakes */}
                        <View style={styles.doubleRow}>
                            <View>
                                <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 16 }}>Number Of intakes:</Text>
                            </View>
                            <View style={[styles.doubleRowItem, numberPerDay && { borderColor: '#000' }]}>
                                <TouchableOpacity onPress={() => setNumberPerDay(parseInt(numberPerDay + 1))} style={styles.arrowUp}>
                                    <Ionicons name="md-caret-up-outline" size={17} color="#808080" />
                                </TouchableOpacity>
                                <TextInput
                                    // mode="outlined"
                                    // label={numberPerDay == 0 ? 'Number per day' : ''}
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
                                    <Ionicons name="md-caret-down-outline" size={17} color="#808080" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* Quantity */}
                        <View style={styles.doubleRow}>
                            <View>
                                <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 16 }}>Quantity:</Text>
                            </View>
                            <View style={[styles.doubleRowItem, quantity && { borderColor: '#000' }]}>
                                <TouchableOpacity style={styles.arrowUp} disabled={!editMode} onPress={() => setQuantity(parseInt(quantity + 1))}>
                                    <Ionicons name="md-caret-up-outline" size={17} color="#808080" />
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
                                    {/* Change icon color only onPress to #548DFF  */}
                                    <Ionicons name="md-caret-down-outline" size={17} color="#808080" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* frequency */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: SCREEN_WIDTH * 0.95, marginVertical: 10 }}>
                            <Text style={{ fontFamily: 'Urbanist-Regular', fontSize: 16 }}>Frequency:</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Dropdown
                                    data={medFrequencies}
                                    labelField="name"
                                    valueField="name"
                                    placeholder="Frequency"
                                    fontFamily='Urbanist-Regular'
                                    style={[styles.doubleRowItem, { paddingRight: 10, paddingLeft: 10 }, frequency && { borderColor: '#000' }]}
                                    itemTextStyle={styles.itemStyle}
                                    placeholderStyle={{
                                        color: '#9E9E9E',
                                        fontSize: 16,
                                        fontFamily: 'Urbanist-Light',
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
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: SCREEN_WIDTH * 0.975, marginVertical: 10 }}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={toggleOverlayEditMed}>
                            <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 16, color: '#fff' }}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.okBtn} onPress={editMed}>
                            <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 16, color: '#7DA9FF' }}>Okay</Text>
                        </TouchableOpacity>
                    </View>
                </View >
            </Modal >
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    editMedContainer: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        width: SCREEN_WIDTH * 0.975,
        marginVertical: 10,
    },
    containerMedStyle: {
        width: SCREEN_WIDTH * 0.45,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F5F8FF',
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
        width: SCREEN_WIDTH * 0.95,
    },
    doubleRowItem: {
        fontSize: 16,
        width: SCREEN_WIDTH * 0.45,
        borderWidth: 1.5,
        borderColor: '#E6EBF2',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
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
}
)