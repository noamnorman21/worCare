import { View, Text,StyleSheet, SafeAreaView, TextInput, Button,Image, ScrollView } from 'react-native'
import React from 'react'
import io from 'socket.io-client';
import { useState, useEffect } from 'react';
import { Card } from 'react-native-elements';




export default function MainChats(props) {


    const conversation = [{namec:"Noam Norman", Message:"Hello",image:"../../images/icons/Woman.png"},
    {namec:"Oryan Barnea",Message:"Hi",image:"../../images/icons/Dor.png"},
    {namec:"Dor Ratzabi",Message:"How are you?",image:"../../images/icons/Oryan.png"},
    {namec:"Dor Ratzabi",Message:"How are you?",image:"../../images/icons/Oryan.png"},
    {namec:"Dor Ratzabi",Message:"How are you?",image:"../../images/icons/Oryan.png"},
    {namec:"Dor Ratzabi",Message:"How are you?",image:"../../images/icons/Oryan.png"},



   
];

const[height10,setHeight10]=useState(832);

const heightsetter = () => {
    const heightnew = 180 * conversation.length;
    if(heightnew > 832){
    setHeight10(180 * conversation.length);
    }
    else{
        setHeight10(832);
    }

  }

  useEffect(() => {
    heightsetter();
  }, [conversation]);



  const [image, setImage] = useState('Woman.png');


    return (
        <ScrollView>

           <SafeAreaView style={[styles.container,{height:height10}]} >
            <View style={styles.chattxt}>
            <Image source={require('../../images/icons/Send.png')} style={styles.image}></Image>
            <Text style={styles.txtforchat}>Chat</Text>
          
            </View>
            <View style={styles.convers} >
              {conversation.map((item,index) =>{
            

                    return(
                        <View style={{padding:15,marginTop:30}} key={index}>
                      <View style={{borderBottomWidth:1,borderBottomColor:"grey",borderStyle:"solid", flexDirection:'row-reverse',padding:15}}>
                    <View style={styles.avatarContainer}>
                      <Image source={require('../../images/icons/Dor.png')} style={styles.avatar} />
                    </View>
                      <View style={styles.messageContainer}>
                      <Text style={styles.textforuser}>{item.namec}</Text>
                      <Text style={styles.message}>{item.Message}</Text>
                      </View>
                 

                        </View>
                        </View>
                    )
                
              } )}
               
            </View>
       
           </SafeAreaView>
           </ScrollView>


    )
}

const styles=StyleSheet.create({
 container:{
  position:'relative',
  width:393,
  backgroundColor:"#E6EBF2"
            },

            chattxt:{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop:80,

            },
            avatarContainer: {
                marginRight: 10,
              },
            textformsg: {
                width: 180,
                height: 32,
                fontWeight: "400",
                fontSize: 16,
                left: 20,
                marginTop: 5,
                color: "#555",
            },
            messageContainer: {
                flex: 1,
              },
              message: {
                fontSize: 16,
                marginTop: 5,
                right:20,
                color: "#808080",
                fontWeight:"400",
                fontSize:13
              },

            convers:{

marginTop:20,
            },

            textforuser:{
                fontWeight:"700",
                fontSize:24,
                right:20
},

            txtforchat:{
                fontStyle: "normal",
                fontWeight: "700",
                fontSize: 24,
                color: "#000000",
                lineHeight: 29,
                right:36

                
            } ,

            image:{
                width:19.56,
                height:19.17,
                left:20
                

            },

            avatar:{
                width:65,
                height:65,
            }
          })