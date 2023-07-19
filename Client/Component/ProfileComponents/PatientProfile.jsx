import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert, Platform } from 'react-native';
import { Chip, Dialog, TextInput,Paragraph,Button } from 'react-native-paper';
import { useUserContext } from '../../UserContext';
import { Feather, Fontisto, MaterialCommunityIcons, MaterialIcons,Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HobbiesJSON from '../SignUpComponents/User/Hobbies.json';
import LimitationsJSON from '../SignUpComponents/User/Limitations.json';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-datepicker';


const Tab = createMaterialTopTabNavigator();
const BUBBLE_SIZE = 125;
const CONTAINER_PADDING = 10;
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

export default function PatientProfile({ navigation }) {
    const { userContext, updateHobbiesAndLimitations, patientHL,unpair } = useUserContext();
    const [saving, setSaving] = useState(false);
    const patientData = userContext.patientData;
    const [hobbiesAndLimitations, setHobbiesAndLimitations] = useState(userContext.patientHL);
    const birthDate = moment(patientData.DateOfBirth).format('DD/MM/YYYY');
    const [hobbieFilter, setHobbieFilter] = useState('TVShow');
    const [limitFilter, setLimitFilter] = useState('allergies');
    const [dialogVisable, setDialogVisable] = useState(false);

    // maybe we can use this to save the hobbies and limitations.
    //the page re-renders when we save the hobbies and limitations beacuse it saves in the PatiientProfile component 
    const [hobbies, setHobbies] = useState([]);
    const [limitations, setLimitations] = useState([]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => { setDialogVisable(true) }} style={{marginRight:15}}>
                {/*icon of three dots- more options */}
                    <MaterialCommunityIcons name="dots-vertical" size={28} color="black" />
                </TouchableOpacity>
            ),
            headerLeft: () => (
                <View style={styles.headerLeft}>
                <TouchableOpacity onPress={()=>setSaving(true)}>
                    <Ionicons name="chevron-back" size={28} color="black" />
                </TouchableOpacity>
            </View>
            ),
        });

        if (hobbiesAndLimitations.length > 0) {
            let hobArr = [];
            let limitArr = [];
            for (let key in hobbiesArr) {
                if (hobbiesAndLimitations[0][`${hobbiesArr[key].key}`]) {
                    hobArr.push({ [`${hobbiesArr[key].key}`]: hobbiesAndLimitations[0][`${hobbiesArr[key].key}`] });
                }
            }
            for (let key in limitationsArr) {
                if (hobbiesAndLimitations[0][`${limitationsArr[key].key}`]) {
                    limitArr.push({ [`${limitationsArr[key].key}`]: hobbiesAndLimitations[0][`${limitationsArr[key].key}`] });
                }
            }
            setHobbies(hobArr);
            setLimitations(limitArr);
        }

    }, []);

    useEffect(() => {
        if (saving) {
            console.log("saving");
            Alert.alert(
                "Saving...",
                "Are you sure you want to save?",
                [
                    {
                        text: "Cancel",
                        onPress: () => { setSaving(false); navigation.goBack()},
                        style: "cancel"
                    },
                    {
                        text: "OK", onPress: () => {
                            let hobbiesAndLimitationsArr = hobbiesAndLimitations[0];
                            // add patient id to the object
                            hobbiesAndLimitationsArr.patientId = patientData.patientId;
                            updateHobbiesAndLimitations(hobbiesAndLimitationsArr)
                            setSaving(false);
                            navigation.goBack();
                        }
                    }
                ],
                { cancelable: false }
            );
        }
    }, [saving]);

    const hobbiesArr = [
        {
            key: 'TVShow',
            icon: <Feather name="tv" size={16} color="#548Dff" />,
            label: 'TV Show',
        },
        {
            key: 'afternoonNap',
            icon: <MaterialCommunityIcons name="sleep" size={16} color="#548Dff" />,
            label: 'Afternoon Nap',
        },
        {
            key: 'nightSleep',
            icon: <MaterialCommunityIcons name="sleep" size={16} color="#548Dff" />,
            label: 'Night Sleep',
        },
        {
            key: 'books',
            icon: <Feather name="book-open" size={16} color="#548Dff" />,
            label: 'Books',
        },
        {
            key: 'drink',
            icon: <Feather name="coffee" size={16} color="#548Dff" />,
            label: 'Drink',
        },
        {
            key: 'food',
            icon: <Feather name="gamepad" size={16} color="#548Dff" />,
            label: 'Food',
        },
        {
            key: 'movie',
            icon: <MaterialCommunityIcons name="movie" size={16} color="#548Dff" />,
            label: 'Movie',
        },
        {
            key: 'music',
            icon: <Feather name="music" size={16} color="#548Dff" />,
            label: 'Music',
        },
        {
            key: 'radioChannel',
            icon: <Feather name="radio" size={16} color="#548Dff" />,
            label: 'Radio Channel',
        },
        {
            key: 'specialHabits',
            icon: <MaterialCommunityIcons name="human-handsup" size={16} color="#548Dff" />,
            label: 'Special Habits',
        },
        {
            key: 'otherH',
            icon: <MaterialCommunityIcons name="human-handsup" size={16} color="#548Dff" />,
            label: 'Other Hobbies',
        },
    ];

    const limitationsArr = [
        {
            key: 'allergies',
            icon: <MaterialCommunityIcons name="allergy" size={16} color="#548Dff" />,
            label: 'Allergies',
        },
        {
            key: 'bathRoutine',
            icon: <MaterialCommunityIcons name="bathtub" size={16} color="#548Dff" />,
            label: 'Bath Routine',
        },
        {
            key: 'physicalAbilities',
            icon: <Fontisto name="paralysis-disability" size={16} color="#548Dff" />,
            label: 'Physical Abilities',
        },
        {
            key: 'sensitivities',
            icon: <MaterialIcons name="not-accessible" size={16} color="#548Dff" />,
            label: 'Sensitivities',
        },
        {
            key: 'sensitivityToNoise',
            icon: <MaterialCommunityIcons name="volume-high" size={16} color="#548Dff" />,
            label: 'Sensitivity to Noise',
        },
        {
            key: 'otherL',
            icon: <MaterialCommunityIcons name="human-handsup" size={16} color="#548Dff" />,
            label: 'Other Limitations',
        },
    ];

    const HobbiesScreen = () => {
        const [selectedHobbies, setSelectedHobby] = useState(hobbieFilter);
        const [arr, setArr] = useState([]);
        const [newHobbiesAndLimitations, setNewHobbiesAndLimitations] = useState(hobbiesAndLimitations);
        const [text, setText] = useState('');
        const { userNewHobbiesAndLimitations, setUserNewHobbiesAndLimitations } = useUserContext();
        const [datepickervisable, setDatepickervisable] = useState(false);

        useEffect(() => {
            if (newHobbiesAndLimitations[0][selectedHobbies]) {
                let arr = newHobbiesAndLimitations[0][selectedHobbies].split(",");
                let arr2 = [];
                arr.map((item, index) => {
                    arr2.push(item.trim());
                })
                setArr(arr2);
            }
        }, [selectedHobbies, newHobbiesAndLimitations]);

        useEffect(() => {
            setHobbiesAndLimitations(newHobbiesAndLimitations);
            setHobbieFilter(selectedHobbies);
        }, [newHobbiesAndLimitations]);

        const onTimeChangeAndroid = (date) => {
            setDatepickervisable(false);
            if (date.type == "set") {
                let currentTime = new Date(date.nativeEvent.timestamp).toTimeString().substring(0, 5);
                setNewHobbiesAndLimitations([{ ...newHobbiesAndLimitations[0], [selectedHobbies]: currentTime }]);
            }
        }

        const onTimeChangeIos = (value) => {
            if (value) {
                let currentTime = new Date(value).toTimeString().substring(0, 5);
                setNewHobbiesAndLimitations([{ ...newHobbiesAndLimitations[0], [selectedHobbies]: currentTime }]);
            }
        }

        const handleHobbyToggle = (limitation) => {
            let name = limitation.name || limitation
            if (newHobbiesAndLimitations[0][selectedHobbies]) {
                let userArr = newHobbiesAndLimitations[0][selectedHobbies].split(",");
                let userArr2 = [];
                userArr.map((item, index) => {
                    userArr2.push(item.trim());
                })
                if (newHobbiesAndLimitations[0][selectedHobbies].includes(name) || userArr2.includes(name)) {
                    let arr = newHobbiesAndLimitations[0][selectedHobbies].split(",");
                    let arr2 = [];
                    arr.map((item, index) => {
                        arr2.push(item.trim());
                    })
                    let index = arr2.indexOf(name);
                    arr2.splice(index, 1);
                    let str = arr2.join(", ");
                    setNewHobbiesAndLimitations([{ ...newHobbiesAndLimitations[0], [selectedHobbies]: str }]);
                }
                else {
                    let arr = newHobbiesAndLimitations[0][selectedHobbies];
                    arr += ", " + name;
                    setNewHobbiesAndLimitations([{ ...newHobbiesAndLimitations[0], [selectedHobbies]: arr }]);
                }
            }
            else {
                setNewHobbiesAndLimitations([{ ...newHobbiesAndLimitations[0], [selectedHobbies]: name }]);
            }
        };

        return (
            <View>
                <ScrollView horizontal contentContainerStyle={styles.filterContainer}>
                    {hobbiesArr.map((category, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.filterButtonText,
                                selectedHobbies === category.key && styles.selectedFilterTxt,
                            ]}
                            onPress={() => setSelectedHobby(category.key)}
                        >
                            <View
                                key={index}
                                style={[
                                    styles.filterButton,
                                    selectedHobbies === category.key && styles.selectedFilterButton,
                                ]}
                            >
                                <Text
                                    style={[styles.filterText,
                                    selectedHobbies === category.key && styles.selectedTxt
                                    ]}
                                >
                                    {category.label}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))
                    }
                </ScrollView >
                <ScrollView alwaysBounceVertical={false} contentContainerStyle={styles.collageContainer}>
                    {
                        HobbiesJSON[selectedHobbies] ?
                            <View style={styles.collageContainer}>
                                {HobbiesJSON[selectedHobbies].map((hobby, index) => {
                                    return (
                                        <TouchableOpacity
                                            style={[styles.collageItemContainer, newHobbiesAndLimitations[0][selectedHobbies].includes(hobby.name) ? styles.selectedCollageBubble : null]}
                                            onPress={() => { handleHobbyToggle(hobby) }}
                                            key={index}
                                        >
                                            <View key={index} style={newHobbiesAndLimitations[0][selectedHobbies].includes(hobby.name) ? styles.selectecollageBubble : styles.collageBubble}>
                                                <Text style={newHobbiesAndLimitations[0][selectedHobbies].includes(hobby.name) ? styles.selectedCollageText : styles.collageTxt}>{hobby.name}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })
                                }
                                {/*render additional attrubutes that were not in the json*/}
                                {newHobbiesAndLimitations[0][selectedHobbies] &&
                                    arr.map((hobby, index) => {
                                        if (!HobbiesJSON[selectedHobbies].some(item => item.name === hobby)) {
                                            return (
                                                <TouchableOpacity
                                                    style={[styles.collageItemContainer, styles.selectedCollageBubble]}
                                                    onPress={() => { handleHobbyToggle(hobby) }}
                                                    key={index}
                                                >
                                                    <View key={index} style={styles.selectedCollageBubble}>
                                                        <Text style={styles.selectedCollageText}>test:{hobby}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        }
                                    }
                                    )
                                }
                            </View>
                            : <View>
                                {/*if not in json, render from user array */}
                                {newHobbiesAndLimitations[0][selectedHobbies] ?
                                    <>
                                        <View style={styles.collageContainer}>
                                            {selectedHobbies === 'nightSleep' || selectedHobbies === 'afternoonNap' ?
                                                arr.map((hobby, index) => {
                                                    return (
                                                        <View key={index}>
                                                            {Platform.OS === 'android' ?
                                                                <TouchableOpacity onPress={() => setDatepickervisable(true)}
                                                                    style={styles.TimePickerbubble}>
                                                                    <Text style={{ color: '#fff', fontFamily: 'Urbanist-Bold' }}>{hobby}</Text>
                                                                </TouchableOpacity>
                                                                :
                                                                // need to check for ios
                                                                <DatePicker
                                                                    useNativeDriver={'true'}
                                                                    style={[styles.collageItemContainer, styles.TimePickerbubble]}
                                                                    date={hobby}
                                                                    mode="time"
                                                                    placeholder="Add Time"
                                                                    format="HH:mm"
                                                                    is24Hour={true}
                                                                    confirmBtnText="Confirm"
                                                                    cancelBtnText="Cancel"
                                                                    iconComponent={<MaterialCommunityIcons style={styles.addIcon} name="timer-outline" size={24} color="#000" />}
                                                                    showIcon={true}
                                                                    customStyles={{
                                                                        dateInput: {
                                                                            borderWidth: 0,
                                                                            alignItems: 'flex-start',
                                                                            paddingLeft: 10,
                                                                        },
                                                                        placeholderText: {
                                                                            color: '#9E9E9E',
                                                                            fontSize: 16,
                                                                            textAlign: 'left',
                                                                            fontFamily: 'Urbanist-Light',
                                                                        },
                                                                        dateText: {
                                                                            color: '#000',
                                                                            fontSize: 16,
                                                                            fontFamily: 'Urbanist-SemiBold',
                                                                        },
                                                                    }}
                                                                    onDateChange={(value) => onTimeChangeIos(value)}
                                                                />}
                                                        </View>
                                                    )
                                                })
                                                :
                                                arr.map((hobby, index) => {
                                                    return (
                                                        <TouchableOpacity
                                                            style={[styles.collageItemContainer, styles.selectedCollageBubble]}
                                                            onPress={() => { handleHobbyToggle(hobby) }}
                                                            key={index}
                                                        >
                                                            <View key={index} style={styles.selectedCollageBubble}>
                                                                <Text style={styles.selectedCollageText}>{hobby}</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    )
                                                }
                                                )
                                            }
                                        </View>
                                        {datepickervisable && (
                                            <DateTimePicker
                                                value={new Date()}
                                                mode={"time"}
                                                is24Hour={true}
                                                placeholder="time"
                                                minimumDate={new Date(2000, 0, 1)}
                                                onChange={(date) => onTimeChangeAndroid(date)}
                                                display="default"
                                            />
                                        )}
                                    </>
                                    :
                                    //if not in json and not in user array, render text input ir timepicker- based on the hobbie
                                    <View>
                                        {selectedHobbies === 'nightSleep' || selectedHobbies === 'afternoonNap' ?
                                            <>
                                                {Platform.OS === 'android' ?
                                                    <>
                                                        <Text style={{ fontSize: 20, fontFamily: 'Urbanist-Medium', color: '#548DFF', textAlign: 'center', marginTop: 20 }}>No Time Selected</Text>
                                                        <TouchableOpacity onPress={() => setDatepickervisable(true)}
                                                            style={styles.TimePickerbubble}>
                                                            <Text style={{ color: '#fff', fontFamily: 'Urbanist-Bold' }}>Add Time</Text>
                                                        </TouchableOpacity>

                                                    </>
                                                    :
                                                    <>
                                                    {/*need to check for ios*/}
                                                        <DatePicker
                                                            useNativeDriver={'true'}
                                                            style={[styles.collageItemContainer, styles.TimePickerbubble]}
                                                            date={hobby}
                                                            mode="time"
                                                            placeholder="Add Time"
                                                            format="HH:mm"
                                                            is24Hour={true}
                                                            confirmBtnText="Confirm"
                                                            cancelBtnText="Cancel"
                                                            iconComponent={<MaterialCommunityIcons style={styles.addIcon} name="timer-outline" size={24} color="#000" />}
                                                            showIcon={true}
                                                            customStyles={{
                                                                dateInput: {
                                                                    borderWidth: 0,
                                                                    alignItems: 'flex-start',
                                                                    paddingLeft: 10,
                                                                },
                                                                placeholderText: {
                                                                    color: '#9E9E9E',
                                                                    fontSize: 16,
                                                                    textAlign: 'left',
                                                                    fontFamily: 'Urbanist-Light',
                                                                },
                                                                dateText: {
                                                                    color: '#000',
                                                                    fontSize: 16,
                                                                    fontFamily: 'Urbanist-SemiBold',
                                                                },
                                                            }}
                                                            onDateChange={(value) => onTimeChangeIos(value)}
                                                        />

                                                    </>}
                                            </>
                                            :
                                            <>
                                                <Text style={styles.noLimitationsText}>No Hobbies Selected</Text>
                                                <TextInput
                                                    mode='outlined'
                                                    label={selectedHobbies}
                                                    placeholderTextColor='#548DFF'
                                                    style={styles.inputTxt}
                                                    outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
                                                    activeOutlineColor="#548DFF"
                                                    placeholder="Type Something..."
                                                    contentStyle={{ fontFamily: 'Urbanist-Regular' }}
                                                    outlineColor='#E6EBF2'
                                                    onChangeText={(text) => setText(text)}
                                                />
                                                <TouchableOpacity onPress={() => handleHobbyToggle(text)}
                                                    style={styles.saveButton}>
                                                    <Text style={styles.saveButtonText}>Save Hobbie</Text>
                                                </TouchableOpacity></>
                                        }
                                    </View>
                                }
                            </View>

                    }
                </ScrollView>
            </View>
        );
    };

    const LimitationsScreen = () => {
        const [selectedFilter, setSelectedFilter] = useState(limitFilter);
        const [arr, setArr] = useState([]);
        const [newHobbiesAndLimitations, setNewHobbiesAndLimitations] = useState(hobbiesAndLimitations);
        const [text, setText] = useState('');

        const handleHobbyToggle = (limitation) => {
            let name = limitation.name || limitation
            if (newHobbiesAndLimitations[0][selectedFilter]) {
                let userArr = newHobbiesAndLimitations[0][selectedFilter].split(",");
                let userArr2 = [];
                userArr.map((item, index) => {
                    userArr2.push(item.trim());
                })
                if (newHobbiesAndLimitations[0][selectedFilter].includes(name) || userArr2.includes(name)) {
                    let arr = newHobbiesAndLimitations[0][selectedFilter].split(",");
                    let arr2 = [];
                    arr.map((item, index) => {
                        arr2.push(item.trim());
                    })
                    let index = arr2.indexOf(name);
                    arr2.splice(index, 1);
                    let str = arr2.join(", ");
                    setNewHobbiesAndLimitations([{ ...newHobbiesAndLimitations[0], [selectedFilter]: str }]);
                }
                else {
                    let arr = newHobbiesAndLimitations[0][selectedFilter];
                    arr += ", " + name;
                    setNewHobbiesAndLimitations([{ ...newHobbiesAndLimitations[0], [selectedFilter]: arr }]);
                }
            }
            else {
                setNewHobbiesAndLimitations([{ ...hobbiesAndLimitations[0], [selectedFilter]: limitation.name || limitation }]);
            }
        };

        useEffect(() => {
            setHobbiesAndLimitations(newHobbiesAndLimitations);
            setLimitFilter(selectedFilter);
        }, [newHobbiesAndLimitations]);

        useEffect(() => {
            if (newHobbiesAndLimitations[0][selectedFilter]) {
                let arr = newHobbiesAndLimitations[0][selectedFilter].split(",");
                let arr2 = [];
                arr.map((item, index) => {
                    arr2.push(item.trim());
                })
                setArr(arr2);
            }
        }, [selectedFilter, newHobbiesAndLimitations]);

        return (
            <View>
                <ScrollView horizontal contentContainerStyle={styles.filterContainer}>
                    {limitationsArr.map((filter, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.filterButton,
                                selectedFilter === filter.key && styles.selectedFilterButton,
                            ]}
                            onPress={() => setSelectedFilter(filter.key)}
                        >
                            <View
                                style={[
                                    styles.filterButton,
                                    selectedFilter === filter.key && styles.selectedFilterButton,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.filterText,
                                        selectedFilter === filter.key && styles.selectedTxt,
                                    ]}
                                >
                                    {filter.label}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <ScrollView alwaysBounceVertical={false} contentContainerStyle={styles.collageContainer}>
                    {LimitationsJSON[selectedFilter] ? (
                        <View style={styles.collageContainer}>
                            {LimitationsJSON[selectedFilter].map((limitation, index) => (
                                <TouchableOpacity
                                    style={[
                                        styles.collageItemContainer,
                                        newHobbiesAndLimitations[0][selectedFilter].includes(limitation.name)
                                            ? styles.selectedCollageBubble
                                            : null,
                                    ]}
                                    onPress={() => {
                                        console.log("pressed");
                                        handleHobbyToggle(limitation);
                                    }}
                                    key={index}
                                >
                                    <View
                                        style={[
                                            styles.collageBubble,
                                            newHobbiesAndLimitations[0][selectedFilter].includes(limitation.name)
                                                ? styles.selectedCollageBubble
                                                : null,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.collageText,
                                                newHobbiesAndLimitations[0][selectedFilter].includes(limitation.name)
                                                    ? styles.selectedCollageText
                                                    : styles.collageTxt,
                                            ]}
                                        >
                                            {limitation.name}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                            {newHobbiesAndLimitations[0][selectedFilter] &&
                                arr.map((limitation, index) => {
                                    if (!LimitationsJSON[selectedFilter].some(item => item.name === limitation)) {
                                        return (
                                            <TouchableOpacity
                                                style={[styles.collageItemContainer, styles.selectedCollageBubble]}
                                                onPress={() => {
                                                    console.log("pressed");
                                                    handleHobbyToggle(limitation);
                                                }}
                                                key={index}
                                            >
                                                <View style={styles.selectedCollageBubble}>
                                                    <Text style={styles.selectedCollageText}>{limitation}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    }
                                })}
                        </View>
                    ) : (
                        <View>
                            {newHobbiesAndLimitations[0][selectedFilter] ? (
                                <View style={styles.collageContainer}>
                                {arr.map((limitation, index) => (
                                    <View key={index}>
                                        {selectedFilter === 'sensitivityToNoise' ?
                                    <TouchableOpacity
                                        style={[styles.collageItemContainer, styles.selectedCollageBubble]}
                                        onPress={() => {
                                            let str=''
                                            if (newHobbiesAndLimitations[0][selectedFilter]=="Yes") {
                                                str="No"
                                            }
                                            else{
                                                str="Yes"
                                            }
                                            console.log("pressed sensitivityToNoise");
                                            setNewHobbiesAndLimitations([{ ...newHobbiesAndLimitations[0], [selectedFilter]: str }]);
                                        }}
                                        key={index}
                                    >
                                        <View style={styles.selectedCollageBubble}>
                                            <Text style={styles.selectedCollageText}>{limitation}</Text>
                                        </View>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        style={[styles.collageItemContainer, styles.selectedCollageBubble]}
                                        onPress={() => {
                                            console.log("pressed");
                                            handleHobbyToggle(limitation);
                                        }}
                                        key={index}
                                    >
                                        <View style={styles.selectedCollageBubble}>
                                            <Text style={styles.selectedCollageText}>{limitation}</Text>
                                            </View>
                                    </TouchableOpacity>
                                    }
                                    </View>
                                ))}
                                {selectedFilter=='otherL'&& <View>
                                 <TextInput
                                        mode="outlined"
                                        label={selectedFilter}
                                        placeholderTextColor="#548DFF"
                                        style={styles.inputTxt}
                                        outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
                                        activeOutlineColor="#548DFF"
                                        placeholder="Type Something..."
                                        contentStyle={{ fontFamily: 'Urbanist-Regular' }}
                                        outlineColor="#E6EBF2"
                                        onChangeText={text => setText(text)}
                                    />
                                    <TouchableOpacity
                                        onPress={() => handleHobbyToggle(text)}
                                        style={styles.saveButton}
                                    >
                                        <Text style={styles.saveButtonText}>Save Limitation</Text>
                                    </TouchableOpacity>
                                </View>}
                                </View>
                            ) : (
                                <View>
                                    <Text style={styles.noLimitationsText}>No Limitations Selected</Text>
                                    <TextInput
                                        mode="outlined"
                                        label={selectedFilter}
                                        placeholderTextColor="#548DFF"
                                        style={styles.inputTxt}
                                        outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
                                        activeOutlineColor="#548DFF"
                                        placeholder="Type Something..."
                                        contentStyle={{ fontFamily: 'Urbanist-Regular' }}
                                        outlineColor="#E6EBF2"
                                        onChangeText={text => setText(text)}
                                    />
                                    <TouchableOpacity
                                        onPress={() => handleHobbyToggle(text)}
                                        style={styles.saveButton}
                                    >
                                        <Text style={styles.saveButtonText}>Save Limitation</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    )
                    }
                </ScrollView >
            </View >
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerData}>
                <View style={styles.headerBlock}>
                    <Text style={styles.headerTxtSM}>{birthDate}</Text>
                    <Text style={styles.headerTxtXS}>Date of Birth</Text>
                </View>
                <View style={styles.headerBlock}>
                    <Text style={styles.headerTxtSM}>{patientData.LanguageName_En}</Text>
                    <Text style={styles.headerTxtXS}>Language</Text>
                </View>
                <View style={styles.headerBlock}>
                    <Text style={styles.headerTxtSM}>{patientData.patientId}</Text>
                    <Text style={styles.headerTxtXS}>ID</Text>
                </View>
            </View>
            <View style={styles.hobbiesAndLimitationsContainer}>
                <Tab.Navigator
                    screenOptions={{
                        tabBarStyle: {
                            backgroundColor: '#fff',
                            height: 60,
                        },
                        tabBarPressColor: '#548DFF',
                        tabBarPressOpacity: 0.5,
                        tabBarLabelStyle: {
                            height: 25,
                            fontSize: 16,
                            fontFamily: 'Urbanist-Bold',
                            alignItems: 'center',
                            textTransform: 'none',
                        },
                        tabBarIndicatorStyle: {
                            backgroundColor: '#548DFF',
                            height: 3,
                            borderRadius: 50,
                            width: '35%',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            marginLeft: '6%',
                            marginBottom: 10,
                        },
                    }}
                >
                    <Tab.Screen name="Hobbies" component={HobbiesScreen} />
                    <Tab.Screen name="Limitations" component={LimitationsScreen} />
                </Tab.Navigator>
            </View>
            {/*dialog for unpair options */}
            <Dialog visible={dialogVisable} onDismiss={()=>setDialogVisable(false)} style={styles.dialogStyle}>
               <Dialog.Title style={styles.dialogTitle}>Pairing Options</Dialog.Title>
                <Dialog.Content>
                    <Paragraph style={styles.dialpgParagraph}>Do you want to add new Pairing or cancel pairing??</Paragraph>
                </Dialog.Content>
                <Dialog.Actions style={{ justifyContent:'center'}}>
                <Button labelStyle={styles.dialogTxt} onPress={() => {
                    console.log("New pairing")        
                    // will send to new pairing screen, send caregiver link and go back to main              
                    }}>New Pair</Button>
                     <Button style={{width:60}} labelStyle={styles.dialogTxt} onPress={() => {
                       console.log("Delete Pairing") 
                       unpair();  
                       setDialogVisable(false);
                       navigation.goBack();   
                       // will cancel pairing and go back to main, re-activate loginMethod/remove caregiver link(workerId in user Context)            
                   }}>Delete Pair</Button>
                   {/* <Button labelStyle={styles.dialogTxt} onPress={() => {                       
                       console.log("Cancel actions")         

                   }}>Cancel Actions</Button> */}
                </Dialog.Actions>
                </Dialog>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    headerBlock: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D0DFFF',
        borderColor: '#548DFF',
        borderWidth: 1.5,
        borderRadius: 20,
        marginHorizontal: 5,
        shadowColor: '#548DFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
    },
    headerData: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: 10,
        flex: 1,
        backgroundColor: '#FFF',
    },
    headerTxtSM: {
        fontSize: 16,
        fontFamily: 'Urbanist-Medium',
        textAlign: 'center',
        padding: 10,
    },
    headerTxtXS: {
        fontSize: 14,
        fontFamily: 'Urbanist-Regular',
        textAlign: 'center',
        padding: 10,
        color: '#548DFF',
    },
    hobbiesAndLimitationsContainer: {
        flex: 4,
        backgroundColor: '#FFF',
    },
    collageContainer: {
        width: ScreenWidth,
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#FFF',
        height: '100%',
    },
    collageBubble: {
        width: ScreenWidth * 0.285,
        marginVertical: 7,
        height: 55,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F8FF',
        borderColor: '#548DFF',
        borderWidth: 1.5,
    },
    selectedCollageBubble: {
        width: ScreenWidth * 0.285,
        marginVertical: 7,
        height: 55,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        backgroundColor: '#548DFF',
        borderColor: '#D0DFFF',
        borderWidth: 1.5,
    },
    selectedCollageText: {
        fontSize: 15,
        color: '#fff',
        fontFamily: 'Urbanist-Regular',
    },
    collageItemContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        margin: 5,
    },
    collageTxt: {
        fontSize: 15,
        color: '#000',
        fontFamily: 'Urbanist-Regular',
    },
    filterContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        backgroundColor: '#D0DFFF',
    },
    filterButton: {
        paddingHorizontal: 15,
        height: 40,
        marginHorizontal: 7,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D0DFFF',
        borderColor: '#548DFF',
        borderBottomWidth: 0.75,
        borderTopWidth: 0.75,
    },
    selectedFilterButton: {
        borderColor: '#fff',
    },
    filterText: {
        fontSize: 14,
        fontFamily: 'Urbanist-Medium',
        color: '#548DFF',
    },
    selectedFilterTxt: {
        fontSize: 14,
        fontFamily: 'Urbanist-Medium',
        color: '#548DFF',
    },
    selectedTxt: {
        fontSize: 14,
        fontFamily: 'Urbanist-SemiBold',
        color: '#fff',
    },
    inputTxt: {
        fontFamily: 'Urbanist-Light',
        fontSize: 16,
        color: '#000',
        backgroundColor: '#fff',
        width: ScreenWidth * 0.95,
        marginVertical: 10,
    },
    TimePickerbubble: {
        marginTop: 10,
        width: ScreenWidth * 0.5,
        marginVertical: 7,
        height: 55,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        backgroundColor: '#548DFF',
        borderColor: '#D0DFFF',
        borderWidth: 1.5,
    },
    noLimitationsText: {
        fontSize: 20,
        fontFamily: 'Urbanist-Medium',
        color: '#548DFF',
        textAlign: 'center',
        marginTop: 20
    },
    saveButtonText: {
        color: '#fff',
        fontFamily: 'Urbanist-Bold'
    },
    saveButton: {
        backgroundColor: "#548DFF",
        height: 54,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16
    },
    headerLeft: {
        marginLeft: 15,
    },
    dialogStyle: {
        backgroundColor: '#87AFFF',
        alignContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        borderColor: '#000',
        borderWidth: 1.5,
        padding: 10,
    },
    dialogTxt: {
        fontFamily: 'Urbanist-SemiBold',
        color: '#000',
        borderRadius: 16,
        borderColor: '#000',
        borderWidth: 1.5,
        padding: 10,
        width: 100,
    },
    dialogTitle: {
        fontFamily: 'Urbanist-SemiBold',
        color: '#000',
        fontSize: 24,
    },
    dialpgParagraph: {
        color: "#000",
        fontFamily: "Urbanist-Regular",
        fontSize: 16
    },
});
