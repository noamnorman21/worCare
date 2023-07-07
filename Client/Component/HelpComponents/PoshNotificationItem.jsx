import { View, Text,StyleSheet } from 'react-native'
import React from 'react'

export default function PoshNotificationprops(props) {
    const handlePress = () => {
        //toggle status
        if (props.status == 'P') {
          props.status = 'S';
        }
        else {
          props.status = 'P';
        }
        console.log("props", props);
     
      };
    return (
        <TouchableOpacity
            style={styles.notificationprops}
            onPress={handlePress}
        >
            <View style={styles.iconContainer}>
                <View style={[styles.icon, props.status = "P" ? { backgroundColor: '#F2F8F2' } : { backgroundColor: 'green' }]}>
                    <Ionicons name="calendar" size={24} color={props.status = "P" ? 'red' : 'green'} />
                </View>
            </View>
            <View style={styles.notificationDetails}>
                <Text style={styles.notificationTitle}>
                    {props.title}
                </Text>
                <Text style={styles.notificationMessage}>{props.pushMessage}</Text>
            </View>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    notificationItem: {
        padding: 16,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
      },
      iconContainer: {
        marginRight: 16,
      },
      icon: {
        borderRadius: 54,
        height: 54,
        width: 54,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF3F3',
      },
      notificationDetails: {
        flex: 1,
      },
      notificationTitle: {
        fontSize: 18,
        fontFamily: 'Urbanist-SemiBold',
        marginBottom: 5,
      },
      notificationMessage: {
        fontSize: 14,
        fontFamily: 'Urbanist-Regular',
        color: '#626262',
      },
})




