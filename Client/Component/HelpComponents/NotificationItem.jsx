import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';

export default function NotificationItem(props) {
 const [isRead, setIsRead] = useState(props.item.status = "P" ? false : true);

    const handlePress = () => {
        setIsRead(!isRead);
        //change status in DB later   
    };
    return (
        <TouchableOpacity
            style={styles.notificationprops}
            onPress={handlePress}
        >
            <View style={styles.iconContainer}>
                <View style={[styles.icon, isRead  ? { backgroundColor: '#F2F8F2' } : { backgroundColor: 'green' }]}>
                    <Ionicons name="calendar" size={24} color={isRead ? 'red' : 'green'} />
                </View>
            </View>
            <View style={styles.notificationDetails}>
                <Text style={styles.notificationTitle}>
                    {props.item.title}
                </Text>
                <Text style={styles.notificationMessage}>{props.item.pushMessage}</Text>
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