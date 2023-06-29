import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal, Dimensions, SafeAreaView,Keyboard } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
import LimitationsData from '../SignUpComponents/User/Limitations.json';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function NewPatientLvl2({ navigation, route }) {
  const [modal1Visible, setModal1Visible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);
  const [modal3Visible, setModal3Visible] = useState(false);
  const [modal4Visible, setModal4Visible] = useState(false);

  const [comments, setComments] = useState('');
  const [allergies, setAllergies] = useState(LimitationsData.allergies);
  const [allergiesOther, setAllergiesOther] = useState('');
  const [sensitivities, setSensitivities] = useState(LimitationsData.sensitivities);
  const [sensitivitiesOther, setSensitivitiesOther] = useState('');
  const [physicalAbilities, setPhysicalAbilities] = useState(LimitationsData.physicalAbilities);
  const [physicalAbilitiesOther, setPhysicalAbilitiesOther] = useState('');
  const [bathRoutine, setBathRoutine] = useState(LimitationsData.bathRoutine);
  const [bathRoutineOther, setBathRoutineOther] = useState('');
  const [noiseSensitiveData, setNoiseSensitiveData] = useState([
    { label: 'Yes', value: 1 },
    { label: 'No', value: 2 },
  ]);
  const [noiseSensitive, setNoiseSensitive] = useState('');

  const NavigateToNextLVL = () => {
    const activeAllergies = allergies.filter((allergy) => allergy.selected).map((allergy) => allergy.name);
    const activeSensitivities = sensitivities.filter((sensitivity) => sensitivity.selected).map((sensitivity) => sensitivity.name);
    const activePhysicalAbilities = physicalAbilities.filter((physicalAbility) => physicalAbility.selected).map((physicalAbility) => physicalAbility.name);
    const activeBathRoutine = bathRoutine.filter((bath) => bath.selected).map((bath) => bath.name);
    if (allergiesOther !== '') {
      activeAllergies.push(allergiesOther);
    }
    if (sensitivitiesOther !== '') {
      activeSensitivities.push(sensitivitiesOther);
    }
    if (physicalAbilitiesOther !== '') {
      activePhysicalAbilities.push(physicalAbilitiesOther);
    }
    if (bathRoutineOther !== '') {
      activeBathRoutine.push(bathRoutineOther);
    }
    // turns each array into a string with commas between each item without the last comma    
    const allergiesString = activeAllergies.join(', ');
    const sensitivitiesString = activeSensitivities.join(', ');
    const physicalAbilitiesString = activePhysicalAbilities.join(', ');
    const bathRoutineString = activeBathRoutine.join(', ');
    
    // creates a table with the data
    const tblLimitations = {
      allergies: allergiesString,
      sensitivities: sensitivitiesString,
      physicalAbilities: physicalAbilitiesString,
      bathRoutine: bathRoutineString,
      sensitivityToNoise: noiseSensitive,
      otherL: comments,
    };    
    navigation.navigate('NewPatientLvl3', { tblLimitations: tblLimitations, tblPatient : route.params.patientData, tblUser : route.params.tblUser }); // Navigate to next lvl
  };
  changebathRoutine = (value) => {
    if (value === 'All') { // if the user clicked on the "All" button
      // change the state of all the checkboxes with inverse value
      if (bathRoutine.filter((item) => item.selected === true).length === bathRoutine.length - 1) {
        bathRoutine[bathRoutine.length - 1].selected = true;        
      }
      // if all the checkboxes are checked, uncheck all of them
      if (bathRoutine.filter((item) => item.selected === true).length === bathRoutine.length) {
        setBathRoutine(
          bathRoutine.map((item) => {
            return { ...item, selected: false };
          })
        );
        return;
      }
      // if not all the checkboxes are checked, check all of them
      setBathRoutine(
        bathRoutine.map((item) => {
          return { ...item, selected: true };
        })
      );
    }
    else { // if the user clicked on a checkbox (not the "All" button)
      setBathRoutine(
        bathRoutine.map((item) => {
          if (item.name === value) {
            return { ...item, selected: !item.selected };
          }
          return item;
        })
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Add Patient limitation's</Text>
        <View style={styles.line} />
      </View>

      {/* Allergies */}
      <TouchableOpacity
        style={styles.inputBox}
        onPress={() => setModal1Visible(true)}>
        <Text style={styles.input}>Allergies</Text>
        <Entypo style={styles.icon} name="chevron-right" size={24} color="black" />
      </TouchableOpacity>

      {/* Allergies Modal */}
      <Modal animationType="slide" visible={modal1Visible}>
        <View style={styles.modal}>
          <Text style={styles.modalText}>Pick Allergies</Text>
          <View style={styles.allergiesContainer}>
            {allergies.map((allergy) => (
              <TouchableOpacity
                key={allergy.id}
                style={[styles.allergy, allergy.selected && { borderColor: '#548DFF' }]}
                onPress={() => {
                  const newAllergies = allergies.map((item) => {
                    if (item.id === allergy.id) {
                      return { ...item, selected: !item.selected };
                    }
                    return item;
                  });
                  setAllergies(newAllergies);
                }}>
                <Text style={styles.allergyText}>{allergy.name}</Text>
              </TouchableOpacity>
            ))}
            <TextInput
              style={styles.inputOther}
              placeholder="Other..."
              placeholderTextColor={'#000'}
              value={allergiesOther}
              onChangeText={(text) => setAllergiesOther(text)}
            />
          </View>

          <View style={styles.btnModalContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                setModal1Visible(false)
              }}
            >
              <Text style={styles.saveBtnTxt}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModal1Visible(false)}
            >
              <Text style={styles.cancelBtnTxt}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Sensitivities */}
      <TouchableOpacity
        style={styles.inputBox}
        onPress={() => setModal2Visible(true)}>
        <Text style={styles.input}>Sensitivities</Text>
        <Entypo style={styles.icon} name="chevron-right" size={24} color="black" />
      </TouchableOpacity>

      {/* Sensitivities Modal */}
      <Modal animationType="slide" visible={modal2Visible}>
        <View style={styles.modal}>
          <Text style={styles.modalText}>Pick Sensitivities</Text>
          <View style={styles.sensitivityContainer}>
            {sensitivities.map((sensitivity) => (
              <TouchableOpacity
                key={sensitivity.id}
                style={[styles.sensitivity, sensitivity.selected && { borderColor: '#548DFF' }]}
                onPress={() => {
                  const newSensitivities = sensitivities.map((item) => {
                    if (item.id === sensitivity.id) {
                      return { ...item, selected: !item.selected };
                    }
                    return item;
                  });
                  setSensitivities(newSensitivities);
                }}>
                <Text style={styles.allergyText}>{sensitivity.name}</Text>
              </TouchableOpacity>
            ))}
            <TextInput
              style={styles.inputOther}
              placeholder="Other..."
              placeholderTextColor={'#000'}
              keyboardType="default"
              value={sensitivitiesOther}
              onChangeText={(text) => setSensitivitiesOther(text)}
            />
          </View>
          <View style={styles.btnModalContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                setModal2Visible(false)
              }}
            >
              <Text style={styles.saveBtnTxt}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModal2Visible(false)}
            >
              <Text style={styles.cancelBtnTxt}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Physicial Abilities */}
      <TouchableOpacity
        style={styles.inputBox}
        onPress={() => setModal3Visible(true)}>
        <Text style={styles.input}>Physicial Abilities</Text>
        <Entypo style={styles.icon} name="chevron-right" size={24} color="black" />
      </TouchableOpacity>

      {/* Physicial Abilities Modal*/}
      <Modal animationType="slide" visible={modal3Visible}>
        <View style={styles.modal}>
          <Text style={styles.modalTextSecondRow}>Pick Physicial</Text>
          <Text style={[styles.modalTextSecondRow, { marginBottom: 20 }]}>Abilities</Text>
          <View style={styles.physicialContainer}>
            {physicalAbilities.map((physicial) => (
              <TouchableOpacity
                key={physicial.id}
                style={[styles.physical, physicial.selected && { borderColor: '#548DFF' }]}
                onPress={() => {
                  const newPhysicialAbilities = physicalAbilities.map((item) => {
                    if (item.id === physicial.id) {
                      return { ...item, selected: !item.selected };
                    }
                    return item;
                  });
                  setPhysicalAbilities(newPhysicialAbilities);
                }}>
                <Text style={styles.allergyText}>{physicial.name}</Text>
              </TouchableOpacity>
            ))}
            <TextInput
              style={styles.inputOther}
              placeholder="Other..."
              placeholderTextColor={'#000'}
              value={physicalAbilitiesOther}
              onChangeText={(text) => setPhysicalAbilitiesOther(text)}
            />
          </View>
          <View style={styles.btnModalContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                setModal3Visible(false)
              }}
            >
              <Text style={styles.saveBtnTxt}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModal3Visible(false)}
            >
              <Text style={styles.cancelBtnTxt}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bath Routine */}
      <TouchableOpacity
        style={styles.inputBox}
        onPress={() => setModal4Visible(true)}>
        <Text style={styles.input}>Bath Routine</Text>
        <Entypo style={styles.icon} name="chevron-right" size={24} color="black" />
      </TouchableOpacity>

      {/* Bath Routine Modal */}
      <Modal animationType="slide" visible={modal4Visible}>
        <View style={styles.modal}>
          <Text style={styles.modalText}>Pick Bath Routine</Text>
          <View style={styles.bathContainer}>
            {bathRoutine.map((bath) => (
              <TouchableOpacity
                key={bath.id}
                style={[styles.bath, (bath.selected & bath.name != 'All') && { borderColor: '#548DFF' }]}
                onPress={() => changebathRoutine(bath.name)}>
                <Text style={styles.allergyText}>{bath.name}</Text>
              </TouchableOpacity>
            ))}
            <TextInput
              style={styles.inputOther}
              placeholder="Other..."
              placeholderTextColor={'#000'}
              value={bathRoutineOther}
              onChangeText={(text) => setBathRoutineOther(text)}
            />
          </View>
          <View style={styles.btnModalContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                setModal4Visible(false)
              }}
            >
              <Text style={styles.saveBtnTxt}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton}
              onPress={() => setModal4Visible(false)}>
              <Text style={styles.cancelBtnTxt}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Sensitivity To Noises */}
      <Dropdown
        label={noiseSensitive}
        placeholder='Sensitivity To Noises?'
        placeholderTextColor={'#000'}
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        data={noiseSensitiveData}
        onChange={
          (item) => {
            setNoiseSensitive(item.label);
          }
        }
        value={'Sensitivity To Noises?'}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        labelField="label"
        valueField="value"
        containerStyle={styles.containerStyle}
        renderRightIcon={() => <Entypo name="chevron-right" size={24} color="black" />}
      />

      {/* Other info */}
      <TextInput
        style={styles.comments}
        placeholder="Other Relevant Information..."
        placeholderTextColor={'black'}
        onChangeText={setComments}
        value={comments}
        multiline={true}
      //  keyboardType="default"
        returnKeyType='done'
        //close keyboard when pressing done
        onSubmitEditing={Keyboard.dismiss}     
      />

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.buttonBox}
          onPress={NavigateToNextLVL} >
          <Text style={styles.button}>Continue</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    width: SCREEN_WIDTH * 1,
    alignItems: 'center',
  },
  btnModalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: SCREEN_WIDTH * 1,
    marginTop: 50,
  },
  sensitivityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: SCREEN_WIDTH * 1,
    marginTop: 50,
  },
  sensitivity: {
    width: SCREEN_WIDTH * 0.455,
    height: 55,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E6EBF2',
    marginVertical: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputBox: {
    width: SCREEN_WIDTH * 0.9,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E6EBF2',
    padding: 10,
    marginVertical: 7,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  line: {
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    width: SCREEN_WIDTH * 1,
    marginVertical: 20,
  },
  header: {
    fontSize: 30,
    marginBottom: 20,
    fontFamily: 'Urbanist-Bold',
  },
  input: {
    fontSize: 18,
    color: '#000',
    fontFamily: 'Urbanist-SemiBold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalText: {
    fontSize: 30,
    fontFamily: 'Urbanist-Bold',
    margin: 40,
  },
  saveButton: {
    width: SCREEN_WIDTH * 0.45,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#548DFF',
    borderWidth: 1.5,
    borderColor: '#548DFF',
    padding: 10,
    marginVertical: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    width: SCREEN_WIDTH * 0.45,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#F5F8FF',
    borderWidth: 1.5,
    borderColor: '#548DFF',
    padding: 10,
    marginVertical: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnTxt: {
    fontSize: 18,
    fontFamily: 'Urbanist-SemiBold',
    color: '#fff',
  },
  cancelBtnTxt: {
    fontSize: 18,
    fontFamily: 'Urbanist-SemiBold',
    color: '#548DFF',
  },
  comments: {
    height: 100,
    borderWidth: 1.5,
    paddingTop: 10,
    borderRadius: 16,
    borderColor: '#E6EBF2',
    padding: 10,
    marginVertical: 7,
    width: SCREEN_WIDTH * 0.9,
    fontSize: 18,
    fontFamily: 'Urbanist-SemiBold',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  buttonContainer: {
    width: SCREEN_WIDTH * 1,
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonBox: {
    width: SCREEN_WIDTH * 0.9,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#548DFF',
    borderWidth: 1,
    borderColor: '#548DFF',
    marginVertical: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Urbanist-SemiBold',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  allergiesContainer: {
    width: SCREEN_WIDTH * 0.95,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  allergy: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: "#E6EBF2",
    borderWidth: 1.5,
    borderRadius: 16,
    marginVertical: 5,
    height: 55,
    width: SCREEN_WIDTH * 0.31,
  },
  allergyText: {
    fontSize: 15,
    color: '#000',
    fontFamily: 'Urbanist',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputOther: {
    width: SCREEN_WIDTH * 0.95,
    height: 55,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E6EBF2',
    padding: 10,
    marginVertical: 7,
    justifyContent: 'center',
    alignItems: 'flex-start',
    fontFamily: 'Urbanist',
    fontSize: 15,
  },
  modalTextSecondRow: {
    fontSize: 30,
    fontFamily: 'Urbanist-Bold',
  },
  physicialContainer: {
    width: SCREEN_WIDTH * 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  physical: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: "#E6EBF2",
    borderWidth: 1.5,
    borderRadius: 16,
    margin: 5,
    height: 50,
    width: SCREEN_WIDTH * 0.295,
  },
  physicalText: {
    fontSize: 15,
    color: '#000',
    fontFamily: 'Urbanist',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bathContainer: {
    width: SCREEN_WIDTH * 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  bath: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: "#E6EBF2",
    borderWidth: 1.5,
    borderRadius: 16,
    marginVertical: 10,
    height: 55,
    width: SCREEN_WIDTH * 0.45,
  },
  bathText: {
    fontSize: 15,
    color: '#000',
    fontFamily: 'Urbanist',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    width: SCREEN_WIDTH * 0.9,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E6EBF2',
    padding: 10,
    marginVertical: 7,
    justifyContent: 'center',
    alignItems: 'flex-start',
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 18,
  },
  placeholderStyle: {
    fontSize: 18,
    fontFamily: 'Urbanist-SemiBold'
  },
  selectedTextStyle: {
    fontSize: 18,
    fontFamily: 'Urbanist-SemiBold',
    color: '#548DFF'
  },
});