import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native'
import { useState, useEffect } from 'react'
import { Feather, Octicons } from '@expo/vector-icons';
import { useUserContext } from '../../UserContext';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function TaskCheckBox(props) {
    const [isDone, setIsDone] = useState(false);
    const checkIcon = ["check-circle", "circle"]
    const { updateActualTask } = useUserContext();

    //if isDone is true for at least 3 seconds, start the function finshTaskFunction, if the user press on the check icon again, the timer will be canceled
    useEffect(() => {
        if (isDone) {
            const timer = setTimeout(() => {
                finshTaskFunction();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isDone]);



    const openTaskList = () => {
        //צריך ליצור את ההמשך במסכים
        props.moveScreens(props.task);

    }
    async function finshTaskFunction() {
        if (!isDone) {
            alert("Task is not done yet")
            return;
        }
        let doneTask = props.task;
        doneTask.taskStatus = 'F';
        updateActualTask(doneTask, props.isPrivate);
        if (props.isPrivate) {
            props.refreshPrivateTask();            
        }
        else {
            props.refreshPublicTask();
        }
        setIsDone(false);
    }


    const isPrivate = props.isPrivate;
    return (
        <View style={[styles.container, isPrivate ? { backgroundColor: '#FFF7EB' } : {}]}>

            <TouchableOpacity onPress={() => setIsDone(!isDone)}>
                <Feather name={isDone ? checkIcon[0] : checkIcon[1]} size={27} color={!isPrivate ? '#548DFF' : '#FEA529'} />
            </TouchableOpacity >

            <Text style={styles.text}>
                {[props.task.type == true ? props.task.drug.drugType + ' - ' + props.task.taskName : props.task.taskName]}
            </Text>

            <TouchableOpacity style={styles.iconArrow} onPress={openTaskList}>
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
