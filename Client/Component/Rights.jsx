import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView, Modal, Dimensions, TextInput } from 'react-native';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AddBtn, NewTaskModal } from './HelpComponents/AddNewTask'
// import { TextInput } from 'react-native-paper';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
import { useUserContext } from '../UserContext';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import DropDownPicker from 'react-native-dropdown-picker';

// This is the Rights page - the page that the user can ask qustions about his rights and get answers from the admin
export default function Rights({ navigation }) {
  const { userContext } = useUserContext();
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddBtnPress = () => {
    setModalVisible(true);
  };
  const handleModalClose = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={['#E6EBF2', '#548DFF']}
        style={styles.background}
      />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTxt}>Rights</Text>
            </View>

            <View style={{ flex: 2 }}>
              <View>
                <Text style={styles.smHeader}>Categories</Text>
                <DropDownPicker
                  onPress={() => { console.log('pressed') }}
                  items={[
                    { label: 'General', value: 'General' },
                    { label: 'Work', value: 'Work' },
                    { label: 'Family', value: 'Family' },
                    { label: 'Health', value: 'Health' },
                    { label: 'Other', value: 'Other' },
                  ]}
                  placeholder={'Select a category'}
                  placeholderStyle={{ fontFamily: 'Urbanist-Light', fontSize: 16, color: '#000' }}
                  defaultValue={'General'}
                  containerStyle={{ height: 40, width: SCREEN_WIDTH * 0.85, marginVertical: 10 }}
                  style={{ backgroundColor: '#fff', borderRadius: 16, borderWidth: 1.5, borderColor: '#E6EBF2', height: 54 }}
                  itemStyle={{
                    justifyContent: 'flex-start'
                  }}
                  // dropDownStyle={{ backgroundColor: '#fafafa' }}
                  onChangeItem={item => console.log(item.label, item.value)}
                />

                <Text style={styles.smHeader}>Question</Text>
                {/* <TextInput
                  mode='outlined'
                  contentStyle={{ fontFamily: 'Urbanist-SemiBold', fontSize: 16, height: 'auto', maxHeight: 100 }}
                  outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
                  activeOutlineColor="#548DFF"
                  outlineColor='#E6EBF2'
                  label="What do you want to ask?"
                  style={styles.inputTxt}
                  multiline
                  numberOfLines={4}
                  maxLength={300}
                  returnKeyType='done' // Customize the return key type
                /> */}
                <TextInput
                  style={styles.inputTxt}
                  placeholder="What do you want to ask?"
                  // multiline
                  // numberOfLines={4}
                  // maxLength={300}
                  placeholderTextColor={'#000'}
                  returnKeyType='done' // Customize the return key type
                />

              </View>
              <View style={{ display: 'none' }}>
                <Text>Answer</Text>
              </View>

              <View style={styles.btnAskContainer}>
                <TouchableOpacity style={styles.btnAsk}>
                  <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 16, color: '#fff' }}>Ask Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      {/* <View style={styles.addBtnView}>
        <AddBtn onPress={handleAddBtnPress} />
      </View>
      <NewTaskModal isVisible={modalVisible} onClose={handleModalClose} /> */}
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  addBtnView: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  inputTxt: {
    fontFamily: 'Urbanist-Light',
    fontSize: 16,
    color: '#000',
    backgroundColor: '#fff',
    marginVertical: 10,
    width: SCREEN_WIDTH * 0.85,
    height: 54,
    maxHeight: 100,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E6EBF2',
    padding: 10,
    // textAlignVertical: 'top',
  },
  smHeader: {
    fontSize: 18,
    fontFamily: 'Urbanist-SemiBold',
    // marginVertical: 10,
    marginTop: 20,
  },
  headerTxt: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: SCREEN_HEIGHT * 0.125,
    fontFamily: 'Urbanist-Bold',
    color: '#fff1e6',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: SCREEN_HEIGHT * 0.25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  btnAsk: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    borderColor: '#548DFF',
    backgroundColor: '#548DFF',
    borderRadius: 16,
    borderWidth: 1.5,
    width: SCREEN_WIDTH * 0.85,
    height: 54,

  },
  btnAskContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});