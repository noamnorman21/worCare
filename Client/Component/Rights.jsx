import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView, Modal, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AddBtn, NewTaskModal } from './HelpComponents/AddNewTask'

export default function Rights({ navigation }) {
  const [userData, setUserData] = useState(''); // [1]
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('userData')
        if (jsonValue != null) {
          const json = JSON.parse(jsonValue);
          setUserData(json);
        }
      }
      catch (e) {
        console.log(e);
      }
    };
    getData();
  }, []);
  const handleAddBtnPress = () => {
    setModalVisible(true);
  };
  const handleModalClose = () => {
    setModalVisible(false);
  };

  const [grid, setGrid] = useState([['', '', ''], ['', '', ''], ['', '', '']]);
  const [player, setPlayer] = useState('X');
  const onPress = (row, col) => {
    if (grid[row][col] !== '') {
      return;
    }

    const newGrid = [...grid];
    newGrid[row][col] = player;
    setGrid(newGrid);

    if (isGameOver()) {
      Alert.alert('Game Over', `Player ${player} has won!`, [
        {
          text: 'Restart',
          onPress: () => setGrid([['', '', ''], ['', '', ''], ['', '', '']]),
        },
      ]);
      return;
    }
    setPlayer(player === 'X' ? 'O' : 'X');
  };
  const isGameOver = () => {
  };
  const renderCell = (row, col) => {
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ fontSize: 21, textAlign: 'center', marginBottom: 10, color: 'red' }}> ברוכים הבאים למשחק של נועםםםםם</Text>
      <Text style={{ fontSize: 21, textAlign: 'center', marginBottom: 10, color: 'red' }}> {userData.userType}</Text>
      <View style={styles.row}>
        {renderCell(0, 0)}
        {renderCell(0, 1)}
        {renderCell(0, 2)}
      </View>
      <View style={styles.row}>
        {renderCell(1, 0)}
        {renderCell(1, 1)}
        {renderCell(1, 2)}
      </View>
      <View style={styles.row}>
        {renderCell(2, 0)}
        {renderCell(2, 1)}
        {renderCell(2, 2)}
      </View>
      <View style={styles.addBtnView}>
        <AddBtn onPress={handleAddBtnPress} />
      </View>
      <NewTaskModal isVisible={modalVisible} onClose={handleModalClose} />
      <View>
        <TouchableOpacity
          onPress={() => {
            AsyncStorage.removeItem("user");
            AsyncStorage.removeItem("userData");
            Alert.alert('Log Out', 'You have been logged out', [
              {
                text: 'OK',
                onPress: () => {
                  navigation.navigate('LogIn')
                }
              },
            ]);
          }}
        >
          <Text>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  addBtnView: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 100,
    height: 100,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 48,
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#333',
    color: '#fff',
  },
  buttonText: {
    color: '#fff',
  },
});