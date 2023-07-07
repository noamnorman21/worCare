import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, SafeAreaView, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useUserContext } from '../UserContext';

export default function PushNotifications() {

  const [showToday, setShowToday] = useState(false);
  const [showYesterday, setShowYesterday] = useState(false);
  const todayContentHeight = useRef(new Animated.Value(0)).current;
  const yesterdayContentHeight = useRef(new Animated.Value(0)).current;
  const [isRead, setIsRead] = useState(false);

  const { notifications } = useUserContext();  //now its one array of notifications, not sorted by date(but can be sorted by date if Noam will want it)
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


  // useEffect(() => {
  //   console.log("notificationsArr", notificationsArr);
  //   const fetchNotifications = async () => {
  //     // Simulating API call delay
  //     await new Promise((resolve) => setTimeout(resolve, 1000));//////////////////////////////////// מה זה החרא זה, צריך אותו?
  //     // const data = [
  //     //   { id: 1, title: 'Notification 1', message: 'This is notification 1.' },
  //     //   { id: 2, title: 'Notification 2', message: 'This is notification 2.' },
  //     //   { id: 3, title: 'Notification 3', message: 'This is notification 3.' },
  //     // ];
  //     // setNotifications(data);
  //   };

  //   fetchNotifications();
  // }, []);

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
    

    const handlePress = () => {
      //toggle status
      if (item.status == 'P') {
        item.status = 'S';
      }
      else {
        item.status = 'P';
      }
      console.log("item", item);
   
    };

    return (
      <TouchableOpacity
        style={styles.notificationItem}
        onPress={handlePress}
      >
        <View style={styles.iconContainer}>
          <View style={[styles.icon, item.status = "P" ? { backgroundColor: '#F2F8F2' } : { backgroundColor: 'green' }]}>
            <Ionicons name="calendar" size={24} color={item.status = "P" ? 'red' : 'green'} />
          </View>
        </View>
        <View style={styles.notificationDetails}>
          <Text style={styles.notificationTitle}>
            {item.title}
          </Text>
          <Text style={styles.notificationMessage}>{item.pushMessage}</Text>
        </View>
      </TouchableOpacity>
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

      <TouchableOpacity onPress={toggleYesterday}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Previous</Text>
          <Ionicons name={showYesterday ? 'chevron-up' : 'chevron-down'} size={30} color="#548DFF" />
        </View>
      </TouchableOpacity>
      <Animated.View style={[styles.contentContainer, yesterdayContentStyle]}>
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
  },
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
});