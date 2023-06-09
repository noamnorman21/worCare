import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, TextInput, ScrollView } from 'react-native';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { AddBtn, NewTaskModal } from './HelpComponents/AddNewTask'
// import { TextInput } from 'react-native-paper';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
import { useUserContext } from '../UserContext';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import DropDownPicker from 'react-native-dropdown-picker';
import { Overlay } from '@rneui/themed';

// This is the Rights page - the page that the user can ask qustions about his rights and get answers from the admin
export default function Rights() {
  const { userContext } = useUserContext();
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const handleAddBtnPress = () => {
    setModalVisible(true);
  };
  const handleModalClose = () => {
    setModalVisible(false);
  };
  const [value, setValue] = useState(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'General', value: 'General' },
    { label: 'Work', value: 'Work' },
    { label: 'Family', value: 'Family' },
    { label: 'Health', value: 'Health' },
    { label: 'Other', value: 'Other' },
  ]);

  const onOpenDropdown = useCallback(() => {
    setOpen(true);
  }, []);


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

            <View style={{ flex: 1.5 }}>
              <View>

                <Text style={styles.smHeader}>Categories</Text>
                <DropDownPicker
                  placeholder={'Select a category'}
                  open={open}
                  onOpen={onOpenDropdown}
                  listMode='SCROLLVIEW'
                  value={value}
                  items={items}
                  setOpen={setOpen}
                  setValue={setValue}
                  setItems={setItems}
                  containerStyle={{ height: 40, width: SCREEN_WIDTH * 0.85, marginVertical: 10 }}
                  placeholderStyle={{ fontFamily: 'Urbanist-Light', fontSize: 16, color: '#000' }}
                  style={{ backgroundColor: '#fff', borderRadius: 16, borderWidth: 1.5, borderColor: '#E6EBF2', height: 54 }}
                  itemStyle={{
                    justifyContent: 'flex-start'
                  }}
                  dropDownContainerStyle={{ backgroundColor: '#fff', borderRadius: 16, borderWidth: 1.5, borderColor: '#E6EBF2' }}
                  // dropDownStyle={{ backgroundColor: '#fafafa' }}
                  onChangeItem={item => console.log(item.label, item.value)}
                />

                <Text style={styles.smHeader}>Question</Text>
                <TextInput
                  style={styles.inputTxt}
                  placeholder="What do you want to ask?"
                  // multiline
                  numberOfLines={4}
                  // maxLength={300}
                  placeholderTextColor={'#000'}
                  returnKeyType='done' // Customize the return key type
                />

              </View>
              <View style={[styles.btnAskContainer, open == true ? { display: 'none' } : { display: 'flex' }]}>
                <TouchableOpacity style={styles.btnAsk} onPress={
                  () => {
                    console.log('pressed');
                    toggleOverlay();
                  }
                }>
                  <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 16, color: '#fff' }}>Ask Now</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Overlay
              isVisible={visible}
              onBackdropPress={toggleOverlay}
              overlayStyle={{ width: SCREEN_WIDTH * 0.85, height: SCREEN_HEIGHT * 0.5, borderRadius: 16, padding: 20 }}
            >
              <ScrollView alwaysBounceVertical={false}>
                <Text style={[styles.smHeader, { textAlign: 'center', fontSize: 22 }]}>Answer</Text>
                <Text style={{ fontFamily: 'Urbanist-Light', fontSize: 16, marginTop: 20 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, diam sit amet aliquet tincidunt, nunc nisl ultrices nunc, quis aliquam nunc nisl nec nisl. Sed euismod, diam sit amet aliquet tincidunt, nunc nisl ultrices nunc, quis aliquam nunc nisl nec nisl.</Text>
              </ScrollView>
              <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                <TouchableOpacity style={[styles.btnAsk, { width: '100%' }]} onPress={toggleOverlay}>
                  <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 16, color: '#fff' }}>Close</Text>
                </TouchableOpacity>
              </View>
            </Overlay>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <View style={styles.addBtnView}>
        <AddBtn onPress={handleAddBtnPress} />
      </View>
      <NewTaskModal isVisible={modalVisible} onClose={handleModalClose} />
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
    right: 10,
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
    marginTop: 10,
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
    marginTop: 10,
    borderColor: '#548DFF',
    backgroundColor: '#548DFF',
    borderRadius: 16,
    borderWidth: 1.5,
    width: SCREEN_WIDTH * 0.85,
    height: 54,
  },
  btnAskContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});