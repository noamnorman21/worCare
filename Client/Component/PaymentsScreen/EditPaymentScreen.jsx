import { useIsFocused } from "@react-navigation/native";
import { View,Text, StyleSheet, Alert, SafeAreaView, animation, TouchableOpacity, Dimensions, Keyboard, LayoutAnimation} from "react-native";
import { useEffect } from "react";
import { useState } from "react";
import { TextInput } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";

export default function EditPaymentScreen({ navigation,route}) {

  
  const [animation, setAnimation] = useState({});

  const isFocused= useIsFocused()
  const [Payment, setPayment] = useState({
    amountToPay:route.params.id,
    requestId:route.params.data.requestId,
    requestSubject:route.params.data.requestSubject,
    requestDate :route.params.data.requestDate,
    requestProofDocument : route.params.data.requestProofDocument,
    requestComment : route.params.data.requestComment,
    requestStatus:route.params.data.requestStatus,  
  })

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        LayoutAnimation.configureNext({
          update: {
            type: LayoutAnimation.Types.easeIn,
            duration: 300,
            useNativeDriver: true,
          },
        });
        setAnimation({ marginBottom: Dimensions.get('window').height * 0.425 });
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        LayoutAnimation.configureNext({
          update: {
            type: LayoutAnimation.Types.easeOut,
            duration: 300,
            useNativeDriver: true,
          },
        });
        setAnimation({ marginBottom: 0 });
      }
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    }

  }, []);




  

const handleInputChange = (name, value) => {
    setPayment({ ...Payment, [name]: value })
    console.log(Payment)
  }
  const Cancel = () => {
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
          onPress: () => navigation.goBack()
        },
      ]
    );
  }

  const Delete = () => {
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
          onPress: () => {let res= fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Payments/DeletePayment/' + Payment.requestId, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          console.log(res)
          navigation.goBack()
          }
        },
      ]
    );
  }
  
  return (
    
    <ScrollView>
     <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>request number {Payment.requestId}</Text>
      </View>
      <View style={[styles.inputContainer, animation]}>
        <Text style={styles.contactheader}>Subject:</Text>
        <TextInput
          style={styles.input}
          value={Payment.requestSubject}
          keyboardType='ascii-capable'
          onChangeText={(value) => handleInputChange('requestSubject', value)}
        />
        <View style={styles.numbersInput}>
          <View>
            <Text style={styles.contactheader}>Amount:</Text>
            <TextInput
              style={[styles.input, styles.numInput]}
              value={Payment.amountToPay}
              keyboardType='decimal-pad'
              onChangeText={(value) => handleInputChange('amountToPay', value)}
              inputMode='decimal'
            />
          </View>
          <View>
            <Text style={styles.contactheader}>Date:</Text>
            <TextInput
              style={[styles.input, styles.numInput]}
              value={Payment.requestDate}
              keyboardType='ascii-capable'
              onChangeText={(value) => handleInputChange('requestDate', value)}
            />
          </View>
        </View>
        <Text style={styles.contactheader}>Role:</Text>
        <TextInput
          style={styles.input}        
          keyboardType='ascii-capable'
          onChangeText={(value) => handleInputChange('requestStatus', value)}
          value={Payment.requestStatus}
        />
        <Text style={styles.contactheader}>Email:</Text>
        <TextInput
          style={styles.input} 
          value={Payment.requestProofDocument}      
          keyboardType='ascii-capable'
          onChangeText={(value) => handleInputChange('requestProofDocument', value)}
        />
        <Text style={styles.contactheader}>Comment:</Text>
        <TextInput
          style={styles.input}         
          keyboardType='ascii-capable'
          value={Payment.requestComment}
          onChangeText={(value) => handleInputChange('requestComment', value)}
        />
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity style={styles.savebutton} onPress={()=>{}}>
          <Text style={styles.savebuttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelbutton} onPress={Cancel}>
          <Text style={styles.cancelbuttonText}>Cancel</Text>
        </TouchableOpacity>        
      </View>
      <TouchableOpacity style={styles.Deletebutton} onPress={Delete}>
          <Text style={styles.cancelbuttonText}>Delete</Text>
        </TouchableOpacity>
    </SafeAreaView>
    </ScrollView>
 
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5', 
     
  },
  inputContainer: { 
    flex: 4,
    textAlign: 'left',
    flexDirection: 'column',
  },
  input: {
    width: Dimensions.get('window').width * 0.95,
    padding: 10,
    margin: 7,
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: 'white',
    borderColor: 'lightgray',
    shadowColor: '#000',
    height: 45,
    fontFamily: 'Urbanist',
    overflow: 'hidden',
  },
  numInput: {
    width: Dimensions.get('window').width * 0.455,
  },
  savebutton: {
    width: Dimensions.get('window').width * 0.4,
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
  cancelbutton: {
    width: Dimensions.get('window').width * 0.4,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#548DFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 1,
    margin: 7,
    height: 45,
  },
  Deletebutton: {
    width: Dimensions.get('window').width * 0.85,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#548DFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 1,
    margin: 7,
    height: 45,

  },
  bottom: {
    flexDirection: 'row',
    margin: 0,
  },
  savebuttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelbuttonText: {
    color: '#548DFF',
    fontWeight: '600',
    fontSize: 16,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Urbanist-Bold',
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactheader: {
    fontFamily: 'Urbanist-Bold',
    marginLeft: 7,
    textAlign: 'left',
  },
  numbersInput: {
    flexDirection: 'row',
  },

});
