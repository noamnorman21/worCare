import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, SafeAreaView, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useUserContext } from '../UserContext';
import NotificationItem from './HelpComponents/NotificationItem';
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export default function PushNotifications() {

  const [showToday, setShowToday] = useState(false);
  const [showYesterday, setShowYesterday] = useState(false);
  const todayContentHeight = useRef(new Animated.Value(0)).current;
  const yesterdayContentHeight = useRef(new Animated.Value(0)).current;


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
      console.log(userId);
      GetNotificationsThatSent(userId)
      setNotificationsArr([]);
    };
  }, []);


  const toggleToday = () => {
    if (showToday) {
      Animated.timing(todayContentHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setShowToday(false);
      });
    } else {
      setShowToday(true);
      Animated.timing(todayContentHeight, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const toggleYesterday = () => {
    if (showYesterday) {
      Animated.timing(yesterdayContentHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setShowYesterday(false);
      });
    } else {
      setShowYesterday(true);
      Animated.timing(yesterdayContentHeight, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const todayContentStyle = {
    maxHeight: todayContentHeight.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 500], // Adjust the max height as needed
    }),
    overflow: 'hidden',
  };

  const yesterdayContentStyle = {
    maxHeight: yesterdayContentHeight.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 500], // Adjust the max height as needed
    }),
    overflow: 'hidden',
  };

  const renderItem = ({ item }) => {
    return (
      //its in HelpComponents folder
      <NotificationItem item={item} />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={toggleToday}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Today</Text>
          <Ionicons name={showToday ? 'chevron-up' : 'chevron-down'} size={30} color="#548DFF" />
        </View>
      </TouchableOpacity>
      <Animated.View style={[styles.contentContainer, todayContentStyle]}>
        <FlatList
          data={notificationsArr}
          keyExtractor={(item) => item.notificationID.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontFamily: 'Urbanist-Bold',
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