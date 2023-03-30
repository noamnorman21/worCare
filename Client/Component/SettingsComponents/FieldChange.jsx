import React from 'react';
import { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { TextInput } from 'react-native-paper';


export default function FieldChange(props) {

  const [type, setType] = React.useState();
  const [value, setValue] = React.useState(props.value);
  const [userId, setUserId] = React.useState(props.userId);

  useEffect (() => {
    setType(props.type);
    setUserId(props.userId);
  }, [])


  const save = () => {
    props.Save(type,value);
  }



  return (
    <View style={styles.container}>
      <Text>Change {type}</Text>
      <TextInput
      value={value}
      onChangeText={text => setValue(text)}     
      />
      <TouchableOpacity onPress={save} style={styles.button}>
        <Text>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={props.cancel} style={styles.button}>
        <Text>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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
    height: 45,
  },
});

