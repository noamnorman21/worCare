import { View, Text,StyleSheet, SafeAreaView, TextInput, Button,TouchableOpacity, ScrollView, Image } from 'react-native'
import React from 'react'
import io from 'socket.io-client';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';






export default function Chats({route}) {

  const navigation = useNavigation();
  const {name1} = route.params;

  const [serverResponse, setServerResponse] = useState('');

useEffect(() => {
  const ws = new WebSocket('ws://10.0.0.3:8181');

    ws.onopen = () => {
      console.log('WebSocket connection opened');
      const user1={
        "MessageType":"clientData",
        "Username":"Noam1",
        "Shouldtranslate":true
      }
      ws.send(JSON.stringify(user1));
    };

    ws.onmessage = (event) => {
      console.log(`Received message: ${event.data}`);
      setServerResponse(event.data);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = (myobj) => {
    ws.send('Hello Server');
  }
  


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cont2}>
      <View style={styles.rowts}>
      <TouchableOpacity onPress={() => navigation.navigate('MainChats')}>
      <Image source={require('../../images/icons/arrow.png')} style={styles.image} />
      </TouchableOpacity>
      </View>
      <View style={styles.txt0}>
      <View style={styles.txt}>
        <Text style={styles.realtxt}>{name1}</Text>
        <Text style={styles.txt2}>Today</Text>
        </View>
      </View>

       <ScrollView>
      <View style={styles.messageContainer}>

      <View style={styles.messageme}>
        <View>
        <Text style={styles.txtiteslf}> thissasdsadasddsaasdsasa asdsadasdsdadsad sadasdsadasdasdasdzxczxzcx sdsadadads sDsdasda is</Text>

        </View>
        </View>


        <View style={styles.messagefrom}>
          <View>
          <Text> this is asdasldasdkjl sadljkasdlkjsadasdklj asdkljasdlkjasd lkadsj asd</Text>
          </View>
          </View>
          <View style={styles.messagefrom}>
          <View>
          <Text> this is asdasldasdkjl sadljkasdlkjsadasdklj asdkljasdlkjasd lkadsj asd</Text>
          </View>
          </View>
          <View style={styles.messagefrom}>
          <View>
          <Text> this is asdasldasdkjl sadljkasdlkjsadasdklj asdkljasdlkjasd lkadsj asd</Text>
          </View>
          </View>
          <View style={styles.messagefrom}>
          <View>
          <Text> this is asdasldasdkjl sadljkasdlkjsadasdklj asdkljasdlkjasd lkadsj asd</Text>
          </View>
          </View>
          <View style={styles.messagefrom}>
          <View>
          <Text> this is asdasldasdkjl sadljkasdlkjsadasdklj asdkljasdlkjasd lkadsj asd</Text>
          </View>
          </View>
    

      </View>
      </ScrollView>



      

      </View>
      <View style={styles.bottomArea}>
      <View style={styles.bottom2}>
        <View style={styles.bottomtosend}>
          <View style={styles.icon}> 
          <Image source={require('../../images/icons/attach.png')}  />

          </View>
          <View style={styles.icon}> 
          <Image source={require('../../images/icons/camera.png')} style={styles.icon} />

          </View>

    </View>
        <TextInput placeholder="Type a message" style={styles.textinput} />

</View>
       
      </View>
      
    </SafeAreaView>
  )

  
}

const styles=StyleSheet.create({
  container:{
    position: 'relative',
    width: 393,
    height: 852,
    background: "#FFFFFF",
    
  },
  bottomArea: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 86,
    boxSizing: 'border-box',
    backgroundColor: '#FFFFFF',
    padding:0,
    alignItems:'flex-start',
    flexDirection:'column',

  },

  txtcontainer:{
    position: 'absolute',
    width: 300,
    height: 69,
    left: 15,
    top: 10.5,
    backgroundColor: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    zIndex: 0,
    flex: 0,
    order: 0,
    flexGrow: 0,
  },

  txtiteslf:{
    fontFamily: 'Urbanist',
    fontStyle: 'normal',
    fontWeight: '120',
    fontSize: 13,
    lineHeight: 23,
    color: '#FFFFFF',
    left: 13,
    bottom: 10.5,
    display: 'flex',
    alignItems: 'center',
    
    
    
  },
  

  icon:{
    marginLeft:6,
    
 
  },

  textinput:{
    position: 'absolute',
  width: "100%",
  height: 20,
  right:20,
  top: 22,

  fontFamily: 'Urbanist',
  fontStyle: 'normal',
  fontWeight: '500',
  fontSize: 16,
  lineHeight: 20,

  display: 'flex',
  alignItems: 'center',
  },

  bottom2:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    gap: 52,
    width: 393,
    height: 64,
    flex: 0,
    order: 0,
    alignSelf: 'stretch',
    flexGrow: 0

  },

  bottomtosend:{
    boxSizing: 'border-box',
    width: "97%",
    flexDirection: 'row',
    height: 45,
    backgroundColor: 'rgba(217, 217, 217, 0.5)',
    borderWidth: 1.5,
    borderColor: '#9E9E9E',
    borderRadius: 16,
    justifyContent: 'flex-start',
    alignItems: 'center',
    
    top:0
  }
,
  cont2:{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 0,
    gap: 38,
  
    position: 'absolute',
    width: 345,
    height: "100%",
    left: 24,
    top: 52
  },


rowts:{
  display: 'flex',
  flexDirection: 'row-reverse',
  alignItems: 'center',
  padding: 0,
  marginVertical: 24,

  width: 345,
  height: 20,

  // Inside auto layout
  flex: 0,
  alignSelf: 'stretch',
  flexGrow: 0,
},

  image:{

    
  },

  txt:{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 0,
    marginTop:20,
    gap: 18,
    width: 345,
    height: 94,
    flex: 0,
    alignSelf: 'stretch',
    
  },

  txt2:{
    width: 345,
    height: 47,
    fontFamily: 'Urbanist',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 19,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#808080',
    flex: 0,
    order: 1,
    alignSelf: 'stretch',
    flexGrow: 0,
    
  } ,

  messageme:{
    width: 344,
    flexWrap: 'wrap',
    backgroundColor: '#7DA9FF',
    border: '1.5px solid #548DFF',
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 16,
    boxSizing: 'border-box',
    gap: 12,
    padding:20,
    marginBottom:30
  } ,

  messagefrom:{
    width: 344,
    backgroundColor: 'rgba(217, 217, 217, 0.5)',
    border: '1.5px solid #548DFF',
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 16,
    flexWrap: 'wrap',
    boxSizing: 'border-box',
    gap: 12,
    padding:20,
    marginBottom:30

  } ,

  messageContainer: {
    marginTop: 70,
    width: 345,
    flex: 0,
    height:"100%",
    
    alignSelf: 'stretch',
  },

  realtxt:{
    
      width: 345,
      height: 29,
    
      fontFamily: 'Urbanist',
      fontStyle: 'normal',
      fontWeight: '700',
      fontSize: 24,
      lineHeight: 29,
      textAlign: 'center',
    
      color: '#000000',
      marginBottom:30,
    
      // Inside auto layout
      flex: 0,
      alignSelf: 'stretch',
      flexGrow: 0,
      order: 0,
      
    
  },

  txt0:{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 0,
    gap: 27,
    width: 345,
    height: 94,
    flex: 0,
    order: 1,
    alignSelf: 'stretch'
  }

})