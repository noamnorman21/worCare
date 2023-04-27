import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, Animated, Modal, ScrollView, Image, layoutView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { MaterialCommunityIcons, AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import NewPayment from './NewPayment';
import EditPaymentScreen from './EditPaymentScreen';
import { useUserContext } from '../../UserContext';
import { AddBtn } from '../HelpComponents/AddNewTask';
import { Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger, renderers } from "react-native-popup-menu";
import * as FileSystem from 'expo-file-system';
import { SafeAreaView } from 'react-navigation';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function Pending({ route, navigation }) {
  const { userContext, userPendingPayments } = useUserContext()
  const [modal1Visible, setModal1Visible] = useState(false);
  const [Pendings, setPendings] = useState()
  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) {
      getPending()
    }
  }, [isFocused])


  const getPending = async () => {
    try {
      const user = {
        userId: userContext.userId,
        userType: userContext.userType
      }
      const response = await fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Payments/GetPending/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
      });
      const data = await response.json();
      let arr = data.map((item) => {
        return (
          <Request key={item.requestId} getPending={getPending} data={item} id={item.requestId} Notification={Notification} View={View} subject={item.requestSubject} amountToPay={item.amountToPay} date={item.requestDate} requestComment={item.requestComment} />
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

  return (
    <>
      <ScrollView contentContainerStyle={styles.pending}>
        {Pendings}
        <Modal animationType='slide' transparent={true} visible={modal1Visible}>
          <NewPayment cancel={() => { setModal1Visible(false); getPending() }} />
        </Modal>
      </ScrollView>
      {userContext.userType == "Caregiver" ? <View style={styles.addBtnView}><AddBtn onPress={() => setModal1Visible(true)} /></View> : null}
    </>
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
  const [valueChanged, setValueChanged] = useState(false);
  const [status, setStatus] = useState(props.data.requestStatus);
  const { userContext } = useUserContext();

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
      deleteRequest()
    }
  }

  const Cancel = () => {
    if (valueChanged) {
      Alert.alert(
        'Cancel Changes',
        'are you sure you want to Exit the Page? All changes will be lost',
        [
          { text: "Don't leave", style: 'cancel', onPress: () => { } },
          {
            text: 'Leave',
            style: 'destructive',
            // If the user confirmed, then we dispatch the action we blocked earlier
            // This will continue the action that had triggered the removal of the screen
            onPress: () => props.cancel()
          },
        ]
      );
    }
    else {
      props.cancel();
    }
  }

  const deleteRequest = () => {
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
            props.getPending();
          }
        },
      ]
    );
  }

  const askUserBeforeSave = () => {
    Alert.alert(
      'Save Changes',
      'are you sure you want to Save? This Action cannot be undone',
      [
        { text: "Don't save", style: 'cancel', onPress: () => { } },
        {
          text: 'Save',
          style: 'destructive',
          // If the user confirmed, then we dispatch the action we blocked earlier
          // This will continue the action that had triggered the removal of the screen
          onPress: () => {
            saveStatus(props.data.requestId)
          }
        },
      ]
    );
  }

  const saveStatus = async (id) => {
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
      setStatus("F")
      setTimeout(() => {
        props.getPending()
      }, 1500);
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
                  <MenuOption disableTouchable={userContext.userId == props.data.userId ? false : true} value={1} children={<View style={newStyles.options}><MaterialCommunityIcons name='bell-ring-outline' size={20} /><Text style={newStyles.optionsText}> Send Notification</Text></View>} />
                  <MenuOption disableTouchable={userContext.userId == props.data.userId ? false : true} value={2} children={<View style={newStyles.options}><Feather name='eye' size={20} /><Text style={newStyles.optionsText}> View Document</Text></View>} />
                  <MenuOption disableTouchable={userContext.userId == props.data.userId ? false : true} value={3} children={<View style={userContext.userId == props.data.userId ? newStyles.options : newStyles.disabledoptions}><Feather name='edit' size={20} /><Text style={newStyles.optionsText}> Edit Request</Text></View>} />
                  <MenuOption style={newStyles.deleteTxt} value={4} children={<View style={userContext.userId == props.data.userId ? newStyles.options : newStyles.disabledoptions}><Feather name='trash-2' size={20} color='#FF3C3C' /><Text style={newStyles.deleteTxt}> Delete Request</Text></View>} />
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
                <EditPaymentScreen cancel={() => { setModal2Visible(false); props.getPending() }} data={props.data} />
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
                <Text style={newStyles.requestItemText}>{props.amountToPay}</Text>
                <Text style={[newStyles.requestItemText, props.requestComment == null || props.requestComment == '' && { display: 'none' }]}>{props.requestComment}</Text>
              </View>
            </View>
          </View>
          :
          <View>
            <View style={newStyles.requestItemHeader}>
              <TouchableOpacity style={newStyles.request} onPress={() => askUserBeforeSave()}>
                <View style={newStyles.requestItemLeft}>
                  {
                    status != 'F' ?
                      <Feather name="circle" size={30} color="#548DFF" />
                      :
                      <Feather name="check-circle" size={30} color="#548DFF" />
                  }
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggle} style={newStyles.requestItemMiddle}>
                <View>
                  <Text style={newStyles.requestItemText}>{dateString} - {props.subject}</Text>
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
                  optionsWrapper: newStyles.optionsWrapper,
                }}
                >
                  <MenuOption value={1} children={<View style={newStyles.options}><MaterialCommunityIcons name='bell-ring-outline' size={20} /><Text style={newStyles.optionsText}> Send Notification</Text></View>} />
                  <MenuOption value={2} children={<View style={newStyles.options}><Feather name='eye' size={20} /><Text style={newStyles.optionsText}> View Document</Text></View>} />
                  <MenuOption disableTouchable={userContext.userId == props.data.userId ? false : true} value={3} children={<View style={userContext.userId == props.data.userId ? newStyles.options : newStyles.disabledoptions}><Feather name='edit' size={20} /><Text style={newStyles.optionsText}> Edit Request</Text></View>} />
                  <MenuOption disableTouchable={userContext.userId == props.data.userId ? false : true} value={4} children={<View style={userContext.userId == props.data.userId ? newStyles.options : newStyles.disabledoptions}><Feather name='trash-2' size={20} color='#FF3C3C' /><Text style={newStyles.deleteTxt}> Delete Request</Text></View>} />
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
                <EditPaymentScreen cancel={() => { setModal2Visible(false); props.getPending() }} data={props.data} />
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