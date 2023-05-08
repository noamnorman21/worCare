import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native'
import { useState, useEffect } from 'react'
import { Feather, Ionicons } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function TaskView(props) {
  const colorBackIcon = ['#FFE7C2', '#D0DFFF'];
  const colorIcon = ['#FEA529', '#548DFF'];


  const isPrivate = props.isPrivate;
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  useEffect(() => {
    console.log(props.task)
    checkDate()
  }, [])

  const checkDate = () => {
    // "TimeInDay": "20:00:00" -- Remove the seconds
    let hour = props.task.TimeInDay.slice(0, 2);
    let minutes = props.task.TimeInDay.slice(3, 5);
    setTime(hour + ':' + minutes);

    //"taskDate": "2023-05-09T00:00:00"      
    let year = props.task.taskDate.slice(0, 4);
    let month = props.task.taskDate.slice(5, 7);
    let day = props.task.taskDate.slice(8, 10);
    let tempDate = day + '/' + month + '/' + year;
    if (tempDate == '07/05/2023') {
      setDate('Today');
    }
    else {
      setDate(day + '/' + month + '/' + year);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.taskTitle}>
        <View style={styles.iconContainer} >
          <View style={[styles.icon, isPrivate ? { backgroundColor: colorBackIcon[0] } : { backgroundColor: colorBackIcon[1] }]}>
            <Ionicons name="calendar" size={24} color={isPrivate ? colorIcon[0] : colorIcon[1]} />
          </View>
        </View>
        <View style={styles.taskDetails}>
          <Text style={styles.taskTitleTxt}>
            {props.task.taskName}
          </Text>
          {

          }
          <Text style={styles.taskSmallTxt}>
            {date}{"  |  "}{time}
          </Text>
        </View>
      </View>

      <View style={styles.taskComment}>
        <Text style={styles.txtTaskComment}>
          {props.task.taskComment}
          {/* You have an oppointment with Dr. Alan watson at the clinic ShakShuka on December 24.2024. 10:00 Am. Dont forget to activate your reminder. */}
        </Text>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH * 0.9,
    flexDirection: 'column',
    height: 150,
  },
  taskTitleTxt: {
    fontSize: 18,
    fontFamily: 'Urbanist-SemiBold',
    marginBottom: 5,
  },
  taskSmallTxt: {
    fontSize: 14,
    fontFamily: 'Urbanist-Regular',
    color: '#626262',
  },
  txtTaskComment: {
    fontSize: 16,
    fontFamily: 'Urbanist-Regular',
    color: '#000',
  },
  taskComment: {
    flex: 1.5,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: SCREEN_WIDTH * 0.9,
    paddingLeft: 30,
    flexDirection: 'row',
  },
  taskTitle: {
    flex: 1,
    width: SCREEN_WIDTH * 0.9,
    flexDirection: 'row',
  },
  iconContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
  },
  icon: {
    borderRadius: 54,
    height: 54,
    width: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskDetails: {
    flex: 5,
    height: '100%',
  },
})
