import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { useState, useEffect } from 'react'
import React from 'react'
import { RoundedCheckbox, PureRoundedCheckbox, } from "react-native-rounded-checkbox";
import { Octicons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;
export default function TaskCheckBox(props) {
    const [isDone, setIsDone] = useState(false);
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
    useEffect(() => {
        //timer for 5 seconds, after 5 seconds the id of the task will be sent to the parent component
        if (isDone) {
            setTimeout(() => {
                setIsDone(false);
                // props.onPress(props.task.id);לא קיים כרגע, להוסיף בהמשך בשביל לסמן משימה כבוצעה 
            }, 3000);
        }
    }, [isDone]);

    // let isPrivate=props.task.isPrivate; //להוציא מההערה אחרי שנשלח 
    let isPrivate = false;//רק לבדיקה עד שנשלח, כי אין עדיין פונקציה שמחזירה את הפרטים של המשימה
    return (
        <View style={[styles.container, isPrivate ? { backgroundColor: '#FFF7EB' } : {}]}>

            <TouchableOpacity onPress={openTaskList}>
                <View style={{ backgroundColor: isPrivate ? '#FFF7EB' : '#EBF1FF' }}>
                    <RoundedCheckbox
                        innerStyle={[styles.checkboxOuterStyle, { borderColor: isPrivate ? '#FEA529' : '#548DFF' }]}
                        outerStyle={[styles.checkboxOuterStyle, { borderColor: isPrivate ? '#FEA529' : '#548DFF' }]}
                        uncheckedTextColor='transparent'
                        uncheckedColor='transparent'
                        checkedColor='transparent'
                        children={isDone ? <Octicons name="check" size={20} color={isPrivate ? '#FEA529' : '#548DFF'} /> : ''}
                        text=''
                        checked={isDone}
                        onPress={() => setIsDone(!isDone)}
                    />
                </View>
            </TouchableOpacity>

            <Text style={styles.text}>
                {[props.task.type == true ? 'Pill - ' + props.task.taskName : props.task.taskName]}
            </Text>

            <TouchableOpacity style={styles.iconArrow} onPress={() => props.onPress(props.task.id)}>
                <View style={{ paddingHorizontal: 20 }}>
                    <Octicons name="chevron-right" size={22} color="black" />
                </View>
            </TouchableOpacity>
        </View>
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
    checkboxOuterStyle: {
        height: 30,
        width: 30,
        borderRadius: 50,
        borderWidth: 2,
        backgroundColor: 'transparent',
    },
    text: {
        fontSize: 17,
        fontFamily: 'Urbanist-Bold',
        color: '#000000',
        marginLeft: 20,
    },
    iconArrow: {
        position: 'absolute',
        right: 0,
    }
});
