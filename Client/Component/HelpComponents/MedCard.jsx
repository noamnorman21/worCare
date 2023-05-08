import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native'
import { useState, useEffect } from 'react'
import { Feather, Ionicons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function MedCard(props) {
    const [medType, setMedType] = useState('');
    const [isDone, setIsDone] = useState(false);
    const [lastTakenDate, setLastTakenDate] = useState('');
    const [lastTakenTime, setLastTakenTime] = useState('');
    const [timeInDay, setTimeInDay] = useState('');

    //להוציא מהערה ולשנות לאחר שיש נתונים מהדאטה בייס, -לשנות גם לאייקונים הנכונים (נועם)

    const iconsNamesArr = [
        {
            1: "pills",
            2: "calendar",
            3: "calendar",
            4: "calendar",
        }]
    useEffect(() => {

        // findType()
        sparateTimeStemp()
    }, [])

    const findType = () => {
        if (props.task.drugType == "Syrup") {
            setMedType("Syrup")
        }
        else if (props.task.drug.drugType == "Pills") {
            setMedType("Pills")
        }
        else if (props.task.drugType == "Cream") {
            setMedType("Cream")
        }
        else if (props.task.drugType == "Powder") {
            setMedType("Powder")
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



    return (
        <View style={styles.container}>
            <View style={styles.timeRow}>
                <Text style={styles.timeTxt}>{timeInDay}</Text>
            </View>
            <View style={styles.medDetailes}>
                <View style={styles.iconContainer}>
                    <View style={styles.icon} >
                        <Ionicons name="calendar" size={24} color="black" />
                        {/* <Ionicons name={medType}size={24} color="black" /> */}
                    </View>

                </View>
                <View style={styles.medMainView}>
                    {/* <Text style={styles.MedNameTxt}>med name </Text> */}
                    <Text style={styles.MedNameTxt}>{props.task.taskName}</Text>

                    <Text style={styles.lastTimeTakenTxt}>last taken  {lastTakenTime}  {lastTakenDate}</Text>
                </View>
                <View style={styles.iconCheckBox}>
                    <Text style={styles.timeTxt}>צק בוקס</Text>
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
        backgroundColor: '#EBF1FF',
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
        backgroundColor: "yellow",
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