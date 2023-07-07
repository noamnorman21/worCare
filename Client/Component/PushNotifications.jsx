import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, SafeAreaView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUserContext } from '../UserContext';
import NotificationItem from './HelpComponents/NotificationItem';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
export default function PushNotifications() {
  const { notifications, userContext, GetNotificationsThatSent } = useUserContext();  //now its one array of notifications, not sorted by date(but can be sorted by date if Noam will want it)
  //came from context(from DB), example for notification object in the array:
  //   {
  //     "notificationID": 4,
  //     "title": "New Payment Request",
  //     "pushMessage": "You have a new payment request from Ofir for 500NIS",
  //     "time": "2023-07-06T10:13:00",
  //     "userId": 1104,
  //     "status": "P"
  // }
  const [notificationsArr, setNotificationsArr] = useState(notifications);
  const userId = userContext.userId;
  useEffect(() => {
    return () => {
      GetNotificationsThatSent(userId)
      setNotificationsArr([]);
    };
  }, []);

  const renderItem = ({ item }) => {
    return (
      //its in HelpComponents folder
      <NotificationItem item={item} />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.contentContainer]}>
        <FlatList
          data={notificationsArr}
          keyExtractor={(item) => item.notificationID.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH * 1,
    height: 'auto',
    minHeight: 75,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flexGrow: 1,
  },
  listContent: {
    flexGrow: 1,
    marginLeft: 16,
    marginBottom: 16,
  },
});