
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, Animated } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { List } from 'react-native-paper';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function History() {
  const userId = 1 // יש להחליף למשתנה של המשתמש הנוכחי

  // const [Pending, setPending] = useState(second)
  // useEffect(() => {
  //   if (isFocused) {
  //     getPending()
  //   }
  // }, [isFocused])

  // const getPending = async () => {
  //   try {
  //     const response = await fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Payments/GetPending/' + userId, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',

  //       },
  //     });
  //     const data = await response.json();
  //     console.log(data)
  //     let data2 = data.map((item) => {
  //       return {
  //         id: item.id,
  //         subject: item.subject,
  //         amount: item.amount,
  //         requestDate: item.requestDate,
  //         proofofdocument: item.proofofdocument,
  //         comment: item.comment,
  //         status: item.status,
  //       }
  //     })
  //     setPending(data)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  const [History, setHistory] = useState()
  const [list, setlist] = React.useState();
  const isFocused = useIsFocused()
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

  const View=(id)=>{
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

  const temp = [ //will be replaced with fetch
    {
      "requestId": 121,
      "requestSubject": "Web",
      "amountToPay": 384.40220094490894,
      "requestDate": "2022-04-27T00:00:00",
      "requestProofDocument": "3YYZBG0PT165MQV0224GU10BIWDTYNX63XFTQRL6S13NH6PO6ZFXSN32YMGE26R53Z2OA19BHXNTYDTB7PNZ80EGTDV3A63LAXJI40D4P4GVZA4KT57DJRX3LMVX560AT1J0TB76BI93KIGJ8AA5ZQ2I0",
      "requestComment": "Sed vantis. rarendum et quo egreddior quo quartu essit. et quo e novum egreddior et fecit. non quo nomen",
      "requestStatus": "R",
      "userId": 1
    },
    {
      "requestId": 312,
      "requestSubject": "Web",
      "amountToPay": 360.416559856579,
      "requestDate": "2022-07-22T00:00:00",
      "requestProofDocument": "asdadwdsa",
      "requestComment": "Et nomen linguens linguens e vobis Versus linguens fecundio, apparens quo, regit, novum Versus Versus Sed",
      "requestStatus": "R",
      "userId": 1
    },
    {
      "requestId": 323,
      "requestSubject": "SuperMarket",
      "amountToPay": 826.74925412365667,
      "requestDate": "2022-02-23T00:00:00",
      "requestProofDocument": "asdadwdsa",
      "requestComment": "in eudis vobis novum essit. eggredior. et fecit, glavans et vantis. Quad gravis travissimantor homo,",
      "requestStatus": "R",
      "userId": 1
    }
  ]

  useEffect(() => {
    let arr = temp.map((item) => {
      return (
        <Request key={item.requestId} data={item} id={item.requestId} Notofication={Notification} View={View} Delete={Delete} subject={item.requestSubject} amountToPay={item.amountToPay} date={item.requestDate} requestComment={item.requestComment} />
      )
    })
    setHistory(arr)
    setlist(temp)
  }, [])


  return (    
    <ScrollView contentContainerStyle={styles.Pending}>
      {/* <View style={styles.requestunFocused}>
        <FlatList
          data={temp}
          renderItem={({ item }) => (
            <Request key={item.requestId} data={item} id={item.requestId} Notofication={Notification} View={View} Delete={Delete} subject={item.requestSubject} amountToPay={item.amountToPay} date={item.requestDate} requestComment={item.requestComment} />
            )}
            keyExtractor={item => item.requestId}
          />
        </View> */}
      {History}
    </ScrollView>
  );
}

function Request(props) {
  const [expanded, setExpanded] = React.useState(true);
  const animationController = useRef(new Animated.Value(0)).current;

  const toggle = () => {
   const config = {
      toValue: expanded ? 0 : 1,
      duration: 2000,
      useNativeDriver: true,
    }
    Animated.timing(animationController, config).start();
    setExpanded(!expanded);
  };

  const handlePress = () => setExpanded(!expanded);
  return (

    <List.Accordion style={!expanded ? styles.request : styles.requestunFocused}
      theme={{ colors: { background: 'white' } }}
      left={() => <View style={styles.requestHeader}>
        <Text style={styles.requestHeaderText}>{props.date.substring(0, 10)}</Text>        
        <Text style={styles.requestHeaderText}>{props.subject}</Text>                 
      </View>}
      expanded={!expanded}
      onPress={toggle}     

    >
      <View style={!expanded? styles.Focused: styles.unFocused}>
        <List.Item title={() => <Text style={styles.itemsText}>Date: {props.date.substring(0, 10)} </Text>} />
        <List.Item title={() => <Text style={styles.itemsText}>Amount: {props.amountToPay} </Text>} />
        <List.Item title={() => <Text style={styles.itemsText}>Comment: {props.requestComment} </Text>} />   
        <List.Item title={() =>
             <View style={{flexDirection:'row', justifyContent:'space-between'}}>
          <TouchableOpacity style={[styles.itemsText, styles.viewButton]} onPress={!expanded ? () => props.View(props.id) : null}>
            <Text style={styles.viewbuttonText}>View Document</Text>          
          </TouchableOpacity>
          <TouchableOpacity style={[styles.itemsText, styles.editButton]} onPress={!expanded ? () => props.Delete(props.id) : null}>
            <Text style={styles.editbuttonText}>Edit</Text>
          </TouchableOpacity>
          </View>} />
        
      </View>
    </List.Accordion>

    // <SafeAreaView style={!expanded ? styles.request : styles.requestunFocused}>      
    //         <View style={styles.requestHeader}>
    //         <Text style={styles.requestHeaderText}>{props.date.substring(0, 10)}</Text>
    //           <View style={styles.requesRight}>
    //             <Text style={styles.requestHeaderText}>{item.requestSubject}</Text>
    //             <TouchableOpacity
    //               onPress={() => { handlePress }}>
    //               <Feather
    //                 name="bell"
    //                 size={18}
    //                 color={'#000000'}
    //               />
    //             </TouchableOpacity>
    //           </View>              
    //         </View>
        
    // </SafeAreaView>
    
  )
}

const styles = StyleSheet.create({
  Pending: {
    alignItems: 'center',
    backgroundColor: 'white',
    height: Dimensions.get('screen').height * 1,
    paddingTop:10
  },
  requestunFocused: {    
    height: Dimensions.get('screen').height * 0.07,
    width: Dimensions.get('screen').width * 0.9,
    margin: 10,  
    marginBottom: 0,
    flexDirection: 'row',
    borderColor: '#E6EBF2',
    borderRadius: 16,
    borderWidth: 1,
  },
  request: {  
    height: Dimensions.get('screen').height * 0.07,
    width: Dimensions.get('screen').width * 0.9,
    margin: 10,  
    marginBottom: 0,
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
    fontWeight: '600',
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
   unFocused: {
    borderWidth: 1,
    borderColor: '#7DA9FF',
    borderRadius: 16,      
    width: Dimensions.get('screen').width * 0.9,
    
  },
  Focused: { 
    width: Dimensions.get('screen').width * 0.9,   
    marginLeft: 10,
    borderLeftColor: '#7DA9FF',
    borderLeftWidth: 1,
    borderBottomColor: '#7DA9FF',
    borderBottomWidth: 1,
    borderRightColor: '#7DA9FF',
    borderRightWidth: 1,
    borderBottomColor: '#7DA9FF',
    borderBottomEndRadius: 16,
    borderBottomStartRadius: 16,
    marginTop:0    
  },
  itemsText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft:Dimensions.get('screen').width * -0.16,
    marginRight:Dimensions.get('screen').width * 0.02,

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




})