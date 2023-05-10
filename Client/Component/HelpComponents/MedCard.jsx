import { View, Text, StyleSheet, Dimensions, TouchableOpacity,Alert,Image } from 'react-native'
import { useState, useEffect } from 'react'
import { MaterialCommunityIcons, AntDesign, Feather, Ionicons, Octicons } from '@expo/vector-icons';
const SCREEN_WIDTH = Dimensions.get('window').width;
import { useUserContext } from '../../UserContext';

export default function MedCard(props) {

    const { updateActualTask } = useUserContext();
    const [medTypeIcon, setMedTypeIcon] = useState('');
    const [isDone, setIsDone] = useState(false);
    const [lastTakenDate, setLastTakenDate] = useState('');
    const [lastTakenTime, setLastTakenTime] = useState('');
    const [timeInDay, setTimeInDay] = useState('');

    useEffect(() => {
        findType()
        sparateTimeStemp()
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
            alert("Task is not done yet")
            return;
        }
        let doneTask = props.task;
        doneTask.taskStatus = 'F';
        updateActualTask(doneTask, false);
        setIsDone(false);
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
        //setIsDone(!isDone)
        alert(props.task.drug.drugType)
    }


    return (
        <View style={styles.container}>
            <View style={styles.timeRow}>
                <Text style={styles.timeTxt}>{timeInDay}</Text>
            </View>
            <View style={styles.medDetailes}>
                <View style={styles.iconContainer}>
                    <View style={styles.icon} >
                        <Image source={medTypeIcon} style={{ width: 20, height: 20 }} />
                    </View>
                </View>
                <View style={styles.medMainView}>
                    {/* <Text style={styles.MedNameTxt}>med name </Text> */}
                    <Text style={styles.MedNameTxt}>{props.task.taskName}</Text>
                    <Text style={styles.lastTimeTakenTxt}>last taken {<Text style={{fontFamily:'Urbanist-Bold',}}>{lastTakenTime}</Text>}  {lastTakenDate}</Text>
                </View>
                <View style={styles.iconCheckBox}>
                    <TouchableOpacity onPress={taggleIsDone}>
                        {
                            isDone ?
                                <Feather name="check-circle" size={25} color="#548DFF" />
                                :
                                <Feather name="circle" size={25} color="#548DFF" />
                        }
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.iconArrow} >
                        <View style={{ paddingHorizontal: 20 }}>
                            <Octicons name="chevron-right" size={24} color="#333333" />
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
        width: SCREEN_WIDTH * 0.88,
        flexDirection: 'cloumn',
        marginVertical: 10,
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
        flex: 1,
        height: '100%',

    },
    MedNameTxt: {
        fontSize: 16,
        fontFamily: 'Urbanist-SemiBold',
    },
    iconCheckBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: "yellow",
        flexDirection: 'row',
        height: '100%',
    },
    medMainView: {
        flex: 3,
        // alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    timeRow: {
        flex: 3,
        alignItems: 'flex-start',
        justifyContent: 'center',
        width: '100%',
    },
    iconArrow: {
        marginLeft: 15,
    },
    medDetailes: {
        flex: 6,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        flexDirection: 'row',
    },
    lastTimeTakenTxt: {
        fontSize: 12,
        fontFamily: 'Urbanist-Regular',
        color: '#626262',
    },
    line: {
        width: '100%',
        height: 0.5,
        backgroundColor: '#808080',
        opacity: 0.5,
        marginTop: 10,
    }

})