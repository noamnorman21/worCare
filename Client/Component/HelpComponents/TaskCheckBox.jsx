import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native'
import { useState, useEffect } from 'react'
import { Feather, Octicons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function TaskCheckBox(props) {
    const [isDone, setIsDone] = useState(false);
    const checkIcon = ["check-circle", "circle"]
    useEffect(() => {
        //timer for 5 seconds, after 5 seconds the id of the task will be sent to the parent component
        if (isDone) {
            setTimeout(() => {
                setIsDone(false);
                // props.onPress(props.task.id);לא קיים כרגע, להוסיף בהמשך בשביל לסמן משימה כבוצעה 
            }, 3000);
        }
    }, [isDone]);

    const openTaskList = () => {
        //צריך ליצור את ההמשך במסכים
        //if it a private task, open nevaigation to MainTasks
        if (props.task.isPrivate) {
            props.navigation.navigate('MainTasks', { task: props.task });
        }
        //if it a general task, open nevaigation to MainTasks
        else if (props.task.type == 'General') {
            props.navigation.navigate('MainTasks', { task: props.task });
        }
        //if it a shop task, open nevaigation to shop
        else if (props.task.type == 'Shop') {
            props.navigation.navigate('ShopTasks', { task: props.task });
        }
        //if it Medicine task, open nevaigation to Medicine
        else if (props.task.type == 'Medicine') {
            props.navigation.navigate('MedicineTasks', { task: props.task });
        }
    }

    // let isPrivate=props.task.isPrivate; //להוציא מההערה אחרי שנשלח 
    const isPrivate = props.isPrivate;//רק לבדיקה עד שנשלח, כי אין עדיין פונקציה שמחזירה את הפרטים של המשימה
    return (
        <View style={[styles.container, isPrivate ? { backgroundColor: '#FFF7EB' } : {}]}>

            <TouchableOpacity onPress={() => setIsDone(!isDone)}>
                <Feather name={isDone ? checkIcon[0] : checkIcon[1]} size={27} color={!isPrivate ? '#548DFF' : '#FEA529'} />
            </TouchableOpacity >

            <Text style={styles.text}>
                {[props.task.type == true ? props.task.drug.drugType + ' - ' + props.task.taskName : props.task.taskName]}
            </Text>

            <TouchableOpacity style={styles.iconArrow} onPress={() => (Alert.alert('Not Working For Now...\n סבלנות'))}>
                <View style={{ paddingHorizontal: 20 }}>
                    <Octicons name="chevron-right" size={24} color="#548DFF" />
                </View>
            </TouchableOpacity>
        </View >
    )
}
const styles = StyleSheet.create({
    container: {
        height: 54,
        width: SCREEN_WIDTH * 0.9,
        backgroundColor: '#EBF1FF',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
        marginVertical: 10,
    },
    text: {
        fontSize: 17,
        fontFamily: 'Urbanist-Bold',
        color: '#000',
        paddingLeft: 20,
    },
    iconArrow: {
        position: 'absolute',
        right: 0,
    }
});
