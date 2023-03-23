
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, Animated, Modal } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { List } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';

import NewPaycheck from './NewPaycheck';
import EditPaymentScreen from '../PaymentsScreen/EditPaymentScreen';
import EditPaycheck from './EditPaycheck';




export default function Paychecks({navigation}) {
  const userId = 1 // יש להחליף למשתנה של המשתמש הנוכחי
  const [History, setHistory] = useState()
  const isFocused = useIsFocused()
  const [modal1Visible, setModal1Visible] = useState(false);

  // const Edit = (id, data) => {
  //   Alert.alert(
  //     "Edit",
  //     "Are you sure you want to Edit this request?",
  //     [
  //       {
  //         text: "Cancel",
  //         onPress: () => console.log("Cancel Pressed"),
  //         style: "cancel"
  //       },
  //       { text: "OK", onPress: () => navigation.navigate('EditPaymentScreen', {id:id, data:data}) }
  //     ],
  //     { cancelable: false }
  //   );
  // }

  
  
  useEffect(() => {
    if (isFocused) {
      getPaychecks()
    }
  }, [isFocused])

  const getPaychecks = async () => {
    try {
      const response = await fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/PayChecks/GetPaychecks/' + userId, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',

        },
      });
      const data = await response.json();
      let arr = data.map((item) => {
        return (
          <Paycheck key={item.payCheckNum} getPaychecks={getPaychecks} data={item}/>
        )
      })
      setHistory(arr)
    } catch (error) {
      console.log(error)
    }
  }
 
    
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
       <View style={styles.headerText}>
        <Text style={styles.header} >History</Text>
        </View>  
      {History}
      <TouchableOpacity style={styles.addRequest} onPress={() => setModal1Visible(true)}>
        <Text style={styles.addRequestText}>+</Text>
      </TouchableOpacity>
      <Modal animationType='slide' transparent={true} visible={modal1Visible}>
       <NewPaycheck cancel={() => {setModal1Visible(false); getPaychecks()} } />
      </Modal>
      
    </ScrollView>
  );
}

function Paycheck(props) {
  const [expanded, setExpanded] = React.useState(true);
  const animationController = useRef(new Animated.Value(0)).current;
  const [modal1Visible, setModal1Visible] = useState(false);
  const [temp,settemp]= useState({
    paycheckDate: props.data.paycheckDate,
    paycheckSummary: props.data.paycheckSummary,
    paycheckComment: props.data.paycheckComment,
    paycheckNum: props.data.paycheckNum,
  })
 
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
    right={() => <View ></View>}
      
    left={() => <View >
      <Text style={styles.requestHeaderText}>{temp.paycheckDate.substring(0,7).replace("-","/")}</Text>      
    </View>}

    expanded={!expanded}
    onPress={toggle}
  >
    <View style={styles.Focused}>
      <View>
      <List.Item title={() => <Text style={styles.itemsText}>Date: {temp.paycheckDate.substring(0, 10).replace(/-/g,"/" )} </Text>} />
      <List.Item title={() => <Text style={styles.itemsText}>Summary: {temp.paycheckSummary.substring(0, 100)}</Text>} />
      <List.Item title={() => <Text style={styles.itemsText}>Comment: {temp.paycheckComment} </Text>} />
      <List.Item title={() =>
        <View style={styles.bottom}>
          <TouchableOpacity style={[styles.itemsText, styles.viewButton]} onPress={!expanded ? () =>{setModal1Visible(true)}:null}>
            <Text style={styles.viewbuttonText}>View Document</Text>
          </TouchableOpacity>
          <Modal animationType='slide' transparent={true} visible={modal1Visible}>
            <EditPaycheck cancel={() => {setModal1Visible(false); setExpanded(true) ; props.getPaychecks()}} data={props.data} />
          </Modal>
          <TouchableOpacity style={[styles.itemsText, styles.editButton]} onPress={!expanded ? () =>{setModal1Visible(true)} : null}>
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
    backgroundColor: 'white',
    flexGrow: 1,
    paddingTop: 10,
    alignItems: 'center',
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
    paddingLeft: 12,
    width: Dimensions.get('screen').width * 0.9,
    height: Dimensions.get('screen').height * 0.073,   
    borderLeftColor: '#7DA9FF',
    borderLeftWidth: 2,
    borderTopLeftRadius: 16,
    borderTopColor: '#7DA9FF',
    borderTopWidth: 2,
    borderRightColor: '#7DA9FF',
    borderRightWidth: 2,
    borderTopRightRadius: 16,
    borderBottomColor: '#9E9E9E',
    borderBottomWidth: 1,
    borderBottomMargin: 10,  
    
  },
  requestHeaderText: {
    fontSize: 16,
    fontWeight: '600',
  },
  Focused: {
    borderLeftColor: '#7DA9FF',
    borderLeftWidth: 2,
    borderBottomColor: '#7DA9FF',
    borderBottomWidth: 2,
    borderRightColor: '#7DA9FF',
    borderRightWidth: 2,
    borderBottomColor: '#7DA9FF',
    borderBottomEndRadius: 16,
    borderBottomStartRadius: 16,
    marginBottom: 10,
    padding: 16,
    flexGrow: 0.35,
   
    
  },
  itemsText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft:Dimensions.get('screen').width * -0.16,
    marginRight:Dimensions.get('screen').width * 0.02,
    marginVertical:0,
   
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
    fontWeight: '600',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editbuttonText: {
    color: '#7DA9FF',
    fontSize: 16,
    fontWeight: '600',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addRequest: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7DA9FF',
    height:64,
    width: 64,
    borderRadius: 54,
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 10,
    right:  Platform.OS === 'ios' ? 15: 10,
    elevation: 5,    
  },
  addRequestText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  headerText: {      
    height: Dimensions.get('screen').height * 0.05,
    width: Dimensions.get('screen').width * 0.85,
    marginBottom: Dimensions.get('screen').height * 0.02,  
  },
  header: {
    fontSize: 24,
    fontWeight: '700',  
  },
  bottom:{
    flexDirection: 'row',
     justifyContent: 'space-between',      
  },

})
