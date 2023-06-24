import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, LayoutAnimation, Modal, ScrollView, Image, Platform } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { MaterialCommunityIcons, AntDesign, Feather } from '@expo/vector-icons';
import NewPayment from './NewPayment';
import EditPaymentScreen from './EditPaymentScreen';
import { useUserContext } from '../../UserContext';
import { AddBtn } from '../HelpComponents/AddNewTask';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from "react-native-popup-menu";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function Pending() {
  const { userContext, userPendingPayments, sendPushNotification } = useUserContext()
  const pushToken2 = userContext.pushToken2;
  const [modal1Visible, setModal1Visible] = useState(false);
  const [Pendings, setPendings] = useState()
  const isFocused = useIsFocused()

  useEffect(() => {
    renderPendings()
  }, [userPendingPayments])

  const renderPendings = async () => {
    let arr = userPendingPayments.map((item) => {
      return (
        <Request
          key={item.requestId} renderPendings={renderPendings} data={item}
          id={item.requestId} Notification={() => { Notification(item.requestSubject, item.amountToPay, item.requestDate) }}
          View={View} subject={item.requestSubject}
          amountToPay={item.amountToPay}
          date={item.requestDate} requestComment={item.requestComment}
        />
      )
    }
    )
    setPendings(arr)
  }

  // Should Get also the subject, amount, date
  const Notification = (subject, amount, date) => {
    const newdate = new Date(date);
    const year = newdate.getFullYear();
    const newYear = year.toString().substr(-2);
    const month = newdate.getMonth() + 1;
    const day = newdate.getDate();
    const dateString = day + "/" + month + "/" + newYear;
    let PushNotificationsData =
    {
      expoPushToken: pushToken2,
      title: "Reminder: Pending Request",
      body: `You have a payment request pending! \n Subject: ${subject} \n Amount: ${amount} \n Date: ${dateString}`,
      data: { data: 'goes here' },
      // how to send user to the request screen? 
      // maybe we can send the request id and then in the request screen we will fetch the request by id
    }
    sendPushNotification(PushNotificationsData)
  }

  return (
    <>
      <ScrollView contentContainerStyle={styles.pending}>
        {Pendings}
        <Modal animationType='slide' transparent={true} visible={modal1Visible}>
          <NewPayment cancel={() => { setModal1Visible(false); renderPendings() }} />
        </Modal>
      </ScrollView>
      {userContext.userType == "Caregiver" ? <View style={styles.addBtnView}><AddBtn onPress={() => setModal1Visible(true)} /></View> : null}
    </>
  );
}

function Request(props) {
  const [expanded, setExpanded] = useState(false);
  // const animationController = useRef(new Animated.Value(0)).current;
  const [modal1Visible, setModal1Visible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);
  const date = new Date(props.date);
  const year = date.getFullYear();
  const newYear = year.toString().substr(-2);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dateString = day + "/" + month + "/" + newYear;
  const [valueChanged, setValueChanged] = useState(false);
  const [status, setStatus] = useState(props.data.requestStatus);
  const { userContext, GetUserPending, GetUserHistory, sendPushNotification } = useUserContext();
  const [DownloadProgress, setDownloadProgress] = useState();
  const pushToken2 = userContext.pushToken2;

  const toggle = () => {
    const config = {
      toValue: expanded ? 0 : 1,
      duration: 2000,
      useNativeDriver: true,
    }
    LayoutAnimation.easeInEaseOut(setExpanded(!expanded));
  };

  const editRequest = () => {
    if (status == "F") {
      Alert.alert(
        'Edit Payment request',
        'You cannot edit a paid request',
        [
          { text: "OK", style: 'cancel', onPress: () => { } },
        ],
      );
    }
    else if (status == "P") {
      setModal2Visible(true)
    }
  }

  const openModal = (value) => {
    if (value == 1) {
      let PushNotificationsData =
      {
        expoPushToken: pushToken2,
        title: "Reminder: Pending Request",
        body: `You have a payment request pending! \n Subject: ${props.subject} \n Amount: ${props.amountToPay} \n Date: ${dateString}`,
        data: { data: 'goes here' },
        // how to send user to the request screen? 
        // maybe we can send the request id and then in the request screen we will fetch the request by id
      }
      sendPushNotification(PushNotificationsData)
    }
    else if (value == 2) {
      setModal1Visible(true)
    }
    if (value == 3) {
      editRequest()
    }
    if (value == 4) {
      deleteRequest()
    }
  }

  const deleteRequest = () => {
    let userTypeResult;
    if (userContext.userType == "Caregiver") {
      userTypeResult = "C"
    }
    else {
      userTypeResult = "R"
    }
    Alert.alert(
      'Delete request',
      'are you sure you want to Delete? All changes will be lost',
      [
        { text: "Don't delete", style: 'cancel', onPress: () => { } },
        {
          text: 'Delete',
          style: 'destructive',
          // If the user confirmed, then we dispatch the action we blocked earlier
          // This will continue the action that had triggered the removal of the screen
          onPress: () => {
            let res = fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Payments/DeletePayment/', {
              method: 'POST',
              body: JSON.stringify({ requestId: props.data.requestId, requestStatus: userTypeResult }),
              headers: { 'Content-Type': 'application/json', },
            }).then(res => {
              if (res.ok) {
                console.log('res.ok', res.ok);
                GetUserPending();
                GetUserHistory();
                return res.json()
              }
            })
              .then(
                (result) => {
                  console.log("fetch POST= ", result);
                },
                (error) => {
                  console.log("err post=", error);
                });
          }
        },
      ]
    );
  }

  const askUserBeforeSave = () => {
    if (status == "F") {
      setStatus("P")
    }
    else if (status == "P") {
      setStatus("F")
      setTimeout(() => {
        saveStatus(props.data.requestId)
      }, 3000);
    }
  }

  const saveStatus = async (id) => {
    if (status == "F") {
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
        GetUserPending();
        GetUserHistory();
      } catch (error) {
        console.log(error)
      }
    }
  }

  const callback = downloadProgress => {
    const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
    setDownloadProgress(progress);
    console.log("Progress", progress)
  }

  const downloadFile = async () => {
    try {
      const url = props.data.requestProofDocument;
      const dot = url.lastIndexOf(".");
      const questionMark = url.lastIndexOf("?");
      const type = url.substring(dot, questionMark);
      const id = props.data.requestId;
      const fileName = "Request_" + id + type;
      const fileUri = FileSystem.documentDirectory + fileName;
      // const downloadResumable = FileSystem.createDownloadResumable(url,fileUri,{},callback);
      const directoryInfo = await FileSystem.getInfoAsync(fileUri);
      if (!directoryInfo.exists) {
        FileSystem.makeDirectoryAsync(fileUri, { intermediates: true });
      }
      const DownloadedFile = await FileSystem.downloadAsync(url, fileUri, {}, callback);
      if (DownloadedFile.status == 200) {
        saveFile(DownloadedFile.uri, fileName, DownloadedFile.headers['content-type']);
      }
      else {
        console.log("File not Downloaded")
      }
    }
    catch (error) {
      console.log(error)
      Alert.alert("Error", error)
    }
  }

  const saveFile = async (res, fileName, type) => {
    if (Platform.OS == "ios") {
      Sharing.shareAsync(res)
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

  return (
    <SafeAreaView>
      <View>
        {expanded ?
          <View style={styles.requestOpen}>
            <View style={styles.requestItemHeaderOpen}>
              <TouchableOpacity onPress={toggle} style={styles.request}>
                <View style={styles.requestItemLeft}>
                  <Text style={styles.requestItemText}>{dateString}</Text>
                </View>
                <View style={styles.requestItemMiddle}>
                  <Text style={styles.requestItemText}>{props.subject.length > 17 ? props.subject.slice(0, 12) + "..." : props.subject}</Text>
                </View>
              </TouchableOpacity>
              <Menu style={{ flexDirection: 'column', marginVertical: 0 }} onSelect={value => openModal(value)} >
                <MenuTrigger
                  children={<View>
                    <MaterialCommunityIcons name="dots-horizontal" size={28} color="gray" />
                  </View>}
                />
                <MenuOptions customStyles={{ optionsWrapper: styles.optionsWrapperOpened }}  >
                  <MenuOption disableTouchable={userContext.userId == props.data.userId ? false : true} value={1} children={<View style={styles.options}><MaterialCommunityIcons name='bell-ring-outline' size={20} /><Text style={styles.optionsText}> Send Notification</Text></View>} />
                  <MenuOption value={2} children={<View style={styles.options}><Feather name='eye' size={20} /><Text style={styles.optionsText}> View Document</Text></View>} />
                  <MenuOption disableTouchable={userContext.userId == props.data.userId ? false : true} value={3} children={<View style={userContext.userId == props.data.userId ? styles.options : styles.disabledoptions}><Feather name='edit' size={20} /><Text style={styles.optionsText}> Edit Request</Text></View>} />
                  <MenuOption style={[styles.deleteTxt]} value={4} children={<View style={userContext.userId == props.data.userId ? styles.options : styles.disabledoptions}><Feather name='trash-2' size={20} color='#FF3C3C' /><Text style={styles.deleteTxt}> Delete Request</Text></View>} />
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
              <Modal animationType='slide' transparent={true} visible={modal2Visible}>
                <EditPaymentScreen cancel={() => { setModal2Visible(false); props.renderPendings() }} data={props.data} />
              </Modal>
            </View>
            <View style={styles.requestItemBody}>
              <View style={styles.requestItemBodyLeft}>
                <Text style={styles.requestItemText}>Subject: </Text>
                <Text style={styles.requestItemText}>Date: </Text>
                <Text style={styles.requestItemText}>Amount: </Text>
                <Text style={[styles.requestItemText, props.requestComment == null || props.requestComment == '' && { display: 'none' }]}>Comment: </Text>
              </View>
              <View style={styles.requestItemBodyRight}>
                <Text style={styles.requestItemText}>{props.subject}</Text>
                <Text style={styles.requestItemText}>{dateString}</Text>
                <Text style={styles.requestItemText}>{props.amountToPay}</Text>
                <Text style={[styles.requestItemText, props.requestComment == null || props.requestComment == '' && { display: 'none' }]}>{props.requestComment}</Text>
              </View>
            </View>
          </View>
          :
          <View style={styles.requestItemHeader}>
            <TouchableOpacity style={styles.request} onPress={() => askUserBeforeSave()}>
              <View style={styles.requestItemLeft}>
                {
                  status != 'F' ?
                    <Feather name="circle" size={30} color="#548DFF" />
                    :
                    <Feather name="check-circle" size={30} color="#548DFF" />
                }
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggle} style={styles.requestItemMiddle}>
              <View>
                <Text style={[styles.requestItemText, status == 'F' ? { textDecorationLine: 'line-through' } : {}]}>{dateString} - {props.subject.length > 15 ? props.subject.slice(0, 12) + "..." : props.subject}</Text>
              </View>
            </TouchableOpacity>
            <Menu style={{ flexDirection: 'column', marginVertical: 0, position: 'relative' }} onSelect={value => openModal(value)} >
              <MenuTrigger
                children={<View>
                  <MaterialCommunityIcons name="dots-horizontal" size={28} color="gray" />
                </View>}
              />
              <MenuOptions customStyles={{
                optionsContainer: {
                  borderRadius: 10,
                  elevation: 100,
                },
                optionsWrapper: styles.optionsWrapper,
              }}
              >
                <MenuOption value={1} children={<View style={styles.options}><MaterialCommunityIcons name='bell-ring-outline' size={20} /><Text style={styles.optionsText}> Send Notification</Text></View>} />
                <MenuOption value={2} children={<View style={styles.options}><Feather name='eye' size={20} /><Text style={styles.optionsText}> View Document</Text></View>} />
                <MenuOption disableTouchable={userContext.userId == props.data.userId ? false : true} value={3} children={<View style={userContext.userId == props.data.userId ? styles.options : styles.disabledoptions}><Feather name='edit' size={20} /><Text style={styles.optionsText}> Edit Request</Text></View>} />
                <MenuOption value={4} children={<View style={styles.options}><Feather name='trash-2' size={20} color='#FF3C3C' /><Text style={styles.deleteTxt}> Delete Request</Text></View>} />
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
            <Modal animationType='slide' transparent={true} visible={modal2Visible}>
              <EditPaymentScreen cancel={() => { setModal2Visible(false); props.renderPendings() }} data={props.data} />
            </Modal>
          </View>
        }
      </View >
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
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
  requestItemMiddle: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 3.5,
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
    padding: 7,
    fontFamily: 'Urbanist-Medium',
  },
  disabledoptions: {
    flexDirection: 'row',
    borderBottomColor: '#808080',
    borderBottomWidth: 0.2,
    padding: 7,
    fontFamily: 'Urbanist-Medium',
    opacity: 0.5,
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
    left: SCREEN_WIDTH * 0.09,
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
    bottom: -56,
    backgroundColor: '#fff',
    borderRadius: 10,
    left: SCREEN_WIDTH * 0.09,
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
  documentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Urbanist-Bold',
    alignItems: 'center',
  },
})