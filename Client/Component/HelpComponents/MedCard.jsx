import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert, Image } from 'react-native'
import { useState, useEffect } from 'react'
import { MaterialCommunityIcons, AntDesign, Feather, Ionicons, Octicons } from '@expo/vector-icons';
import { useUserContext } from '../../UserContext';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function MedCard(props) {
    const { updateActualTask } = useUserContext();
    const [medTypeIcon, setMedTypeIcon] = useState('');
    const [isDone, setIsDone] = useState(false);
    const [lastTakenDate, setLastTakenDate] = useState('');
    const [lastTakenTime, setLastTakenTime] = useState('');
    const [timeInDay, setTimeInDay] = useState('');
    const backGroundColorIcon = ["#D0DFFF", "rgba(255, 60, 60, 0.25)"];
    const iconColors = ["#548DFF", "#FF3C32"]
    const [runlow, setRunlow] = useState(false);

    useEffect(() => {
        findType()
        sparateTimeStemp()
        findRunningLow()
    }, [])

    useEffect(() => {
        if (isDone) {
            const timer = setTimeout(() => {
                finshTaskFunction();
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isDone]);

    async function finshTaskFunction() {
        if (!isDone) {
            Alert.alert("Task is not done yet")
            return;
        }
        let doneTask = props.task;
        doneTask.taskStatus = 'F';
        updateActualTask(doneTask, false);
        setIsDone(false);
    }

    const findRunningLow = async () => {
        if (props.task.drug.minQuantity >= props.task.drug.qtyInBox) {
            setRunlow(true);
        }
        else {
            setRunlow(false);
        }
    }

    const findType = async () => {
        if (props.task.drug.drugType == "Syrup") {
            setMedTypeIcon(require("../../assets/Syrup.png"))
        } else if (props.task.drug.drugType == "Pill") {
            setMedTypeIcon(require("../../assets/Pill.png"))
        } else if (props.task.drug.drugType == "Cream") {
            setMedTypeIcon(require("../../assets/Cream.png"))
        } else if (props.task.drug.drugType == "Powder") {
            setMedTypeIcon(require("../../assets/Powder.png"))
        } else { //default 
            setMedTypeIcon(require("../../assets/Syrup.png"))
        }
    }

    const sparateTimeStemp = async () => {
        if (props.task.drug.lastTakenDate == null) {
            setLastTakenDate('never taken yet')
            setLastTakenTime("")
        }
        else {
            let time = props.task.drug.lastTakenDate.split("T")
            let date = time[0].split("-")
            let hour = time[1].split(":")
            setLastTakenDate(date[2] + "/" + date[1] + "/" + date[0])
            setLastTakenTime(hour[0] + ":" + hour[1])
        }
        let timeInDay = props.task.TimeInDay.split(":")
        setTimeInDay(timeInDay[0] + ":" + timeInDay[1])
    }

    const taggleIsDone = () => {
        setIsDone(!isDone)
    }

    const navigateToMed = () => {
        props.navigateToMed(props.task, runlow, medTypeIcon, timeInDay)
    }

    return (
        <View style={styles.container}>
            <View style={styles.timeRow}>
                <Text style={styles.timeTxt}>{timeInDay}</Text>
            </View>
            <View style={styles.medDetails}>
                <View style={styles.iconContainer} >
                    <View style={[styles.icon, { backgroundColor: runlow ? backGroundColorIcon[1] : backGroundColorIcon[0] }]} >
                        <Image source={medTypeIcon} style={{ width: 20, height: 20 }} />
                    </View>
                </View>

                <View style={styles.medMainView}>
                    <View style={styles.firstRowContainer}>
                        <View style={styles.medName}>
                            <Text style={styles.MedNameTxt}>{props.task.taskName}</Text>
                        </View>
                        {
                            runlow &&
                            <View style={styles.runningLowView}>
                                <Feather name="alert-triangle" size={15.5} color="#FF3C3C" />
                                <Text style={styles.runningLowTxt}>Running Low</Text>
                            </View>
                        }
                    </View>

                    <Text style={styles.lastTimeTakenTxt}>last taken {<Text style={{ fontFamily: 'Urbanist-Bold', }}>{lastTakenTime}</Text>}  {lastTakenDate}</Text>
                </View>

                <View style={styles.iconCheckBoxContainer}>
                    <TouchableOpacity onPress={taggleIsDone}>
                        {
                            isDone ?
                                <Feather name="check-circle" size={25} color={runlow ? backGroundColorIcon[1] : iconColors[0]} />
                                :
                                <Feather name="circle" size={25} color={runlow ? backGroundColorIcon[1] : iconColors[0]} />
                        }
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.iconArrow} onPress={navigateToMed} >
                        <View>
                            <Octicons name="chevron-right" size={24} color={runlow ? iconColors[1] : iconColors[0]} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.line}>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 85,
        width: SCREEN_WIDTH * 0.9,
        flexDirection: 'cloumn',
        marginVertical: 10,
    },
    firstRowContainer: {
        flexDirection: 'row',
    },
    icon: {
        backgroundColor: '#D0DFFF',
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        width: 48,
        borderRadius: 54,
    },
    timeTxt: {
        fontSize: 16,
        fontFamily: 'Urbanist-Medium',
    },
    iconContainer: {
        flex: 0.75,
        height: '100%',
    },
    MedNameTxt: {
        fontSize: 13,
        fontFamily: 'Urbanist-SemiBold',
    },
    iconCheckBoxContainer: {
        flex: 0.6,
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        flexDirection: 'row',
        height: '100%',
    },
    medMainView: {
        flex: 3,
        justifyContent: 'center',
        height: '100%',
    },
    timeRow: {
        flex: 3,
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: '100%',
    },
    medDetails: {
        flex: 6,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        flexDirection: 'row',
    },
    lastTimeTakenTxt: {
        fontSize: 12,
        marginTop: 5,
        fontFamily: 'Urbanist-Regular',
        color: '#626262',
    },
    line: {
        width: '100%',
        height: 0.5,
        backgroundColor: '#808080',
        opacity: 0.5,
        marginTop: 10,
    },
    runningLowView: {
        backgroundColor: 'rgba(255, 60, 60, 0.25)',
        flexDirection: 'row',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 5,
        height: 22,
        flex: 1,
    },
    medName: {
        flex: 1.15,
    },
    runningLowTxt: {
        fontSize: 12,
        fontFamily: 'Urbanist-SemiBold',
        color: '#FF3C3C',
        marginLeft: 5,
    }
})