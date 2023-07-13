import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, SafeAreaView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUserContext } from '../UserContext';
import NotificationItem from './HelpComponents/NotificationItem';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function PushNotifications() {
  const { notifications, userContext, GetNotificationsThatSent } = useUserContext();  //now its one array of notifications, not sorted by date(but can be sorted by date if Noam will want it)
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
          alwaysBounceVertical={false}
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