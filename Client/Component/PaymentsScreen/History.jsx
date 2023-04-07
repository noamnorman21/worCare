
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, Animated, Modal, Image } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { List } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import NewPayment from './NewPayment';
import EditPaymentScreen from './EditPaymentScreen';
import { useUserContext } from '../../UserContext';
import { AddBtn } from '../HelpComponents/AddNewTask';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;



export default function History({ navigation, route }) {
  const { userContext } = useUserContext();// יש להחליף למשתנה של המשתמש הנוכחי
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



  useEffect(() => {
    if (isFocused) {
      getHistory()
    }
  }, [isFocused])

  const getHistory = async () => {
    try {
      const user={
        userId: userContext.userId,
        userType: userContext.userType
      }
      const response = await fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Payments/GetHistory/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
      });
      const data = await response.json();
      let arr = data.map((item) => {
        return (
          <Request key={item.requestId} getHistory={getHistory} data={item} id={item.requestId} Notofication={Notification} View={View} Edit={Edit} subject={item.requestSubject} amountToPay={item.amountToPay} date={item.requestDate} requestComment={item.requestComment} />
        )
      })
      setHistory(arr)
    } catch (error) {
      console.log("error",error)
    }
  }

  const [list, setlist] = React.useState();



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
    <ScrollView contentContainerStyle={styles.pending}>
      {History}
      {userContext.userType == "Caregiver" ? <View style={styles.addBtnView}><AddBtn onPress={() => setModal1Visible(true)} /></View> : null}
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
  const [modal2Visible, setModal2Visible] = useState(false);
  const status = props.data.requestStatus;
  const toggle = () => {
    const config = {
      toValue: expanded ? 0 : 1,
      duration: 2000,
      useNativeDriver: true,
    }
    Animated.timing(animationController, config).start();
    setExpanded(!expanded);
  };

  const displayStatus = () => {
    if (status == "F") {
      return "Finished"
    }
    else if (status == "C") {
      return "Canceled"
    }
    else if (status == "R") {
      return "Rejected"
    }
    else if (status == "P") {
      return "Pending"
    }
  }

  const Download = async () => {
    const url = props.data.requestProofDocument;
    const dot = url.lastIndexOf(".");
    const questionMark = url.lastIndexOf("?");
    const type = url.substring(dot, questionMark);
    console.log("Type", type)
    
    const filename = props.data.requestId+type;
    console.log(filename)
    const downloadDest = `${FileSystem.documentDirectory}${filename}`;
    console.log("Download Dest", downloadDest)
    const { uri } = FileSystem.getInfoAsync(downloadDest);
    console.log("New Urlli",uri)
    if (!uri) {
      console.log('Downloading to ', downloadDest);
      FileSystem.makeDirectoryAsync(downloadDest, { intermediates: true });
      let uri = FileSystem.getInfoAsync(downloadDest)
      console.log("New Uri",uri)
    }  

    const res = await FileSystem.downloadAsync(url,downloadDest)
    console.log("res", res)

    saveFile(res);
  }


  const saveFile = async (res) => {
    console.log("Uri1", res)
    const asset = await MediaLibrary.createAssetAsync(res.uri);
    console.log("Asset1", asset)
    await MediaLibrary.createAlbumAsync('Downloads', asset, false);
    Alert.alert("Downloaded Successfully")
  }




  return (
    <List.Accordion style={!expanded ? (status == "F" ? [styles.requestFocused, styles.finishedRequestFocused] : [styles.requestFocused, styles.notCompleteRequestFocused]) : styles.requestunFocused}
      theme={{ colors: { background: 'white' } }}
      right={() => <View style={styles.requesRight}><Text style={styles.requestHeaderText}>{props.subject}</Text>

      </View>}
      left={() => <View >
        <Text style={styles.requestHeaderText}>{props.date.substring(0, 10)}</Text>
      </View>}
      expanded={!expanded}
      onPress={toggle}
    >
      <View style={!expanded ? status == "F" ? ([styles.Focused, styles.completeFocused]) : ([styles.Focused, styles.notCompleteFocused]) : null}>
        <View>
          <List.Item title={() => <Text style={styles.itemsText}>Date: {props.date.substring(0, 10)} </Text>} />
          <List.Item title={() => <Text style={styles.itemsText}>Amount: {props.amountToPay} </Text>} />
          <List.Item title={() => <Text style={styles.itemsText}>Comment: {props.requestComment} </Text>} />
          <List.Item title={() => <Text style={styles.itemsText}>Status: {displayStatus()} </Text>} />
          <List.Item title={() =>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity style={[styles.itemsText, styles.viewButton]} onPress={!expanded ? () => { setModal2Visible(true) } : null}>
                <Text style={styles.viewbuttonText}>View Document</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.itemsText, styles.editButton]} onPress={!expanded ? () => { setModal1Visible(true) } : null}>
                <Text style={styles.editbuttonText}>Edit</Text>
              </TouchableOpacity>
              <Modal animationType='slide' transparent={true} visible={modal1Visible}>
                <EditPaymentScreen cancel={() => { setModal1Visible(false); props.getHistory() }} data={props.data} />
              </Modal>
              <Modal animationType='slide' transparent={true} visible={modal2Visible}>
                <View style={styles.documentview}>
                  <Image source={{ uri: props.data.requestProofDocument }} style={styles.documentImg} />
                  <Text>{props.data.requestProofDocument}</Text>
                  <TouchableOpacity style={styles.documentDownloadButton} onPress={Download} >
                    <Text style={styles.documentButtonText}>Download</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.documentCancelButton} onPress={() => setModal2Visible(false)}>
                    <Text style={styles.documentCancelText}>Go Back</Text>
                  </TouchableOpacity>
                </View>
              </Modal>

            </View>} />
        </View>
      </View>
    </List.Accordion>
  )
}



const styles = StyleSheet.create({

  pending: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexGrow: 1,
    paddingTop: 10
  },
  requestunFocused: {
    justifyContent: 'center',
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.08,
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
  requestFocused: {
    justifyContent: 'center',
    paddingLeft: 12,
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.073,
    justifyContent: 'center',
    borderLeftWidth: 2,
    borderTopLeftRadius: 16,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderTopRightRadius: 16,
    borderBottomWidth: 1,
    borderBottomMargin: 10,

  },
  finishedRequestFocused: {
    borderTopColor: '#7DA9FF',
    borderLeftColor: '#7DA9FF',
    borderRightColor: '#7DA9FF',
    borderBottomColor: '#7DA9FF',
    shadowColor: '#000',
  },
  notCompleteRequestFocused: {
    borderTopColor: '#E6EBF2',
    borderLeftColor: '#E6EBF2',
    borderRightColor: '#E6EBF2',
    borderBottomColor: '#E6EBF2',
  },
  requestHeaderText: {
    fontSize: 16,
    fontFamily: 'Urbanist-Bold',
  },
  requestHeader: {
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'none',
    height: SCREEN_HEIGHT * 0.08,
    width: SCREEN_WIDTH * 0.85,
    flexDirection: 'row',
    padding: 16,
  },
  requestHeaderIcon: {
    zIndex: 0,
    position: 'absolute',
    right: SCREEN_WIDTH * 0,
    backgroundColor: 'orange',
  },
  Focused: {
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderBottomEndRadius: 16,
    borderBottomStartRadius: 16,
    marginBottom: 10,
    padding: 16,
  },
  completeFocused: {
    borderLeftColor: '#7DA9FF',
    borderBottomColor: '#7DA9FF',
    borderRightColor: '#7DA9FF',
    borderBottomColor: '#7DA9FF',
    borderBottomEndRadius: 16,
  },
  notCompleteFocused: {
    borderLeftColor: '#E6EBF2',
    borderBottomColor: '#E6EBF2',
    borderRightColor: '#E6EBF2',
    borderBottomColor: '#E6EBF2',
    borderBottomEndRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
  },
  itemsText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: SCREEN_WIDTH * -0.16, //NEED TO CHANGE
    marginRight: SCREEN_WIDTH * 0.02,
    fontFamily: 'Urbanist-Regular',
  },
  viewButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7DA9FF',
    height: 40,
    width: SCREEN_WIDTH * 0.36,
    borderRadius: 16,

  },
  editButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    height: 40,
    width: SCREEN_WIDTH * 0.36,
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
  addBtnView: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  addRequestText: {
    color: 'white',
    fontSize: 26,
    marginBottom: 2,
    fontFamily: 'Urbanist-SemiBold',
  },
  documentview: {
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'white',
    flex: 1,

  },
  documentImg: {
    height: SCREEN_HEIGHT * 0.5,
    width: SCREEN_WIDTH * 0.9,
    borderRadius: 16,
  },
  documentDownloadButton: {
    fontSize: 16,
    borderRadius: 16,
    backgroundColor: '#7DA9FF',
    fontFamily: 'Urbanist-Bold',
    alignItems: 'center',
    justifyContent: 'center',
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.06,
    marginBottom: 10,
  },
  documentCancelButton: {
    fontSize: 16,
    borderRadius: 16,
    borderColor: '#7DA9FF',
    borderWidth: 1,
    fontFamily: 'Urbanist-Bold',
    alignItems: 'center',
    justifyContent: 'center',
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.06,
    borderWidth: 1.5,
    backgroundColor: '#F5F8FF',
    borderColor: '#548DFF',
  },
  documentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Urbanist-Bold',
    alignItems: 'center',
  },
  documentCancelText: {
    color: '#7DA9FF',
    fontSize: 16,
    fontFamily: 'Urbanist-Bold',
    alignItems: 'center',
  },

})
