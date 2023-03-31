import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Dimensions, Alert } from 'react-native'


export default function GenderChange(props) {

  const [userGender, setUserGender] = useState('M');
  

  const Save = () => {

    const userToUpdate={
      Id: props.userId,
      gender: userGender
    }

    console.log("userToUpdate: ", userToUpdate)
    props.Save(userGender);
  //  fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Settings/UpdateGender', {

  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json; charset=UTF-8',
  //     },
  //     body: JSON.stringify(userToUpdate),
  //   })
  //     .then(res => {
  //       if (res.ok) {
  //         return res.json()
  //       }
  //       else {
  //         console.log("not found")
  //       }
  //     })
  //     .then(data => {
  //       if (data != null) {
  //         console.log("data: ", data)
  //       }
  //     })
  //     .catch((error) => {
  //       console.log("err=", error);
  //     });
  }

      

return (
  <SafeAreaView style={styles.container}>
  <Text style={styles.header}>
    We love to know you...
  </Text>
  <Text style={styles.smallHeader}>
    It will take only 5 minutes
  </Text>

  <View>
    <Text style={styles.TitleGender}> I am a...</Text>
  </View>

  <View style={styles.GenderContainer}>
    <TouchableOpacity
      style={[styles.GenderButton, userGender === 'M' && styles.selectedGender]}
      onPress={() => setUserGender('M')}
    >
      <Image
        source={require('../../images/hero.png')}
        style={styles.imgGender}
      />
    </TouchableOpacity>
    <View style={{ margin: 20 }}></View>
    <TouchableOpacity
      style={[styles.GenderButton, userGender === 'F' && styles.selectedGender]}
      onPress={() => setUserGender('F')}
    >
      <Image
        source={require('../../images/superhero.png')}
        style={styles.imgGender}
      />
    </TouchableOpacity>
  </View>

  <View style={{ flex: 2 }}>
    <TouchableOpacity
      style={{ marginBottom: 40 }}
      onPress={() => setUserGender('O')}
    >
      <Text style={[styles.txtOther, userGender === 'O' && styles.selectedGenderTXT]}>Prefer not to say...</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.button}
      onPress={() => Save()}
    >
      <Text style={styles.buttonText}>
        Save
      </Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button2}
      onPress={props.cancel}
    >
      <Text style={styles.buttonText2}>
        Cancel
      </Text>
    </TouchableOpacity>
  </View> 
</SafeAreaView>
)
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    margin: 10,
    marginTop: 50,
    fontFamily: 'Urbanist-Bold',
  },
  smallHeader: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Urbanist-SemiBold',
  },
  TitleGender: {
    marginTop: 50,
    fontSize: 34,
    textAlign: 'center',
    fontFamily: 'Urbanist-Bold',
    color: '#548DFF',
  },
  GenderContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 50,
    flex: 2,
  },
  GenderButton: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
  },
  imgGender: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  selectedGender: {
    borderWidth: 1,
    borderColor: 'lightgray',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    backgroundColor: '#F5F5F5',
  },
  txtOther: {
    fontSize: 22,
    textAlign: 'center',
    fontFamily: 'Urbanist-SemiBold',
    color: '#626262',
  },
  button: {
    width: Dimensions.get('window').width * 0.9,
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
    height: 45,
  },
  button2: {
    width: Dimensions.get('window').width * 0.9,
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
    height: 45,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Urbanist-Bold',
  },
  buttonText2: {
    color: '#548DFF',
    fontSize: 18,
    fontFamily: 'Urbanist-Bold',
  },
  selectedGenderTXT: {
    color: '#548DFF',
    textDecorationLine: 'underline',
    fontFamily: 'Urbanist-Bold',
  }
});