
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
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers
} from "react-native-popup-menu";

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Paychecks({ navigation, route }) {
  const { userContext } = useUserContext();

  const [History, setHistory] = useState()
  const [arr, setArr] = useState()
  const isFocused = useIsFocused()
  const [modal1Visible, setModal1Visible] = useState(false);

  // const Edit = (id, data) => {
  //   Alert.alert(
  //     "Edit",
  //     "Are you sure you want to Edit this request?",
  //     [
  //       {
  //         text: "Cancel",
  //         onPress: () => console.log("Cancel Pressed"),
  //         style: "cancel"
  //       },
  //       { text: "OK", onPress: () => navigation.navigate('EditPaymentScreen', {id:id, data:data}) }
  //     ],
  //     { cancelable: false }
  //   );
  // }



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
      console.log(data)
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
        <Text style={styles.header} >History</Text>
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
  const [expanded, setExpanded] = React.useState(false);
  const animationController = useRef(new Animated.Value(0)).current;
  const [modal1Visible, setModal1Visible] = useState(false);
  const [temp, settemp] = useState({
    paycheckDate: props.data.paycheckDate,
    paycheckSummary: props.data.paycheckSummary,
    paycheckComment: props.data.paycheckComment,
    payCheckNum: props.data.payCheckNum,
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
    console.log(temp)
    if (value == 1) {
      console.log("Notofication")
    }
    else if (value == 2) {
      setModal1Visible(true)
    }
    else if (value == 3) {
      setModal2Visible(true)
    }
    else if (value == 4) {
      
      DeletePaychek(props.data.paycheckNum)
    }
  }

  const DeletePaychek = async () => {
    console.log("Delete Paycheck: " + temp.payCheckNum);
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
          <View style={newStyles.requestOpen}>
            <View style={newStyles.requestItemHeaderOpen}>
              <TouchableOpacity onPress={toggle} style={newStyles.request}>
                <View style={newStyles.requestItemLeft}>
                  <Text style={newStyles.requestItemText}>{dateString}</Text>
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
                 <MenuOption style={{ borderRadius: 16 }} value={1} children={<View style={newStyles.options}><MaterialCommunityIcons name='bell-ring-outline' size={20} /><Text style={newStyles.optionsText}> Send Notification</Text></View>} />
                  <MenuOption style={{ borderRadius: 16 }} value={2} children={<View style={newStyles.options}><Feather name='eye' size={20} /><Text style={newStyles.optionsText}> View Document</Text></View>} />
                  <MenuOption style={{ borderRadius: 16 }} value={3} children={<View style={newStyles.options}><Feather name='edit' size={20} /><Text style={newStyles.optionsText}> Edit Paycheck</Text></View>} />
                  <MenuOption style={newStyles.deleteTxt} value={4} children={<View style={newStyles.options}><Feather name='trash-2' size={20} color='#FF3C3C' /><Text style={newStyles.deleteTxt}> Delete Paycheck</Text></View>} />
                </MenuOptions>
              </Menu>
              <Modal animationType='slide' transparent={true} visible={modal1Visible} onRequestClose={() => setModal1Visible(false)}>
                <View style={newStyles.documentview}>
                  <Image source={{ uri: props.data.requestProofDocument }} style={styles.documentImg} />
                  <Text>{props.data.requestProofDocument}</Text>
                  <TouchableOpacity style={newStyles.documentDownloadButton} onPress={downloadFile} >
                    <Text style={newStyles.documentButtonText}>Download</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={newStyles.documentCancelButton} onPress={() => setModal1Visible(false)}>
                    <Text style={newStyles.documentCancelText}>Go Back</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
              <Modal animationType='slide' transparent={true} visible={modal2Visible}>
                <EditPaycheck cancel={(value) => { setModal2Visible(false); setExpanded(true); props.getPaychecks() }} save={(value) => { setModal2Visible(false); setExpanded(false); props.getPaychecks(); settemp(value) }} data={props.data} />
              </Modal>
            </View>
            <View style={newStyles.requestItemBody}>
              <View style={newStyles.requestItemBodyLeft}>
                <Text style={newStyles.requestItemText}>Date: </Text>
                <Text style={newStyles.requestItemText}>Amount: </Text>
                <Text style={[newStyles.requestItemText, temp.paycheckComment == null || temp.paycheckComment == '' && { display: 'none' }]}>Comment: </Text>

              </View>
              <View style={newStyles.requestItemBodyRight}>
                <Text style={newStyles.requestItemText}>{dateString}</Text>
                <Text style={newStyles.requestItemText}>{temp.paycheckSummary}</Text>
                <Text style={[newStyles.requestItemText, temp.paycheckComment == null || temp.paycheckComment == "" && { display: 'none' }]}>{temp.paycheckComment}</Text>

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
                  <MenuOption style={{ borderRadius: 16 }} value={1} children={<View style={newStyles.options}><MaterialCommunityIcons name='bell-ring-outline' size={20} /><Text style={newStyles.optionsText}> Send Notification</Text></View>} />
                  <MenuOption style={{ borderRadius: 16 }} value={2} children={<View style={newStyles.options}><Feather name='eye' size={20} /><Text style={newStyles.optionsText}> View Document</Text></View>} />
                  <MenuOption style={{ borderRadius: 16 }} value={3} children={<View style={newStyles.options}><Feather name='edit' size={20} /><Text style={newStyles.optionsText}> Edit Paycheck</Text></View>} />
                  <MenuOption style={newStyles.deleteTxt} value={4} children={<View style={newStyles.options}><Feather name='trash-2' size={20} color='#FF3C3C' /><Text style={newStyles.deleteTxt}> Delete Paycheck</Text></View>} />
                </MenuOptions>
              </Menu>
              <Modal animationType='slide' transparent={true} visible={modal1Visible} onRequestClose={() => setModal1Visible(false)}>
                <View style={newStyles.documentview}>
                  <Image source={{ uri: props.data.requestProofDocument }} style={styles.documentImg} />
                  <Text>{props.data.requestProofDocument}</Text>
                  <TouchableOpacity style={newStyles.documentDownloadButton} onPress={downloadFile} >
                    <Text style={newStyles.documentButtonText}>Download</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={newStyles.documentCancelButton} onPress={() => setModal1Visible(false)}>
                    <Text style={newStyles.documentCancelText}>Go Back</Text>
                  </TouchableOpacity>
                </View>
              </Modal>
              <Modal animationType='slide' transparent={true} visible={modal2Visible}>
                <EditPaycheck cancel={(value) => { setModal2Visible(false); setExpanded(true); props.getPaychecks() }} save={(value) => { setModal2Visible(false); setExpanded(false); props.getPaychecks(); settemp(value) }} data={props.data} />
              </Modal>
            </View>
          </View>
        }
      </View>
    </SafeAreaView >
  );

  // return (
  //   <List.Accordion style={!expanded ? styles.request : styles.requestunFocused}
  //   theme={{ colors: { background: 'white' } }}
  //   right={() => <View ></View>}
  //   left={() => <View >
  //     <Text style={styles.requestHeaderText}>{temp.paycheckDate.substring(0,7).replace("-","/")}</Text>
  //   </View>}
  //   expanded={!expanded}
  //   onPress={toggle}
  // >
  //   <View style={styles.Focused}>
  //     <View>
  //     <List.Item title={() => <Text style={styles.itemsText}>Date: {temp.paycheckDate.substring(0, 10).replace(/-/g,"/" )} </Text>} />
  //     <List.Item title={() => <Text style={styles.itemsText}>Summary: {temp.paycheckSummary.substring(0, 100)}</Text>} />
  //     <List.Item title={() => <Text style={styles.itemsText}>Comment: {temp.paycheckComment} </Text>} />
  //     <List.Item title={() =>
  //       <View style={styles.bottom}>
  //         <TouchableOpacity style={[styles.itemsText, styles.viewButton]} onPress={!expanded ? () =>{setModal1Visible(true)}:null}>
  //           <Text style={styles.viewbuttonText}>View Document</Text>
  //         </TouchableOpacity>
  //         <Modal animationType='slide' transparent={true} visible={modal1Visible}>
  //           <EditPaycheck cancel={(value) => {setModal1Visible(false); setExpanded(true); props.getPaychecks()}} save={(value) => {setModal1Visible(false); setExpanded(true); props.getPaychecks(); settemp(value)}} data={props.data} />
  //         </Modal>
  //         <TouchableOpacity style={[styles.itemsText, styles.editButton]} onPress={!expanded ? () =>{setModal1Visible(true)} : null}>
  //           <Text style={styles.editbuttonText}>Edit</Text>
  //         </TouchableOpacity>
  //       </View>} />
  //       </View>
  //   </View>
  // </List.Accordion>
  // )
}

const newStyles = StyleSheet.create({
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
    padding: 5,
    fontFamily: 'Urbanist-Regular',
  },
  optionsText: {
    fontFamily: 'Urbanist-Regular',
  },
  optionsWrapper: {
    position: 'absolute',
    bottom: -65,
    backgroundColor: '#fff',
    borderRadius: 10,
    left: 65,
    elevation: 100,
  },
  optionsWrapperOpened: {
    position: 'absolute',
    bottom: -60,
    backgroundColor: '#fff',
    borderRadius: 10,
    left: 65,
    elevation: 100,
  },
  deleteTxt: {
    color: '#FF3C3C',
    fontFamily: 'Urbanist-Regular',
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

const styles = StyleSheet.create({
  pending: {
    backgroundColor: 'white',
    flexGrow: 1,
    paddingTop: 10,
    alignItems: 'center',
  },
  requestunFocused: {
    justifyContent: 'center',
    width: Dimensions.get('screen').width * 0.9,
    height: Dimensions.get('screen').height * 0.073,
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
  request: {
    paddingLeft: 12,
    width: Dimensions.get('screen').width * 0.9,
    height: Dimensions.get('screen').height * 0.073,
    borderLeftColor: '#7DA9FF',
    borderLeftWidth: 2,
    borderTopLeftRadius: 16,
    borderTopColor: '#7DA9FF',
    borderTopWidth: 2,
    borderRightColor: '#7DA9FF',
    borderRightWidth: 2,
    borderTopRightRadius: 16,
    borderBottomColor: '#9E9E9E',
    borderBottomWidth: 1,
    borderBottomMargin: 10,

  },
  requestHeaderText: {
    fontSize: 17,
    fontFamily: 'Urbanist-Bold'
  },
  Focused: {
    borderLeftColor: '#7DA9FF',
    borderLeftWidth: 2,
    borderBottomColor: '#7DA9FF',
    borderBottomWidth: 2,
    borderRightColor: '#7DA9FF',
    borderRightWidth: 2,
    borderBottomColor: '#7DA9FF',
    borderBottomEndRadius: 16,
    borderBottomStartRadius: 16,
    marginBottom: 10,
    padding: 16,
  },
  addBtnView: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  itemsText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: Dimensions.get('screen').width * -0.16,
    marginRight: Dimensions.get('screen').width * 0.02,
    fontFamily: 'Urbanist-Regular',
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
  addRequest: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#548DFF',
    height: 54,
    width: 54,
    borderRadius: 54,
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 10,
    right: Platform.OS === 'ios' ? 15 : 10,
    elevation: 5,
  },
  addRequestText: {
    color: 'white',
    fontSize: 26,
    marginBottom: 2,
    fontFamily: 'Urbanist-SemiBold',
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
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
