import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, TextInput, ScrollView, Alert } from 'react-native';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Overlay } from '@rneui/themed';
import { useUserContext } from '../UserContext';
import { useIsFocused } from '@react-navigation/native';
import { AddBtn, NewTaskModal } from './HelpComponents/AddNewTask';
import { OpenAiKey } from '@env'
import { Dropdown } from 'react-native-element-dropdown';
import { Ionicons } from '@expo/vector-icons';
const apiKeyGpt = OpenAiKey;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function Rights() {
  const { userContext } = useUserContext();
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'General', value: 'General' },
    { label: 'Salary', value: 'Salary' },
    { label: 'Holiday', value: 'Family' },
    { label: 'Health', value: 'Health' },
    { label: 'Visa', value: 'Visa' },
    { label: 'Social benefits', value: 'Social benefits' },
    { label: 'Conditions', value: 'Work conditions' },
    { label: 'Safety', value: 'Work safety' },
    { label: 'Contract', value: 'Work contract' },
    { label: 'Termination', value: 'Termination' },
  ]);
  const [question, setQuestion] = useState('');
  const [gpt3Answer, setGpt3Answer] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const startGptAnswer = async () => {
    if (question === '' || value === null) {
      Alert.alert('Please fill in all fields');
      return;
    }
    toggleOverlay();
    if (question.toLowerCase().includes("who") || question.toLowerCase().includes("whom") || question.toLowerCase().includes("whose") || question.toLowerCase().includes("person's")) {
      setGpt3Answer('The question does not seem to be related to the topic of foreign workers in Israel or their rights and regulations.');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const context = `Context: In Israel, foreign workers in the field of caregiver for the elderly have specific rights and regulations. It is important to provide accurate and reliable information. Please provide an answer that is specific to Israel's laws and guidelines.`;
    const prompt = `Question: ${question}\nCategory: ${value}\nContext: ${context}\n\nAnswer:`;
    console.log(prompt);
    const apiResponse = await fetch('https://api.openai.com/v1/engines/text-davinci-003/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKeyGpt}`,
      },
      body: JSON.stringify({
        'prompt': prompt,
        'max_tokens': 450,
        'temperature': 0.3,
        'top_p': 1,
      }),
    });
    const data = await apiResponse.json();
    console.log(data);
    const answer = data.choices[0].text.trim();
    if (answer.toLowerCase() === 'no') {
      setGpt3Answer('The question does not seem to be related to the topic of foreign workers in Israel or their rights and regulations.');
    } else {
      setGpt3Answer(answer);
    }
    setIsLoading(false);
  };

  const toggleOverlay = () => {
    setVisible(!visible);
    if (visible === false) {
      setQuestion('');
      setValue(null);
    }
  };

  const handleAddBtnPress = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const onOpenDropdown = useCallback(() => {
    setOpen(true);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#E6EBF2', '#548DFF']} style={styles.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTxt}>Rights</Text>
            </View>
            <View style={{ flex: 1.5 }}>
              <View>
                <Text style={[styles.smHeader, { marginVertical: 10 }]}>Categories</Text>
                <Dropdown
                  style={styles.dropdownStyle}
                  placeholder="Select a category"
                  placeholderStyle={value == null ? styles.dropdownPlaceholder : [styles.dropdownPlaceholder]}
                  selectedTextStyle={styles.selectedTextStyle}
                  data={items}
                  itemTextStyle={styles.dropdownItem}
                  labelField="label"
                  valueField="value"
                  value={value}
                  onChange={item => { setValue(item.value); }}
                  containerStyle={styles.dropContainer}
                  renderRightIcon={() => (
                    <Ionicons name="chevron-down-outline" size={22} color="gray" style={{ marginRight: 10, marginTop: 5 }} />
                  )}
                />

                < Text style={styles.smHeader}>Question</Text>
                <TextInput
                  style={styles.inputTxt}
                  placeholder="What do you want to ask?"
                  numberOfLines={4}
                  placeholderTextColor="#000"
                  returnKeyType="done"
                  onChangeText={text => setQuestion(text)}
                  value={question}
                />
              </View>
              {!open && (
                <View style={styles.btnAskContainer}>
                  <TouchableOpacity style={styles.btnAsk} onPress={startGptAnswer}>
                    <Text style={styles.btnAskText}>Ask Now</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <Overlay
              isVisible={visible}
              onBackdropPress={toggleOverlay}
              overlayStyle={styles.overlay}
            >
              <View>
                <Text style={[styles.smHeader, styles.answerHeader]}>Answer</Text>
              </View>
              <View style={styles.answerContainer}>
                {isLoading ? (
                  <ActivityIndicator size="large" color="#548DFF" style={styles.loadIcon} />
                ) : (
                  <ScrollView alwaysBounceVertical={false} style={styles.answerScrollView}>
                    <Text style={styles.answerText}>{gpt3Answer}</Text>
                  </ScrollView>
                )}
              </View>
              <View style={styles.closeBtnContainer}>
                <TouchableOpacity style={styles.closeBtn} onPress={toggleOverlay}>
                  <Text style={styles.closeBtnText}>Close</Text>
                </TouchableOpacity>
              </View>
            </Overlay>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <View style={styles.addBtnView}>
        <AddBtn onPress={handleAddBtnPress} />
      </View>
    </SafeAreaView>
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
  loadIcon: {
    transform: [{ scale: 2 }],
    alignItems: 'center',
  },
  answerScrollView: {
    maxHeight: SCREEN_HEIGHT * 0.3,
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
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
  btnAskText: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 16,
    color: '#fff',
  },
  btnAskContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_HEIGHT * 0.5,
    borderRadius: 16,
    padding: 20,
  },
  answerHeader: {
    textAlign: 'center',
    fontSize: 22,
  },
  answerContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerText: {
    fontFamily: 'Urbanist-Light',
    fontSize: 16,
    marginTop: 15,
  },
  closeBtnContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  closeBtn: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#548DFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#548DFF',
    height: 54,
  },
  closeBtnText: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 16,
    color: '#fff',
  },
  dropdownContainer: {
    height: 40,
    width: SCREEN_WIDTH * 0.85,
    marginVertical: 10,
  },
  dropdownPlaceholder: {
    fontFamily: 'Urbanist-Light',
    fontSize: 16,
    color: '#000',
    paddingLeft: 10,
  },
  dropdownStyle: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E6EBF2',
    height: 54,
  },
  dropdownItem: {
    justifyContent: 'flex-start',
    fontFamily: 'Urbanist-Light',
    fontSize: 16,
    color: '#000',
  },
  dropContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E6EBF2',
  },
  selectedTextStyle: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 16,
    color: '#000',
    paddingLeft: 10,
  },
});