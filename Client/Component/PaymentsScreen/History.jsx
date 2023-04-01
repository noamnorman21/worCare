
import React, { useState, useEffect, useRef } from 'react';
import {ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, Animated, Modal } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { List } from 'react-native-paper';
import NewPayment from './NewPayment';
import EditPaymentScreen from './EditPaymentScreen';

export default function History({ navigation, route }) {
  const userId = route.params.userId // יש להחליף למשתנה של המשתמש הנוכחי
  const [History, setHistory] = useState()
  const isFocused = useIsFocused()
  const [modal1Visible, setModal1Visible] = useState(false);

  const Edit = (id, data) => {
    Alert.alert(
      "Edit",
      "Are you sure you want to Edit this request?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => navigation.navigate('EditPaymentScreen', { id: id, data: data }) }
      ],
      { cancelable: false }
    );
  }

  const View = (id, item) => {
    Alert.alert(
      "View",
      "Are you sure you want to view this request?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => navigation.navigate('EditPaymentScreen', { id: id, data: item }) }
      ],
      { cancelable: false }
    );
  }

  useEffect(() => {
    if (isFocused) {
      getHistory()
    }
  }, [isFocused])

  const getHistory = async () => {
    try {
      const response = await fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Payments/GetHistory/' + userId, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',

        },
      });
      const data = await response.json();
      let arr = data.map((item) => {
        return (
          <Request key={item.requestId} getHistory={getHistory} data={item} id={item.requestId} Notofication={Notification} View={View} Edit={Edit} subject={item.requestSubject} amountToPay={item.amountToPay} date={item.requestDate} requestComment={item.requestComment} />
        )
      })
      setHistory(arr)
    } catch (error) {
      console.log(error)
    }
  }

  const [list, setlist] = React.useState();

  const Delete = (id) => {
    Alert.alert(
      "Delete",
      "Are you sure you want to delete this request?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
    );
  }

  const Notification = (id) => {
    Alert.alert(
      "Notification",
      "Are you sure you want to send a notification to the user?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
    );
  }
  return (
    <ScrollView contentContainerStyle={styles.Pending}>
      {History}
      <TouchableOpacity style={styles.addRequest} onPress={() => setModal1Visible(true)}>
        <Text style={styles.addRequestText}>+</Text>
      </TouchableOpacity>
      <Modal animationType='slide' transparent={true} visible={modal1Visible}>
        <NewPayment cancel={() => setModal1Visible(false)} />
      </Modal>
    </ScrollView>
  );
}

function Request(props) {
  const [expanded, setExpanded] = React.useState(true);
  const animationController = useRef(new Animated.Value(0)).current;
  const [modal1Visible, setModal1Visible] = useState(false);
  const toggle = () => {
    const config = {
      toValue: expanded ? 0 : 1,
      duration: 2000,
      useNativeDriver: true,
    }
    Animated.timing(animationController, config).start();
    setExpanded(!expanded);
  };
  return (
    <List.Accordion style={!expanded ? styles.request : styles.requestunFocused}
      theme={{ colors: { background: 'white' } }}
      right={() => <View style={styles.requesRight}><Text style={styles.requestHeaderText}>{props.subject}</Text>

      </View>}
      left={() => <View >
        <Text style={styles.requestHeaderText}>{props.date.substring(0, 10)}</Text>
      </View>}

      expanded={!expanded}
      onPress={toggle}
    >
      <View style={!expanded ? styles.Focused : styles.unFocused}>
        <View>
          <List.Item title={() => <Text style={styles.itemsText}>Date: {props.date.substring(0, 10)} </Text>} />
          <List.Item title={() => <Text style={styles.itemsText}>Amount: {props.amountToPay} </Text>} />
          <List.Item title={() => <Text style={styles.itemsText}>Comment: {props.requestComment} </Text>} />
          <List.Item title={() =>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity style={[styles.itemsText, styles.viewButton]} onPress={!expanded ? () => { setModal1Visible(true) } : null}>
                <Text style={styles.viewbuttonText}>View Document</Text>
              </TouchableOpacity>
              <Modal animationType='slide' transparent={true} visible={modal1Visible}>
                <EditPaymentScreen cancel={() => { setModal1Visible(false); props.getHistory() }} data={props.data} />
              </Modal>
              <TouchableOpacity style={[styles.itemsText, styles.editButton]} onPress={!expanded ? () => { setModal1Visible(true) } : null}>
                <Text style={styles.editbuttonText}>Edit</Text>
              </TouchableOpacity>
            </View>} />
        </View>
      </View>
    </List.Accordion>
  )
}



const styles = StyleSheet.create({

  Pending: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexGrow: 1,
    paddingTop: 10
  },
  requestunFocused: {
    justifyContent: 'center',
    width: Dimensions.get('screen').width * 0.9,
    height: Dimensions.get('screen').height * 0.073,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6EBF2',
    marginBottom: 10,
    backgroundColor: 'white',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    paddingLeft: 12,

  },
  request: {
    justifyContent: 'center',
    paddingLeft: 12,
    width: Dimensions.get('screen').width * 0.9,
    height: Dimensions.get('screen').height * 0.073,
    justifyContent: 'center',
    borderLeftColor: '#7DA9FF',
    borderLeftWidth: 1,
    borderTopLeftRadius: 16,
    borderTopColor: '#7DA9FF',
    borderTopWidth: 1,
    borderRightColor: '#7DA9FF',
    borderRightWidth: 1,
    borderTopRightRadius: 16,
    borderBottomColor: '#9E9E9E',
    borderBottomWidth: 0.5,
    borderBottomMargin: 10,
  },
  requestHeaderText: {
    fontSize: 16,
    fontFamily: 'Urbanist-Bold',
  },
  requestHeader: {
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'none',
    height: Dimensions.get('screen').height * 0.08,
    width: Dimensions.get('screen').width * 0.85,
    flexDirection: 'row',
    padding: 16,
  },
  requestHeaderIcon: {
    zIndex: 0,
    position: 'absolute',
    right: Dimensions.get('screen').width * 0,
    backgroundColor: 'orange',
  },
  Focused: {
    borderLeftColor: '#7DA9FF',
    borderLeftWidth: 1,
    borderBottomColor: '#7DA9FF',
    borderBottomWidth: 1,
    borderRightColor: '#7DA9FF',
    borderRightWidth: 1,
    borderBottomColor: '#7DA9FF',
    borderBottomEndRadius: 16,
    borderBottomStartRadius: 16,
    marginBottom: 10,
    padding: 16,
  },
  itemsText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: Dimensions.get('screen').width * -0.16,
    marginRight: Dimensions.get('screen').width * 0.02,
    fontFamily: 'Urbanist',

  },
  viewButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7DA9FF',
    height: 40,
    width: Dimensions.get('screen').width * 0.36,
    borderRadius: 16,

  },
  editButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    height: 40,
    width: Dimensions.get('screen').width * 0.36,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#7DA9FF',
    marginLeft: 10,
  },

  viewbuttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Urbanist-Bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editbuttonText: {
    color: '#7DA9FF',
    fontSize: 16,
    fontFamily: 'Urbanist-Bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addRequest: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#548DFF',
    height: 54,
    width: 54,
    borderRadius: 54,
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 10,
    right: Platform.OS === 'ios' ? 15 : 10,
    elevation: 5,
  },
  addRequestText: {
    color: 'white',
    fontSize: 26,
    marginBottom: 2,
    fontFamily: 'Urbanist-SemiBold',
  },
})