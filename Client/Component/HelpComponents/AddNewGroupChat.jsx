import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Dimensions, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;


export default function AddNewGroupChat(props) {

  const [addNewModalGroup, setAddNewModalGroup] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [selectedUsers, setSelectedUsers] = useState([])
  const [groupList, setGroupList] = useState([])
  const [groupListForSearch, setGroupListForSearch] = useState([])
  const [searchText, setSearchText] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [searchResultForSearch, setSearchResultForSearch] = useState([])
  const [searchResultModal, setSearchResultModal] = useState(false)
  const [searchResultModalForSearch, setSearchResultModalForSearch] = useState(false)
  const [searchResultModalForAdd, setSearchResultModalForAdd] = useState(false)
  const [searchResultModalForAddForSearch, setSearchResultModalForAddForSearch] = useState(false)
  const [searchResultModalForAddForSearchForAdd, setSearchResultModalForAddForSearchForAdd] = useState(false)
  const [searchResultModalForAddForSearchForAddForSearch, setSearchResultModalForAddForSearchForAddForSearch] = useState(false)
  const [searchResultModalForAddForSearchForAddForSearchForAdd, setSearchResultModalForAddForSearchForAddForSearchForAdd] = useState(false)

  const addNewGroup = () => {
    console.log("add new group")
    let name = groupName;
    addDoc(collection(db, auth.currentUser.email), { Name: name });
    addDoc(collection(db, "allPublicGroups"), { Name: name });
    selectedUsers.forEach((user) => {
      console.log(user)
      addDoc(collection(db, user), { Name: name });
    });
   props.closeModal()
   props.navigate(name)
  }

  const isItemSelected = (id) => {
    console.log(selectedUsers.includes(id))
    return selectedUsers.includes(id);
  };


  const handleItemPress = (item) => {
    if (selectedUsers.includes(item.id)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== item.id));
    } else {
      setSelectedUsers([...selectedUsers, item.id]);
    }
  };



  return (
    <>
      <View style={styles.modal}>
        <Text style={styles.modalText}>Add new group</Text>
        <TextInput style={styles.inputTxt}
          mode='outlined'
          label='Group Name'
          value={groupName}
          onChangeText={(val) => setGroupName(val)}
          placeholder="Type Something..."
          maxLength={30}
          contentStyle={{ fontFamily: 'Urbanist-Regular' }}
          outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
          activeOutlineColor="#548DFF"
          outlineColor='#E6EBF2' />
        <Text style={styles.modalText}>Add members</Text>
        <ScrollView style={{marginBottom:10}}>
            {props.users.map((user, index) => {
              console.log("Item", user)
              console.log(index)
              const selectedStyle = isItemSelected(user.id) ? styles.selectedItem : {};
              return (
                <View key={user.name} >
                  <TouchableOpacity style={[styles.userCard, selectedStyle]} onPress={() => handleItemPress(user)}>
                    <Image source={{ uri: user.avatar }} style={{ width: 65, height: 65, borderRadius: 54 }} />
                    <Text style={styles.userName}>{user.id}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
        </ScrollView>
        <View  style={styles.bottom}>
          <TouchableOpacity style={styles.savebutton} onPress={() => addNewGroup()}>
            <Text style={styles.savebuttonText}>Create</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelbutton} onPress={() => { props.closeModal(); console.log("pressed close") }}>
            <Text style={styles.cancelbuttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}






const styles = StyleSheet.create({
  modal: {
    marginTop: ScreenHeight * 0.05,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold"
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  inputTxt: {
    fontFamily: 'Urbanist-Light',
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
    marginVertical: 10,
    width: SCREEN_WIDTH * 0.95,
  },
  headerContainer: {
    backgroundColor: '#fff',
  },
  headerSmallTxt: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  line: {
    borderBottomColor: '#808080',
    borderBottomWidth: 0.5,
    marginVertical: 10,
  },
  bodyContainer: {
    // height: 300,
    // backgroundColor: 'red',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  itemBox: {
    width: SCREEN_WIDTH * 0.45,
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E6EBF2',
    marginVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedItem: {
    borderColor: "#548DFF",
    borderWidth: 2,
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Urbanist-SemiBold',
    marginBottom: 5,
    color: '#000',
    marginLeft: 10,
  },
  userCard: {
    width: SCREEN_WIDTH * 0.95,
    height: ScreenHeight * 0.13,
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderColor: '#E6EBF2',
    borderWidth: 2,
  },
  savebutton: {
    backgroundColor: '#548DFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    height: 54,
    width: SCREEN_WIDTH * 0.45,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 1,
  },
  cancelbutton: {
    backgroundColor: '#F5F8FF',
    borderRadius: 16,
    height: 54,
    width: SCREEN_WIDTH * 0.45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#548DFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 1,
  },
  savebuttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Urbanist-SemiBold',
  },
  cancelbuttonText: {
    color: '#548DFF',
    textAlign: 'center',
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH * 0.95,
  },
})
