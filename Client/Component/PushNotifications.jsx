import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform, SafeAreaView } from 'react-native';
import React from 'react'
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

export default function PushNotifications() {

  return (
    <SafeAreaView>
      <Text>PushNotifications</Text>
    </SafeAreaView>
  )
}