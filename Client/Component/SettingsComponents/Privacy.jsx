import { View, Text, SafeAreaView, StyleSheet, Alert, TouchableOpacity, Dimensions, Modal } from 'react-native'
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FieldChange from './FieldChange';

export default function Privacy({ navigation }) {
  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [Gender, setGender] = useState(null);
  const [Phonenum, setPhonenum] = useState(null);
  const [userImg, setUserImg] = useState(null);
  const [Email, setEmail] = useState(null);
  const [userType, setUserType] = useState(null);
  const [password, setPassword] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [modalValue, setModalValue] = useState('');
  const [modal2Visible, setModal2Visible] = useState(false);

  const sendDataToNextDB = () => {
    const userToUpdate = {
      Email: Email,
      userUri: userImg,
      phoneNum: Phonenum,
      gender: Gender,
      FirstName: firstName,
      LastName: lastName,
      Password: password,
      Id: userId,
      userType: userType
    }

    console.log('userToUpdate', userToUpdate);
    const jsonValue = JSON.stringify(userToUpdate)
    AsyncStorage.setItem('userData', jsonValue);
    navigation.goBack();

    // fetch('http://proj.ruppin.ac.il/bgroup79/test1/tar1/api/Settings/UpdateUser', {
    //   method: 'PUT',
    //   headers: new Headers({
    //     'Content-Type': 'application/json; charset=UTF-8',
    //     'Accept': 'application/json; charset=UTF-8',

    //   }),
    //   body: JSON.stringify(userToUpdate)
    // })
    //   .then(res => {
    //     return res.json()
    //   }
    //   )
    //   .then(
    //     (result) => {
    //       console.log("fetch POST= ", result);
    //       Alert.alert('Image Changed', 'Your image has been changed successfully');
    //     }
    //   )
    //   .catch((error) => {
    //     console.log('Error:', error.message);
    //   }
    //   );
  }

  const openModal = (type, value) => {
    setModalType(type);
    setModalValue(value);
    setModalVisible(true);
  }

  const Update = (Field, value) => {
    setModalVisible(false);
    if (Field == "Email") {
      setEmail(value)
    }
    else if (Field == "Password") {
      setPassword(value);
    }
  }

  const cancel = () => {
    console.log('cancel');
    navigation.goBack();
  }

  useEffect(() => {
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('userData');
        const userData = jsonValue != null ? JSON.parse(jsonValue) : null;
        console.log('Privacy', userData);
        setUserId(userData.Id);
        setFirstName(userData.FirstName);
        setLastName(userData.LastName);
        setGender(userData.gender)
        setUserImg(userData.userUri)
        setPhonenum(userData.phoneNum)
        setEmail(userData.Email)
        setPassword(userData.Password)
        setUserType(userData.userType)
      } catch (e) {
        console.log('error', e);
      }
    };
    getData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Privacy</Text>
      </View>
      <View style={styles.fieldContainer}>
        <TouchableOpacity underlayColor={'lightgrey'} style={styles.fields} onPress={() => openModal("Email", Email)}>
          <Text style={styles.fieldTxt}>{Email}</Text>
        </TouchableOpacity>
        <TouchableOpacity underlayColor={'lightgrey'} style={styles.fields} onPress={() => openModal("Password", password)}>
          <Text style={styles.fieldTxt}>Edit Password</Text>
        </TouchableOpacity>
        <View style={styles.bottom}>
          <TouchableOpacity onPress={() => sendDataToNextDB()} style={styles.button}>
            <Text style={styles.buttonText}>Save to DB</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={cancel} style={styles.cancelbutton}>
            <Text style={styles.cancelbuttonText}>Cancel All Changes</Text>
          </TouchableOpacity>
        </View>
        <Modal animationType="slide" visible={modalVisible}>
          <FieldChange userId={userId} type={modalType} value={modalValue} cancel={() => setModalVisible(false)} Save={(Field, value) => Update(Field, value)} />
        </Modal>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  header: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    color: '#000',
    fontFamily: 'Urbanist-Bold'
  },
  smallTitle: {
    fontSize: 15,
    color: '#000',
  },
  fields: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderBottomWidth: 1,
    borderColor: 'lightgrey',
    padding: 10,
  },
  fieldTxt: {
    fontSize: 20,
    fontFamily: 'Urbanist-Medium',
    color: '#000',
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Dimensions.get('window').width * 0.0,
    marginTop: Dimensions.get('window').height * 0.02,
    marginBottom: Dimensions.get('window').height * 0.02,
  },
  image: {
    width: Dimensions.get('window').width * 0.3,
    height: Dimensions.get('window').height * 0.15,
    borderRadius: 100,
  },
  bottom: {
    flex: 5,
  },
  button: {
    width: Dimensions.get('window').width * 0.85,
    backgroundColor: '#548DFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'lightgray',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 1,
    margin: 7,
    height: 55,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Urbanist-Bold',
    fontSize: 16,
  },
  cancelbutton: {
    width: Dimensions.get('window').width * 0.85,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'lightgray',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 1,
    margin: 7,
    height: 55,
  },
  cancelbuttonText: {
    color: '#548DFF',
    fontFamily: 'Urbanist-Bold',
    fontSize: 16,
  },
  fieldContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})