import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, TextInput, ScrollView, Alert } from 'react-native';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DropDownPicker from 'react-native-dropdown-picker';
import { Overlay } from '@rneui/themed';
import { useUserContext } from '../UserContext';
import { useIsFocused } from '@react-navigation/native';
import { AddBtn, NewTaskModal } from './HelpComponents/AddNewTask';
import { OpenAiKey } from '@env'

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

  const toggleOverlay = () => {
    setVisible(!visible);
    if (visible === false) {
      setQuestion('');
      setValue(null);
    }
  };

  // Function to send the question to GPT-3 API and get an answer
  const startGptAnswer = async () => {
    if (question === '' || value === null) {
      Alert.alert('Please fill in all fields');
    }
    toggleOverlay();
    setIsLoading(true);
    // return; 
    // Adjust the prompt to include the selected category and the question
    const context = `Context: In Israel, foreign workers in the field of caregiver for the elderly have specific rights and regulations. It is important to provide accurate and reliable information. Please provide an answer that is specific to Israel's laws and guidelines.`
    const prompt = `Category: ${value}\nQuestion: ${question}\n\n${context}\n\nAnswer:`;
    // Make the API call and handle the response
    const apiResponse = await fetch('https://api.openai.com/v1/engines/text-davinci-003/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKeyGpt}`,
      },
      body: JSON.stringify({
        'prompt': prompt,
        'max_tokens': 450, // Set this to the number of tokens you want the completion to be
        'temperature': 0.5,
        'top_p': 1,
      }),
    });
    //Process the API response and extract the answer
    const data = await apiResponse.json();
    const answer = data.choices[0].text.trim();
    console.log(answer);
    // Set the answer in the state
    setGpt3Answer(answer);
    setIsLoading(false);
    // Show the answer overlay
  };

  // const startGptAnswer = async () => {
  //   if (question === '' || value === null) {
  //     Alert.alert('Please fill in all fields');
  //     return;
  //   }
  //   toggleOverlay();
  //   setIsLoading(true);
  
  //   // First API call to check if the question is related to "foreign workers in Israel"
  //   const checkQuestionPrompt = `Question: ${question}\n\nIs this question related to the topic of foreign workers in Israel?\nAnswer:`;
  //   const checkQuestionResponse = await fetch('https://api.openai.com/v1/engines/text-davinci-003/completions', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${apiKeyGpt}`,
  //     },
  //     body: JSON.stringify({
  //       'prompt': checkQuestionPrompt,
  //       'max_tokens': 3, // Limit tokens since we're only expecting a short yes/no answer
  //       'temperature': 0.5,
  //       'top_p': 1,
  //     }),
  //   });
    
  //   // Process the checkQuestion API response
  //   const checkQuestionData = await checkQuestionResponse.json();
  //   const related = checkQuestionData.choices[0].text.trim().toLowerCase();
  //   console.log(related);
  
  //   // If the question is not related to "foreign workers in Israel", set answer to 'cant answer'
  //   if (related !== 'yes') {
  //     setGpt3Answer('cant answer');
  //     setIsLoading(false);
  //     return;
  //   }
    
  //   // If the question is related, proceed with the second API call
  //   const context = `Context: In Israel, foreign workers in the field of caregiver for the elderly have specific rights and regulations. It is important to provide accurate and reliable information. Please provide an answer that is specific to Israel's laws and guidelines.`
  //   const detailedPrompt = `Category: ${value}\nQuestion: ${question}\n\n${context}\n\nAnswer:`;
  
  //   const detailedResponse = await fetch('https://api.openai.com/v1/engines/text-davinci-003/completions', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${apiKeyGpt}`,
  //     },
  //     body: JSON.stringify({
  //       'prompt': detailedPrompt,
  //       'max_tokens': 450,
  //       'temperature': 0.5,
  //       'top_p': 1,
  //     }),
  //   });
  
  //   const detailedData = await detailedResponse.json();
  //   const detailedAnswer = detailedData.choices[0].text.trim();
  //   console.log(detailedAnswer);
  //   setGpt3Answer(detailedAnswer);
  //   setIsLoading(false);
  // };
  

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
      <LinearGradient
        colors={['#E6EBF2', '#548DFF']}
        style={styles.background}
      />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTxt}>Rights</Text>
            </View>

            <View style={{ flex: 1.5 }}>
              <View>
                <Text style={styles.smHeader}>Categories</Text>
                <DropDownPicker
                  placeholder="Select a category"
                  open={open}
                  onOpen={onOpenDropdown}
                  listMode="SCROLLVIEW"
                  value={value}
                  items={items}
                  setOpen={setOpen}
                  setValue={setValue}
                  setItems={setItems}
                  containerStyle={{ height: 40, width: SCREEN_WIDTH * 0.85, marginVertical: 10 }}
                  placeholderStyle={{ fontFamily: 'Urbanist-Light', fontSize: 16, color: '#000' }}
                  style={{ backgroundColor: '#fff', borderRadius: 16, borderWidth: 1.5, borderColor: '#E6EBF2', height: 54 }}
                  itemStyle={{ justifyContent: 'flex-start' }}
                  dropDownContainerStyle={{ backgroundColor: '#fff', borderRadius: 16, borderWidth: 1.5, borderColor: '#E6EBF2' }}
                  onChangeItem={item => console.log(item.label, item.value)}
                />

                <Text style={styles.smHeader}>Question</Text>
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

              <View style={[styles.btnAskContainer, open === true ? { display: 'none' } : { display: 'flex' }]}>
                <TouchableOpacity style={styles.btnAsk} onPress={startGptAnswer}>
                  <Text style={{ fontFamily: 'Urbanist-Bold', fontSize: 16, color: '#fff' }}>Ask Now</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Overlay
              isVisible={visible}
              onBackdropPress={toggleOverlay}
              overlayStyle={{ width: SCREEN_WIDTH * 0.85, height: SCREEN_HEIGHT * 0.5, borderRadius: 16, padding: 20 }}
            >
              <View>
                <Text style={[styles.smHeader, { textAlign: 'center', fontSize: 22 }]}>Answer</Text>
              </View>
              <View>
                {
                  isLoading ? (
                    <View style={{ height: SCREEN_HEIGHT * 0.3, justifyContent: 'center', alignItems: 'center' }}>
                      <ActivityIndicator size="large" color="#548DFF" style={styles.loadIcon} />
                    </View>
                  ) : (
                    <ScrollView alwaysBounceVertical={false} style={styles.answerScrollView}>
                      <Text style={{ fontFamily: 'Urbanist-Light', fontSize: 16, marginTop: 15 }}>{gpt3Answer}</Text>
                    </ScrollView>
                  )
                }
              </View>
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

      <NewTaskModal isVisible={modalVisible} onClose={handleModalClose} cancel={handleModalClose} />
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
    //scale transform: [{ scaleX: 1.5 }, 
    transform: [{ scale: 2 }],
    alignItems: 'center',
  },

  answerScrollView: {
    maxHeight: SCREEN_HEIGHT * 0.3,  // Adjust this value based on your requirements.
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
  btnAskContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
