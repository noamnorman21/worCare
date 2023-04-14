import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, Animated, Modal, Image, ScrollView, sagea } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { List } from 'react-native-paper';
import NewPayment from './NewPayment';
import EditPaymentScreen from './EditPaymentScreen';
import { useUserContext } from '../../UserContext';
import { AddBtn } from '../HelpComponents/AddNewTask';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';
import { SafeAreaView } from 'react-navigation';
import { MaterialCommunityIcons, AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from "react-native-popup-menu";


const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function History({ navigation, route }) {
  const { userContext } = useUserContext();// יש להחליף למשתנה של המשתמש הנוכחי
  const [History, setHistory] = useState('')
  const [modal1Visible, setModal1Visible] = useState(false);
  const isFocused = useIsFocused()

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
      const user = {
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
      console.log("error", error)
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
  const [expanded, setExpanded] = useState(false);
  const animationController = useRef(new Animated.Value(0)).current;
  const [modal1Visible, setModal1Visible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);
  const date = new Date(props.date);
  const year = date.getFullYear();
  const newYear = year.toString().substr(-2);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dateString = day + "/" + month + "/" + newYear;

  const toggle = () => {
    const config = {
      toValue: expanded ? 0 : 1,
      duration: 2000,
      useNativeDriver: true,
    }
    Animated.timing(animationController, config).start();
    setExpanded(!expanded);
  };


  const openModal = (value) => {
    if (value == 1) {
      console.log("Notofication")
    }
    else if (value == 2) {
      setModal1Visible(true)
    }
    if (value == 3) {
      setModal2Visible(true)
    }
    if (value == 4) {
      DeleteRequest()
    }
  }

  const DeleteRequest = () => {
    Alert.alert(
      'Delete request',
      'are you sure you want to Delete? All changes will be lost',
      [
        { text: "Don't leave", style: 'cancel', onPress: () => { } },
        {
          text: 'Leave',
          style: 'destructive',
          // If the user confirmed, then we dispatch the action we blocked earlier
          // This will continue the action that had triggered the removal of the screen
          onPress: () => {
            let res = fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Payments/DeletePayment/' + props.data.requestId, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            console.log(res);
            props.getHistory();
          }
        },
      ]
    );
  }

  const saveStatus = async (id) => {
    console.log("request", request)
    let request = {
      requestId: id,
      requestStatus: "F"
    }
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
      props.getPending()
    } catch (error) {
      console.log(error)
    }
  }

  const downloadFile = async () => {
    const url = props.data.requestProofDocument;
    const dot = url.lastIndexOf(".");
    const questionMark = url.lastIndexOf("?");
    const type = url.substring(dot, questionMark);
    console.log("Type", type)
    const id = props.data.requestId;
    const fileName = "Request " + id;
    const fileUri = FileSystem.documentDirectory + fileName;
    const DownloadedFile = await FileSystem.downloadAsync(url, fileUri);
    console.log("DownloadedFile", DownloadedFile)
    if (DownloadedFile.status == 200) {
      console.log("File Downloaded", DownloadedFile)
      saveFile(DownloadedFile.uri, fileName, DownloadedFile.headers['content-type']);
    }
    else {
      console.log("File not Downloaded")
    }
  }

  const saveFile = async (res, fileName, type) => {
    if (Platform.OS == "ios") {
      shareAsync(res.uri)
    }
    else { //ios download with share
      try {
        const permission = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permission.granted) {
          const base64 = await FileSystem.readAsStringAsync(res, { encoding: FileSystem.EncodingType.Base64 });
          await FileSystem.StorageAccessFramework.createFileAsync(permission.directoryUri, fileName, type)
            .then(async (res) => {
              console.log("File", res)
              await FileSystem.writeAsStringAsync(res, base64, { encoding: FileSystem.EncodingType.Base64 });
              return Alert.alert("File Saved")

            })
            .catch(error => { console.log("Error", error) })
        }

      }
      catch (error) {
        console.log("Error", error)
      }
    }
  }

  const displayStatus = () => {

    if (props.data.requestStatus == "F") {
      return "Finished"
    }
    else if (props.data.requestStatus == "C") {
      return "Canceled"
    }
    else if (props.data.requestStatus == "R") {
      return "Rejected"
    }
  }




  return (
    <SafeAreaView>
      <View>
        {expanded ?
          <View style={newStyles.requestOpen}>
            <View style={newStyles.requestItemHeaderOpen}>
              <TouchableOpacity onPress={toggle} style={newStyles.request}>
                <View style={newStyles.requestItemLeft}>
                  <Text style={newStyles.requestItemText}>{dateString}</Text>
                </View>
                <View style={newStyles.requestItemMiddle}>
                  <Text style={newStyles.requestItemText}>{props.subject}</Text>
                </View>
              </TouchableOpacity>
              <Menu style={{ flexDirection: 'column', marginVertical: 0 }} onSelect={value => openModal(value)} >
                <MenuTrigger
                  children={<View>
                    <MaterialCommunityIcons name="dots-horizontal" size={28} color="gray" />
                  </View>}
                />
                <MenuOptions customStyles={{
                  optionsWrapper: newStyles.optionsWrapperOpened,
                }}  >
                  <MenuOption value={2} children={<View style={newStyles.options}><Feather name='eye' size={20} /><Text style={newStyles.optionsText}> View Document</Text></View>} />
                  <MenuOption style={newStyles.deleteTxt} value={4} children={<View style={newStyles.options}><Feather name='trash-2' size={20} color='#FF3C3C' /><Text style={newStyles.deleteTxt}> Delete Requset</Text></View>} />
                </MenuOptions>
              </Menu>
              <Modal animationType='slide' transparent={true} visible={modal1Visible} onRequestClose={() => setModal1Visible(false)}>
                <View style={styles.documentview}>
                  <TouchableOpacity style={styles.closeBtn} onPress={() => setModal1Visible(false)}>
                    <AntDesign name="close" size={24} color="black" />
                  </TouchableOpacity>
                  <Image source={{ uri: props.data.requestProofDocument }} style={styles.documentImg} />
                  <TouchableOpacity style={styles.documentDownloadButton} onPress={downloadFile} >
                    <Text style={styles.documentButtonText}>Download</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </View>
            <View style={newStyles.requestItemBody}>
              <View style={newStyles.requestItemBodyLeft}>
                <Text style={newStyles.requestItemText}>Date: </Text>
                <Text style={newStyles.requestItemText}>Amount: </Text>
                <Text style={[newStyles.requestItemText, props.requestComment == null || props.requestComment == '' && { display: 'none' }]}>Comment: </Text>
              </View>
              <View style={newStyles.requestItemBodyRight}>
                <Text style={newStyles.requestItemText}>{dateString}</Text>
                <Text style={newStyles.requestItemText}>{props.data.amountToPay}</Text>
                <Text style={[newStyles.requestItemText, props.data.requestComment == null || props.data.requestComment == '' && { display: 'none' }]}>{props.requestComment}</Text>
              </View>
            </View>
          </View>
          :
          <View>
            <View style={newStyles.requestItemHeader}>
              <TouchableOpacity onPress={toggle} style={newStyles.request}>
                <View style={newStyles.requestItemLeft}>
                  <Text style={newStyles.requestItemText}>{dateString}</Text>
                </View>
                <View style={newStyles.requestItemMiddle}>
                  <Text style={newStyles.requestItemText}>{props.subject}</Text>
                </View>
              </TouchableOpacity>
              <Menu style={{ flexDirection: 'column', marginVertical: 0 }} onSelect={value => openModal(value)} >
                <MenuTrigger
                  children={<View>
                    <MaterialCommunityIcons name="dots-horizontal" size={28} color="gray" />
                  </View>}
                />
                <MenuOptions customStyles={{
                  optionsWrapper: newStyles.optionsWrapper,
                }}
                >
                  <MenuOption style={{ borderRadius: 16 }} value={2} children={<View style={newStyles.options}><Feather name='eye' size={20} /><Text style={newStyles.optionsText}> View Document</Text></View>} />
                  <MenuOption style={newStyles.deleteTxt} value={4} children={<View style={newStyles.options}><Feather name='trash-2' size={20} color='#FF3C3C' /><Text style={newStyles.deleteTxt}> Delete Requset</Text></View>} />
                </MenuOptions>
              </Menu>
              <Modal animationType='slide' transparent={true} visible={modal1Visible} onRequestClose={() => setModal1Visible(false)}>
                <View style={styles.documentview}>
                  <TouchableOpacity style={styles.closeBtn} onPress={() => setModal1Visible(false)}>
                    <AntDesign name="close" size={24} color="black" />
                  </TouchableOpacity>
                  <Image source={{ uri: props.data.requestProofDocument }} style={styles.documentImg} />
                  <TouchableOpacity style={styles.documentDownloadButton} onPress={downloadFile} >
                    <Text style={styles.documentButtonText}>Download</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
            </View>
          </View>
        }
      </View>
    </SafeAreaView >
  );
}

const newStyles = StyleSheet.create({
  requestItemHeader: {
    justifyContent: 'space-between',
    width: Dimensions.get('screen').width * 0.9,
    height: 65,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E6EBF2',
    marginVertical: 10,
    backgroundColor: '#FFF',
    padding: 12,
    flexDirection: 'row',
  },
  requestItemBodyEdit: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 5,
    width: SCREEN_WIDTH * 0.9,
  },
  requestItemHeaderOpen: {
    // justifyContent: 'flex-start',
    width: SCREEN_WIDTH * 0.9,
    height: 65,
    alignItems: 'center',
    paddingHorizontal: 12,
    flexDirection: 'row',
    borderRadius: 10,
    borderBottomColor: '#7DA9FF',
    borderBottomWidth: 1.5,
  },
  requestOpen: {
    width: SCREEN_WIDTH * 0.9,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#7DA9FF',
    marginVertical: 10,
    backgroundColor: '#F5F8FF',
    padding: 5,
  },
  requestItemBody: {
    justifyContent: 'space-between',
    width: SCREEN_WIDTH * 0.9,
    alignItems: 'flex-start',
    padding: 12,
    flexDirection: 'row',
    flex: 1,
  },
  request: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    flex: 1,
  },
  requestItemRight: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 54,
    height: 54,
    borderRadius: 16,
  },
  requestItemMiddle: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 2,
  },
  requestItemLeft: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 2,
  },
  requestItemText: {
    fontSize: 18,
    color: '#000000',
    fontFamily: 'Urbanist-SemiBold',
  },
  options: {
    flexDirection: 'row',
    borderBottomColor: '#80808080',
    borderBottomWidth: 0.2,
    padding: 15,
    fontFamily: 'Urbanist-Medium',
  },
  optionsText: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 16,
  },
  optionsWrapper: {
    position: 'absolute',
    flexDirection: 'column',
    top: -120,
    backgroundColor: '#fff',
    borderRadius: 10,
    left: SCREEN_WIDTH * 0.065,
    elevation: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  optionsWrapperOpened: {
    position: 'absolute',
    top: -130,
    backgroundColor: '#fff',
    borderRadius: 10,
    left: SCREEN_WIDTH * 0.065,
    elevation: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  deleteTxt: {
    color: '#FF3C3C',
    fontFamily: 'Urbanist-Medium',
    fontSize: 16,
  },
  requestItemBodyLeft: {
    flex: 2,
  },
  requestItemBodyRight: {
    flex: 3,
    alignItems: 'flex-start',
  },
})

const styles = StyleSheet.create({
  closeBtn: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: Dimensions.get('window').width * 0.9,
    marginVertical: 30,
  },
  pending: {
    alignItems: 'center',
    paddingTop: 10,
    backgroundColor: '#FEFEFE',
    flexGrow: 1,
  },
  addBtnView: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  documentImg: {
    height: SCREEN_HEIGHT * 0.5,
    width: SCREEN_WIDTH * 0.9,
    borderRadius: 16,
  },
  documentDownloadButton: {
    fontSize: 16,
    borderRadius: 16,
    marginVertical: 10,
    backgroundColor: '#548DFF',
    fontFamily: 'Urbanist-Bold',
    alignItems: 'center',
    justifyContent: 'center',
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.06,
  },
  documentview: {
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'white',
    flex: 1,
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