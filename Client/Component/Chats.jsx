import { View, Text,StyleSheet, SafeAreaView, TextInput, Button } from 'react-native'
import React from 'react'
import io from 'socket.io-client';
import { useState, useEffect } from 'react';



export default function Chats() {

  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('Send a message');
  const [receivedMessage, setReceivedMessage] = useState('Here will be the received message');

  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('message', (data) => {
      setReceivedMessage(data);
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });

    socket.on('connect_error', (error) => {
      console.log('Error connecting to the server: ', error);
    });

    setSocket(socket);

    return () => {
      socket.disconnect();
    };

  },[]);

  const handlesend = () => {
    socket.emit('message', message);
  }


  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex:0.8}}>
      <Text style={{fontSize:20, fontWeight:"bold",textAlign:"center"}}>Our Chat</Text>
      <View style={{marginTop:70}}>
      <TextInput style={{borderWidth:1,borderColor:"black",width:200,height:40, textAlign:"center"}} value={message} onChangeText={setMessage}></TextInput>
      <View style={{alignItems:"center",marginTop:30}}>
      <Button title="Send" onPress={handlesend}></Button>
      </View>
      </View>
      <View style={{marginTop:70}}>
        <Text style={{textAlign:"center"}}>{receivedMessage} </Text>
        </View>

      </View>

    </SafeAreaView>
  )

  
}

const styles=StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#fff",
    alignItems:"center",
    justifyContent:"center",
  },
})