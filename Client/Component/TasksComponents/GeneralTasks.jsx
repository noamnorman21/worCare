import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { AddBtn, NewTaskModal } from '../HelpComponents/AddNewTask'

export default function GeneralTasks() {
  const [modalVisible, setModalVisible] = useState(false)
  const handleAddBtnPress = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };
  return (
    <View style={styles.container}>
      <Text>General Tasks</Text>
      <View style={styles.addBtnView}>
        <AddBtn onPress={handleAddBtnPress} />
      </View>
      <NewTaskModal isVisible={modalVisible} onClose={handleModalClose} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnView: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});