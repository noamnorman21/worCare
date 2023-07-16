import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, LayoutAnimation, Animated, Modal, Image, ScrollView, Platform } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import NewPayment from './NewPayment';
import { useUserContext } from '../../UserContext';
import { AddBtn } from '../HelpComponents/AddNewTask';
import * as FileSystem from 'expo-file-system';
import { SafeAreaView } from 'react-navigation';
import { MaterialCommunityIcons, AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { Menu, MenuOptions, MenuOption, MenuTrigger, } from "react-native-popup-menu";
import * as Sharing from 'expo-sharing';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function History({ navigation, route }) {
  const { userContext, userHistoryPayments } = useUserContext();
  const [History, setHistory] = useState('')
  const [modal1Visible, setModal1Visible] = useState(false);
  const isFocused = useIsFocused()
  const [isAtBottom, setIsAtBottom] = useState(false);
  const scrollRef = useRef();
  const onScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;
    const isBottom = offsetY + layoutHeight >= contentHeight - 45;
    setIsAtBottom(isBottom);
  };

  const onContentSizeChange = () => {
    // Call scrollTo with y offset of 0 to trigger onScroll.
    // scrollRef.current.scrollTo({ x: 0, y: 0, animated: true });
  };

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
    renderHistory()
  }, [userHistoryPayments])

  const renderHistory = async () => {
    try {
      if(userContext.userType == "Caregiver"){
      let arr = userHistoryPayments.map((item) => {
        return (
          <Request key={item.requestId} renderHistory={renderHistory} data={item} id={item.requestId} View={View} Edit={Edit} subject={item.requestSubject} amountToPay={item.amountToPay} date={item.requestDate} requestComment={item.requestComment} />
        )
      })
      setHistory(arr)
    }
    else{
      let arr = userHistoryPayments.map((item) => {
        return (
          <RequestHeb key={item.requestId} renderHistory={renderHistory} data={item} id={item.requestId} View={View} Edit={Edit} subject={item.requestSubject} amountToPay={item.amountToPay} date={item.requestDate} requestComment={item.requestComment} />
        )
      })
      setHistory(arr)
    }
    } catch (error) {
      console.log("error", error)
    }
  }

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.pending}
        ref={scrollRef}
        onScroll={onScroll}
        onContentSizeChange={onContentSizeChange}
        scrollEventThrottle={16}
      >
        {History}
        <Modal animationType='slide' transparent={true} visible={modal1Visible}>
          <NewPayment cancel={() => setModal1Visible(false)} />
        </Modal>
      </ScrollView>
      {userContext.userType == "Caregiver" && !isAtBottom && (
        <View style={styles.addBtnView}>
          <AddBtn onPress={() => setModal1Visible(true)} />
        </View>
      )}
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
  const { userContext } = useUserContext();
  const [downloadProgress, setDownloadProgress] = useState(0);

  const toggle = () => {
    LayoutAnimation.easeInEaseOut(setExpanded(!expanded));
  };

  const openModal = (value) => {
    if (value == 2) {
      setModal1Visible(true)
    }
    if (value == 3) {
      setModal2Visible(true)
    }
  }

  const callback = downloadProgress => {
    const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
    setDownloadProgress(progress);
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
              return Alert.alert("Document Saved")
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
    if (userContext.userType == "Caregiver") {
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
  else {
    if (props.data.requestStatus == "F") {
      return "הושלם"
    }
    else if (props.data.requestStatus == "C") {
      return "בוטל"
    }
    else if (props.data.requestStatus == "R") {
      return "נדחה"
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
                <View style={styles.requestItemMiddle}>
                  <Text style={styles.requestItemText}><Text style={styles.requestItemText}>{props.subject}</Text></Text>
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
                  <MenuOption value={2} children={<View style={styles.options}><Feather name='eye' size={20} /><Text style={styles.optionsText}> View Document</Text></View>} />
                  <MenuOption disableTouchable={true} style={styles.deleteTxt} value={4} children={<View style={styles.disabledoptions}><Feather name='trash-2' size={20} color='#FF3C3C' /><Text style={styles.deleteTxt}> Delete Requset</Text></View>} />
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
            <View style={styles.requestItemBody}>
              <View style={styles.requestItemBodyLeft}>
                <Text style={styles.requestItemText}>Date: </Text>
                <Text style={styles.requestItemText}>Amount: </Text>
                <Text style={styles.requestItemText}>Status: </Text>
                <Text style={[styles.requestItemText, props.requestComment == null || props.requestComment == '' && { display: 'none' }]}>Comment: </Text>
              </View>
              <View style={styles.requestItemBodyRight}>
                <Text style={[styles.requestItemText, { fontFamily: 'Urbanist-Regular' }]}>{dateString}</Text>
                <Text style={[styles.requestItemText, { fontFamily: 'Urbanist-Regular' }]}>{props.data.amountToPay}</Text>
                <Text style={[styles.requestItemText, { fontFamily: 'Urbanist-Regular' }]}>{displayStatus()}</Text>
                <Text style={[styles.requestItemText, { fontFamily: 'Urbanist-Regular' }, props.data.requestComment == null || props.data.requestComment == '' && { display: 'none' }]}>{props.requestComment}</Text>
              </View>
            </View>
          </View>
          :
          <View style={styles.requestItemHeader}>
            <TouchableOpacity onPress={toggle} style={styles.request}>
              <View style={styles.requestItemLeft}>
                <Text style={styles.requestItemText}>{dateString}</Text>
              </View>
              <View style={styles.requestItemMiddleClose}>
                <Text style={styles.requestItemText}><Text style={styles.requestItemText}>{props.subject.length > 17 ? props.subject.slice(0, 15) + "..." : props.subject}</Text></Text>
              </View>
            </TouchableOpacity>
            <Menu style={{ alignItems: 'flex-end', marginVertical: 0, flexDirection: 'column' }} onSelect={value => openModal(value)} >
              <MenuTrigger
                children={<View>
                  <MaterialCommunityIcons name="dots-horizontal" size={28} color="gray" />
                </View>}
              />
              <MenuOptions customStyles={{
                optionsWrapper: styles.optionsWrapper,
              }}
              >
                <MenuOption style={{ borderRadius: 16 }} value={2} children={<View style={styles.options}><Feather name='eye' size={20} /><Text style={styles.optionsText}> View Document</Text></View>} />
                <MenuOption disableTouchable={true} style={styles.deleteTxt} value={4} children={<View style={styles.disabledoptions}><Feather name='trash-2' size={20} color='#FF3C3C' /><Text style={styles.deleteTxt}> Delete Requset</Text></View>} />
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
        }
      </View>
    </SafeAreaView >
  );
}

function RequestHeb(props) {
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
  const { userContext } = useUserContext();
  const [downloadProgress, setDownloadProgress] = useState(0);

  const toggle = () => {
    LayoutAnimation.easeInEaseOut(setExpanded(!expanded));
  };

  const openModal = (value) => {
    if (value == 2) {
      setModal1Visible(true)
    }
    if (value == 3) {
      setModal2Visible(true)
    }
  }

  const callback = downloadProgress => {
    const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
    setDownloadProgress(progress);
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
              return Alert.alert("Document Saved")
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
      return "הושלם"
    }
    else if (props.data.requestStatus == "C") {
      return "בוטל"
    }
    else if (props.data.requestStatus == "R") {
      return "נדחה"
    }
}

  return (
    <SafeAreaView>
      <View>
        {expanded ?
          <View style={styles.requestOpen}>
            <View style={styles.requestItemHeaderOpen}>
              <TouchableOpacity onPress={toggle} style={styles.request}>
                <View style={styles.requestItemMiddle}>
                  <Text style={[styles.requestItemText,{ textAlign:'center', width:'100%'}]}><Text style={styles.requestItemText}>{props.subject}</Text></Text>
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
                  <MenuOption value={2} children={<View style={styles.options}><Feather name='eye' size={20} /><Text style={styles.optionsText}> View Document</Text></View>} />
                  <MenuOption disableTouchable={true} style={styles.deleteTxt} value={4} children={<View style={styles.disabledoptions}><Feather name='trash-2' size={20} color='#FF3C3C' /><Text style={styles.deleteTxt}> Delete Requset</Text></View>} />
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
            <View style={styles.requestItemBody}>
              <View style={styles.requestItemBodyRightHeb}>
                <Text style={[styles.requestItemText, { fontFamily: 'Urbanist-Regular' }]}>{dateString}</Text>
                <Text style={[styles.requestItemText, { fontFamily: 'Urbanist-Regular' }]}>{props.data.amountToPay}</Text>
                <Text style={[styles.requestItemText, { fontFamily: 'Urbanist-Regular' }]}>{displayStatus()}</Text>
                <Text style={[styles.requestItemText, { fontFamily: 'Urbanist-Regular' }, props.data.requestComment == null || props.data.requestComment == '' && { display: 'none' }]}>{props.requestComment}</Text>
              </View>
              <View style={styles.requestItemBodyLeftHeb}>
                <Text style={styles.requestItemText}>תאריך: </Text>
                <Text style={styles.requestItemText}>סכום: </Text>
                <Text style={styles.requestItemText}>סטטוס: </Text>
                <Text style={[styles.requestItemText, props.requestComment == null || props.requestComment == '' && { display: 'none' }]}>הערות: </Text>
              </View>
            </View>
          </View>
          :
          <View style={styles.requestItemHeader}>
            <TouchableOpacity onPress={toggle} style={styles.request}>
              <View style={styles.requestItemLeft}>
                <Text style={styles.requestItemText}>{dateString}</Text>
              </View>
              <View style={styles.requestItemMiddleClose}>
                <Text style={styles.requestItemText}><Text style={styles.requestItemText}>{props.subject.length > 17 ? props.subject.slice(0, 15) + "..." : props.subject}</Text></Text>
              </View>
            </TouchableOpacity>
            <Menu style={{ alignItems: 'flex-end', marginVertical: 0, flexDirection: 'column' }} onSelect={value => openModal(value)} >
              <MenuTrigger
                children={<View>
                  <MaterialCommunityIcons name="dots-horizontal" size={28} color="gray" />
                </View>}
              />
              <MenuOptions customStyles={{
                optionsWrapper: styles.optionsWrapper,
              }}
              >
                <MenuOption style={{ borderRadius: 16 }} value={2} children={<View style={styles.options}><Feather name='eye' size={20} /><Text style={styles.optionsText}> View Document</Text></View>} />
                <MenuOption disableTouchable={true} style={styles.deleteTxt} value={4} children={<View style={styles.disabledoptions}><Feather name='trash-2' size={20} color='#FF3C3C' /><Text style={styles.deleteTxt}> Delete Requset</Text></View>} />
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
        }
      </View>
    </SafeAreaView >
  );
}



const styles = StyleSheet.create({
  requestItemHeader: {
    justifyContent: 'space-between',
    width: SCREEN_WIDTH * 0.9,
    height: 65,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E6EBF2',
    backgroundColor: '#FFF',
    padding: 12,
    flexDirection: 'row',
    // margin for platform
    // marginVertical: 10,
    marginTop: Platform.OS === 'ios' ? -10 : 10,
    marginBottom: Platform.OS === 'ios' ? 10 : 10,
  },
  requestItemHeaderOpen: {
    // justifyContent: 'flex-start',
    width: SCREEN_WIDTH * 0.9,
    height: 55,
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
  requestItemMiddleClose: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    flex: 7,
  },
  requestItemMiddle: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 1,
  },
  requestItemLeft: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    flex: 2.25,
    // paddingRight: 5,    
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
  disabledoptions: {
    flexDirection: 'row',
    borderBottomColor: '#80808080',
    borderBottomWidth: 0.2,
    padding: 15,
    fontFamily: 'Urbanist-Medium',
    opacity: 0.5
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
    flex: 5,
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
    marginVertical: 10,
    borderColor: '#808080',
    borderWidth: 1.5,
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
  requestItemBodyLeftHeb: {
    flex: 2,
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  requestItemBodyRightHeb: {
    flex: 7,
    alignItems: 'flex-end',
    marginTop:3
  },
})