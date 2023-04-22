
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, Animated, Modal, Image } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import NewPaycheck from './NewPaycheck';
import EditPaycheck from './EditPaycheck';
import { useUserContext } from '../../UserContext';
import { AddBtn } from '../HelpComponents/AddNewTask';
import { MaterialCommunityIcons, AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-navigation';
import { Menu, MenuProvider, MenuOptions, MenuOption, MenuTrigger, renderers } from "react-native-popup-menu";

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Paychecks({ navigation, route }) {
  const { userContext } = useUserContext();
  const [History, setHistory] = useState()
  const [arr, setArr] = useState()
  const isFocused = useIsFocused()
  const [modal1Visible, setModal1Visible] = useState(false);

  useEffect(() => {
    if (isFocused && modal1Visible == false) {
      getPaychecks()
    }
  }, [isFocused, modal1Visible])

  const getPaychecks = async () => {
    const user = {
      userId: userContext.userId,
      userType: userContext.userType,
    }

    try {
      const response = await fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/PayChecks/GetPaychecks/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
      });
      const data = await response.json();
      setArr(data)
      if (data != null && data.length != undefined) {
        let arr = data.map((item) => {
          return (
            <Paycheck key={item.payCheckNum} getPaychecks={getPaychecks} data={item} />
          )
        })
        setHistory(arr)
      }
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
    <ScrollView contentContainerStyle={styles.pending}>
      <View style={styles.headerText}>
        <Text style={styles.header}>Paychecks History</Text>
        <View style={styles.line}></View>
      </View>
      {History}
      <View style={styles.addBtnView}><AddBtn onPress={() => setModal1Visible(true)} /></View>
      <Modal animationType='slide' transparent={true} visible={modal1Visible}>
        <NewPaycheck cancel={() => { setModal1Visible(false); getPaychecks() }} userId={userContext.userId} />
      </Modal>
    </ScrollView>
  );
}

function Paycheck(props) {
  const [expanded, setExpanded] = useState(false);
  const animationController = useRef(new Animated.Value(0)).current;
  const [modal1Visible, setModal1Visible] = useState(false);
  const [temp, setTemp] = useState({
    paycheckDate: props.data.paycheckDate,
    paycheckSummary: props.data.paycheckSummary,
    paycheckComment: props.data.paycheckComment,
    payCheckNum: props.data.payCheckNum,
    UserId: props.data.UserId,
    payCheckProofDocument: props.data.payCheckProofDocument,
  })
  const [modal2Visible, setModal2Visible] = useState(false);
  const date = new Date(temp.paycheckDate);
  const year = date.getFullYear();
  const newYear = year.toString().substr(-2);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dateString = day + "/" + month + "/" + newYear;
  const paycheckNum = props.data.paycheckNum;

  const toggle = () => {
    const config = {
      toValue: expanded ? 0 : 1,
      duration: 2000,
      useNativeDriver: true,
    }
    Animated.timing(animationController, config).start();
    setExpanded(!expanded);
  };

  const openModal = async (value) => {
    if (value == 1) {
      console.log("Nottification")
    }
    else if (value == 2) {
      setModal1Visible(true)
    }
    else if (value == 3) {
      setModal2Visible(true)
    }
    else if (value == 4) {
      deletePaycheck(props.data.paycheckNum)
    }
  }

  const deletePaycheck = async () => {
    console.log("Delete Paycheck: " + temp.payCheckNum);
    Alert.alert(
      'Delete Paycheck',
      'are you sure you want to Delete the Paycheck?',
      [
        { text: "Dont Delete", style: 'cancel', onPress: () => { } },
        {
          text: 'Delete',
          style: 'destructive',
          // If the user confirmed, then we dispatch the action we blocked earlier
          // This will continue the action that had triggered the removal of the screen
          onPress: () => {
            let res = fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Paychecks/DeletePaycheck/' + temp.payCheckNum, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
            })
              .then(res => {
                console.log("res.ok", res.ok);
                if (!res.ok) {
                  console.log("res.status", res.status);
                  throw Error("Error " + res.status);
                }
                return res.json();
              })
              .then(
                (result) => {
                  console.log("fetch DELETE= ", result);
                  Alert.alert("Delete Paycheck: " + temp.payCheckNum);
                  props.getPaychecks()
                },
                (error) => {
                  console.log("err post=", error);
                }
              );
          }
        },
      ]
    );
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
          <View style={styles.requestOpen}>
            <View style={styles.requestItemHeaderOpen}>
              <TouchableOpacity onPress={toggle} style={styles.request}>
                <View style={styles.requestItemLeft}>
                  <Text style={styles.requestItemText}>{dateString}</Text>
                </View>
              </TouchableOpacity>
              <Menu style={{ flexDirection: 'column', marginVertical: 0 }} onSelect={value => openModal(value)} >
                <MenuTrigger
                  children={<View>
                    <MaterialCommunityIcons name="dots-horizontal" size={28} color="gray" />
                  </View>}
                />
                <MenuOptions customStyles={{
                  optionsWrapper: styles.optionsWrapperOpened,
                }}  >
                  <MenuOption style={{ borderRadius: 16 }} value={1} children={<View style={styles.options}><MaterialCommunityIcons name='bell-ring-outline' size={20} /><Text style={styles.optionsText}> Send Notification</Text></View>} />
                  <MenuOption style={{ borderRadius: 16 }} value={2} children={<View style={styles.options}><Feather name='eye' size={20} /><Text style={styles.optionsText}> View Document</Text></View>} />
                  <MenuOption style={{ borderRadius: 16 }} value={3} children={<View style={styles.options}><Feather name='edit' size={20} /><Text style={styles.optionsText}> Edit Paycheck</Text></View>} />
                  <MenuOption style={styles.deleteTxt} value={4} children={<View style={styles.options}><Feather name='trash-2' size={20} color='#FF3C3C' /><Text style={styles.deleteTxt}> Delete Paycheck</Text></View>} />
                </MenuOptions>
              </Menu>
              <Modal animationType='slide' transparent={true} visible={modal1Visible} onRequestClose={() => setModal1Visible(false)}>
                <View style={styles.documentview}>
                  <TouchableOpacity style={styles.closeBtn} onPress={() => setModal1Visible(false)}>
                    <AntDesign name="close" size={24} color="black" />
                  </TouchableOpacity>
                  <Image source={{ uri: props.data.payCheckProofDocument }} style={styles.documentImg} />
                  <TouchableOpacity style={styles.documentDownloadButton} onPress={downloadFile} >
                    <Text style={styles.documentButtonText}>Download</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
              <Modal animationType='slide' transparent={true} visible={modal2Visible}>
                <EditPaycheck cancel={(value) => { setModal2Visible(false); setExpanded(true); props.getPaychecks() }} save={(value) => { setModal2Visible(false); setExpanded(false); props.getPaychecks(); setTemp(value) }} data={props.data} />
              </Modal>
            </View>
            <View style={styles.requestItemBody}>
              <View style={styles.requestItemBodyLeft}>
                <Text style={styles.requestItemText}>Date: </Text>
                <Text style={styles.requestItemText}>Amount: </Text>
                <Text style={[styles.requestItemText, temp.paycheckComment == null || temp.paycheckComment == '' && { display: 'none' }]}>Comment: </Text>

              </View>
              <View style={styles.requestItemBodyRight}>
                <Text style={styles.requestItemText}>{dateString}</Text>
                <Text style={styles.requestItemText}>{temp.paycheckSummary}</Text>
                <Text style={[styles.requestItemText, temp.paycheckComment == null || temp.paycheckComment == "" && { display: 'none' }]}>{temp.paycheckComment}</Text>

              </View>
            </View>
          </View>
          :
          <View>
            <View style={styles.requestItemHeader}>
              <TouchableOpacity onPress={toggle} style={styles.request}>
                <View style={styles.requestItemLeft}>
                  <Text style={styles.requestItemText}>{dateString}</Text>
                </View>
                <View style={styles.requestItemMiddle}>
                  <Text style={styles.requestItemText}>{props.subject}</Text>
                </View>
              </TouchableOpacity>
              <Menu style={{ flexDirection: 'column', marginVertical: 0 }} onSelect={value => openModal(value)} >
                <MenuTrigger
                  children={<View>
                    <MaterialCommunityIcons name="dots-horizontal" size={28} color="gray" />
                  </View>}
                />
                <MenuOptions customStyles={{
                  optionsWrapper: styles.optionsWrapper,
                }}
                >
                  <MenuOption style={{ borderRadius: 16 }} value={1} children={<View style={styles.options}><MaterialCommunityIcons name='bell-ring-outline' size={20} /><Text style={styles.optionsText}> Send Notification</Text></View>} />
                  <MenuOption style={{ borderRadius: 16 }} value={2} children={<View style={styles.options}><Feather name='eye' size={20} /><Text style={styles.optionsText}> View Document</Text></View>} />
                  <MenuOption style={{ borderRadius: 16 }} value={3} children={<View style={styles.options}><Feather name='edit' size={20} /><Text style={styles.optionsText}> Edit Paycheck</Text></View>} />
                  <MenuOption style={styles.deleteTxt} value={4} children={<View style={styles.options}><Feather name='trash-2' size={20} color='#FF3C3C' /><Text style={styles.deleteTxt}> Delete Paycheck</Text></View>} />
                </MenuOptions>
              </Menu>
              <Modal animationType='slide' transparent={true} visible={modal1Visible} onRequestClose={() => setModal1Visible(false)}>
                <View style={styles.documentview}>
                  <TouchableOpacity style={styles.closeBtn} onPress={() => setModal1Visible(false)}>
                    <AntDesign name="close" size={24} color="black" />
                  </TouchableOpacity>
                  <Image source={{ uri: props.data.payCheckProofDocument }} style={styles.documentImg} />
                  <TouchableOpacity style={styles.documentDownloadButton} onPress={downloadFile} >
                    <Text style={styles.documentButtonText}>Download</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
              <Modal animationType='slide' transparent={true} visible={modal2Visible}>
                <EditPaycheck cancel={(value) => { setModal2Visible(false); setExpanded(true); props.getPaychecks() }} save={(value) => { setModal2Visible(false); setExpanded(false); props.getPaychecks(); setTemp(value) }} data={props.data} />
              </Modal>
            </View>
          </View>
        }
      </View>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  line: {
    borderBottomColor: '#E6EBF2',
    borderBottomWidth: 1.5,
  },
  closeBtn: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: Dimensions.get('window').width * 0.9,
    marginVertical: 30,
  },
  requestItemHeader: {
    justifyContent: 'space-between',
    width: Dimensions.get('screen').width * 0.9,
    height: 60,
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
    width: Dimensions.get('screen').width * 0.9,
  },
  requestItemHeaderOpen: {
    // justifyContent: 'flex-start',
    width: Dimensions.get('screen').width * 0.9,
    height: 60,
    alignItems: 'center',
    paddingHorizontal: 12,
    flexDirection: 'row',
    borderRadius: 10,
    borderBottomColor: '#7DA9FF',
    borderBottomWidth: 1.5,
  },
  requestOpen: {
    width: Dimensions.get('screen').width * 0.9,
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
    width: Dimensions.get('screen').width * 0.9,
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
    marginVertical: 20,
  },
  documentDownloadButton: {
    fontSize: 16,
    borderRadius: 16,
    backgroundColor: '#548DFF',
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
  pending: {
    backgroundColor: 'white',
    flexGrow: 1,
    paddingTop: 10,
    alignItems: 'center',
  },
  headerText: {
    height: Dimensions.get('screen').height * 0.05,
    width: Dimensions.get('screen').width * 0.85,
    marginBottom: Dimensions.get('screen').height * 0.02,
  },
  header: {
    fontSize: 30,
    fontFamily: 'Urbanist-Bold',
    textAlign: 'center'
  },
  addBtnView: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
})