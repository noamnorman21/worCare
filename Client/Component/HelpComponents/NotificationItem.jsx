import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import { Ionicons, Feather } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import { useUserContext } from '../../UserContext';
import moment from 'moment';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function NotificationItem(props) {
    const [isRead, setIsRead] = useState(false);
    const { UpdateNotificationStatus } = useUserContext();
    const pushTime = moment(props.item.time).format('DD/MM/YYYY HH:mm');
    const iconColors = ['#2CCDAC', '#FF6077'];

    useEffect(() => {
        if (props.item.status === "S") {
            setIsRead(true);
        }
    }, []);

    const handlePress = () => {
        setIsRead(true);
        console.log(props.item.notificationID);
        UpdateNotificationStatus(props.item.notificationID);
    };

    return (
        <>
            <View style={styles.container}>
                <View style={styles.iconContainer}>
                    <View style={[styles.icon, isRead ? { backgroundColor: '#F2F8F2' } : { backgroundColor: '#FFF3F3' },]}>
                        <Ionicons name="calendar" size={24} color={isRead ? iconColors[0] : iconColors[1]} />
                    </View>
                </View>
                <View style={styles.notificationDetails}>
                    <View style={styles.row}>
                        <Text style={styles.titleTxt}>{props.item.title}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.detailsTxt}>{props.item.pushMessage}
                            {
                                !isRead && (
                                    <Text style={styles.timeTxt}> Recieved At: {<Text style={styles.timeTxt}>{pushTime}</Text>}</Text>
                                )
                            }
                        </Text>
                    </View>
                </View>
                <View style={styles.circleContainer}>
                    {!isRead ? (
                        <TouchableOpacity onPress={handlePress} style={{ width: '100%', height: '100%', alignItems: 'flex-start', justifyContent: 'center' }}>
                            <Feather name="circle" size={22} color={iconColors[1]} />
                        </TouchableOpacity>
                    ) : (
                        <Feather name="check-circle" size={22} color={iconColors[0]} />

                    )}
                </View>
            </View>
            <View style={styles.line} />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: SCREEN_WIDTH * 0.975,
        flexDirection: 'row',
        marginVertical: 10,
        alignItems: 'center',
    },
    circleContainer: {
        height: '100%',
        alignItems: 'flex-start',
        justifyContent: 'center',
        flexDirection: 'column',
        flex: 0.5,
    },
    circle: {
        width: 15,
        height: 15,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#808080',
    },
    iconContainer: {
        marginRight: 10,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
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
        flex: 3,
    },
    row: {
        flex: 1,
    },
    titleTxt: {
        fontSize: 16,
        fontFamily: 'Urbanist-SemiBold',
        marginBottom: 5,
        marginLeft: 5,
    },
    detailsTxt: {
        fontSize: 14,
        fontFamily: 'Urbanist-Regular',
        color: '#626262',
        lineHeight: 20,
        paddingHorizontal: 5,
    },
    timeTxt: {
        fontSize: 12,
        fontFamily: 'Urbanist-Bold',
        color: '#626262',
        alignSelf: 'flex-end',
        marginTop: 5,
    },
    line: {
        height: 0.5,
        backgroundColor: '#808080',
        opacity: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        width: SCREEN_WIDTH * 0.935,
    },
});