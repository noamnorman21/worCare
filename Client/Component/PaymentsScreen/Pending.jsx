
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, Animated, Modal } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { List } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import NewPayment from './NewPayment';
import EditPaymentScreen from './EditPaymentScreen';



export default function Pending({ route }) {
  const userId = route.params.userId // יש להחליף למשתנה של המשתמש הנוכחי
  const [modal1Visible, setModal1Visible] = useState(false);
  const [Pendings, setPendings] = useState()
  const [List, setList] = useState([])
  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) {
      getPending()
    }
  }, [isFocused])

  useEffect(() => {
    if (!modal1Visible) {
      getPending()
    }
  }, [modal1Visible])


  const getPending = async () => {
    try {
      const response = await fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Payments/GetPending/' + userId, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      let arr = data.map((item) => {
        return (
          <Request key={item.requestId} getPending={getPending} data={item} id={item.requestId} Notofication={Notification} View={View} subject={item.requestSubject} amountToPay={item.amountToPay} date={item.requestDate} requestComment={item.requestComment} />
        )
      })
      setPendings(arr)



    } catch (error) {
      console.log(error)
    }
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


  const View = (id, data) => {
    Alert.alert(
      "View",
      "Are you sure you want to view this request?",
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
      {Pendings}
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

  const saveStatus = async (id) => {
    return console.log(id)
    try {
      const response = await fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Payments/UpdateStatus/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(id)
      });
      const data = await response.json();
      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }
  



  return (
    <List.Accordion style={!expanded ? styles.request : styles.requestunFocused}
      theme={{ colors: { background: 'white' } }}
      right={() => <View style={styles.requesRight}><Text style={styles.requestHeaderText}>{props.subject}</Text>
        <TouchableOpacity>
          <View>
            <Feather
              name="bell"
              size={18}
              color={'#000000'}
            />
          </View>
        </TouchableOpacity>
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
          <List.Item title={() =><View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity style={[styles.itemsText, styles.viewButton]} onPress={!expanded ? () =>{setModal1Visible(true)}:null}>
              <Text style={styles.viewbuttonText}>View Document</Text>
            </TouchableOpacity>
            <Modal animationType='slide' transparent={true} visible={modal1Visible}>
              <EditPaymentScreen cancel={() => {setModal1Visible(false);props.getPending()}} data={props.data} />
            </Modal>
            <TouchableOpacity style={[styles.itemsText, styles.editButton]} onPress={!expanded ? () =>{setModal1Visible(true)} : null}>
              <Text style={styles.editbuttonText}>Edit</Text>
            </TouchableOpacity>
            </View>
            <View>
            <TouchableOpacity style={[styles.itemsText, styles.SaveButton]} onPress={!expanded ? () =>{saveStatus(props.data.requestId)} : null}>
              <Text style={styles.editbuttonText}>Save as Payed</Text>
            </TouchableOpacity>
          </View>
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
    paddingTop: 10,
    flexGrow: 1,
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
    fontSize: 17,
    fontFamily: 'Urbanist-Bold'
  },
  requestHeaderIcon: {
    zIndex: 0,
    position: 'absolute',
    right: Dimensions.get('screen').width * 0,
    backgroundColor: 'orange',
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
  requesRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: Dimensions.get('screen').width * 0.35,
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
  SaveButton: {
    alignItems: 'center',
    justifyContent: 'center',    
    height: 40,
    width: Dimensions.get('screen').width * 0.765,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#7DA9FF',
    marginTop: 10,    
  },

  viewbuttonText: {
    color: 'white',
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Urbanist-Bold'
  },
  editbuttonText: {
    color: '#7DA9FF',
    fontSize: 16,
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Urbanist-Bold'
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
