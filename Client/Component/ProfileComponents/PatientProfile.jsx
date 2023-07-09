import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Chip, TextInput } from 'react-native-paper';
import { useUserContext } from '../../UserContext';
import { Feather, Fontisto, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HobbiesJSON from '../SignUpComponents/User/Hobbies.json';
import LimitationsJSON from '../SignUpComponents/User/Limitations.json';
import { useFocusEffect } from '@react-navigation/native';
const Tab = createMaterialTopTabNavigator();
const BUBBLE_SIZE = 100;
const CONTAINER_PADDING = 10;
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

export default function PatientProfile({navigation}) {
    const { userContext } = useUserContext();
    const [saving, setSaving] = useState(false);
    const patientData = userContext.patientData;
    const [hobbiesAndLimitations, setHobbiesAndLimitations] = useState(userContext.patientHL);
    const [newData, setNewData] = useState(userContext.patientHL);
    const birthDate = moment(patientData.DateOfBirth).format('DD/MM/YYYY');
    
    // maybe we can use this to save the hobbies and limitations.
    //the page re-renders when we save the hobbies and limitations beacuse it saves in the PatiientProfile component 
    const [hobbies, setHobbies] = useState([]);
    const [limitations, setLimitations] = useState([]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => { setSaving(true); setTimeout(() => { setSaving(false); }, 1000); }}>
                    <Text style={{ fontSize: 16, fontFamily: 'Urbanist-Medium', color: '#548DFF', marginRight: 10 }}>Save</Text>
                </TouchableOpacity>
            ),
        });

        if (hobbiesAndLimitations.length > 0) {
            let hobArr = [];
            let limitArr = [];
            for (let key in hobbiesArr) {
                console.log(hobbiesAndLimitations[0][`${hobbiesArr[key].key}`]);
                if (hobbiesAndLimitations[0][`${hobbiesArr[key].key}`]) {
                    hobArr.push({[`${hobbiesArr[key].key}`] : hobbiesAndLimitations[0][`${hobbiesArr[key].key}`]});
                }
            }
            for (let key in limitationsArr) {
                if (hobbiesAndLimitations[0][`${limitationsArr[key].key}`]) {
                    limitArr.push({[`${limitationsArr[key].key}`]:hobbiesAndLimitations[0][`${limitationsArr[key].key}`]});
                }
            }
            setHobbies(hobArr);
            setLimitations(limitArr);
            }
        
    }, []);

    useEffect(() => {
        console.log(hobbiesAndLimitations);
    }, [hobbiesAndLimitations]);

    useEffect(() => {
        if (saving) {
            console.log("saving");
            Alert.alert(
                "Saving...",
                "Are you sure you want to save?",
                [
                    {
                        text: "Cancel",
                        onPress: () => { setSaving(false); },
                        style: "cancel"
                    },
                    {
                        text: "OK", onPress: () => {
                            console.log("saving...");
                            // save to db
                            setSaving(false);
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
            key: 'otherH',
            icon: <MaterialCommunityIcons name="human-handsup" size={16} color="#548Dff" />,
            label: 'Other Hobbies',
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
            key: 'nightSleep',
            icon: <MaterialCommunityIcons name="sleep" size={16} color="#548Dff" />,
            label: 'Night Sleep',
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
        const [selectedHobbies, setSelectedHobby] = useState('TVShow');
        const [arr, setArr] = useState([]);
        const [newHobbiesAndLimitations, setNewHobbiesAndLimitations] = useState(userContext.patientHL);
                
        
        useEffect(() => {
            if (newHobbiesAndLimitations[0][selectedHobbies]) {
                let arr = newHobbiesAndLimitations[0][selectedHobbies].split(",");
                let arr2 = [];
                arr.map((item, index) => {
                    arr2.push(item.trim());
                })
                setArr(arr2);
            }
        }, [selectedHobbies]);


        //partially works- its sets it and asves it, but re-renders the entier screen including the TopScroolView
        const handleHobbyToggle = (limitation) => {
            let name=limitation.name || limitation
            if (newHobbiesAndLimitations[0][selectedHobbies]) {
                let userArr= newHobbiesAndLimitations[0][selectedHobbies].split(",");
                let userArr2 = [];
                userArr.map((item, index) => {
                    userArr2.push(item.trim());
                })
                console.log(userArr2);
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
                    let arr= newHobbiesAndLimitations[0][selectedHobbies];
                    arr+= ", " + name;
                    setNewHobbiesAndLimitations([{ ...newHobbiesAndLimitations[0], [selectedHobbies]: arr }]);
                }
            }
            else {
                setNewHobbiesAndLimitations([{ ...hobbiesAndLimitations[0], [selectedHobbies]: limitation.name || limitation }]);
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
                                <Text style={styles.filterText}>{category.label}</Text>
                            </View>
                        </TouchableOpacity>
                    ))
                    }
                </ScrollView >
                <ScrollView contentContainerStyle={styles.collageContainer}>
                    {
                        HobbiesJSON[selectedHobbies] ?
                            <View style={styles.collageContainer}>
                                {HobbiesJSON[selectedHobbies].map((hobby, index) => {
                                    return (
                                        <TouchableOpacity
                                            style={[styles.collageItemContainer, newHobbiesAndLimitations[0][selectedHobbies].includes(hobby.name) ? styles.selectedCollageBubble : null]}
                                            onPress={() => { console.log("pressed"); handleHobbyToggle(hobby) }}
                                            key={index}
                                        >
                                            <View key={index} style={newHobbiesAndLimitations[0][selectedHobbies].includes(hobby.name) ? styles.selectecollageBubble : styles.collageBubble}>
                                                <Text style={newHobbiesAndLimitations[0][selectedHobbies].includes(hobby.name) ? styles.selectedCollageText : styles.collageText}>{hobby.name}</Text>
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
                                                    onPress={() => { console.log("pressed"); handleHobbyToggle(hobby) }}
                                                    key={index}
                                                >
                                                    <View key={index} style={styles.selectedCollageBubble}>
                                                        <Text style={styles.selectedCollageText}>{hobby}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        }
                                    }
                                    )
                                }
                            </View>
                            : <View>
                                {newHobbiesAndLimitations[0][selectedHobbies] ?
                                    arr.map((hobby, index) => {
                                        return (
                                            <TouchableOpacity
                                                style={[styles.collageItemContainer, styles.selectedCollageBubble]}
                                                onPress={() => { console.log("pressed"); handleHobbyToggle(hobby) }}
                                                key={index}
                                            >
                                                <View key={index} style={styles.selectedCollageBubble}>
                                                    <Text style={styles.selectedCollageText}>{hobby}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    })
                                    :
                                    <View>
                                        <Text style={{ fontSize: 20, fontFamily: 'Urbanist-Medium', color: '#548DFF', textAlign: 'center', marginTop: 20 }}>No Hobbies Selected</Text>
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
                                            onChange={(text) => { }}
                                        />
                                    </View>
                                }
                            </View>

                    }
                </ScrollView>
            </View>
        );
    };

    const LimitationsScreen = () => {
        const [selectedFilter, setSelectedFilter] = useState('allergies');
        const [arr, setArr] = useState([]);
        const [newHobbiesAndLimitations, setNewHobbiesAndLimitations] = useState(userContext.patientHL);

        const handleHobbyToggle = (limitation) => {
            let name=limitation.name || limitation
            if (newHobbiesAndLimitations[0][selectedFilter]) {
                let userArr= newHobbiesAndLimitations[0][selectedFilter].split(",");
                let userArr2 = [];
                userArr.map((item, index) => {
                    userArr2.push(item.trim());
                })
                console.log(userArr2);
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
                    let arr= newHobbiesAndLimitations[0][selectedFilter];
                    arr+= ", " + name;
                    setNewHobbiesAndLimitations([{ ...newHobbiesAndLimitations[0], [selectedFilter]: arr }]);
                }
            }
            else {
                setNewHobbiesAndLimitations([{ ...hobbiesAndLimitations[0], [selectedFilter]: limitation.name || limitation }]);
            }
        };

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
                            <Text style={styles.filterButtonText}>{filter.key}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <ScrollView contentContainerStyle={styles.collageContainer}>
                    {/*version without icon- render according to category */}
                    {
                        LimitationsJSON[selectedFilter] ?
                            <View style={styles.collageContainer}>
                                {LimitationsJSON[selectedFilter].map((limitation, index) => {
                                    return (
                                        <TouchableOpacity
                                            style={[styles.collageItemContainer, newHobbiesAndLimitations[0][selectedFilter].includes(limitation.name) ? styles.selectedCollageBubble : null]}
                                            onPress={() => { console.log("pressed"); handleHobbyToggle(limitation) }}
                                            key={index}
                                        >
                                            <View key={index} style={newHobbiesAndLimitations[0][selectedFilter].includes(limitation.name) ? styles.selectedCollageBubble : styles.collageBubble}>
                                                <Text style={newHobbiesAndLimitations[0][selectedFilter].includes(limitation.name) ? styles.selectedCollageText : styles.collageText}>{limitation.name}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })}
                                {/*render additional attrubutes that were not in the json*/}
                                {newHobbiesAndLimitations[0][selectedFilter] &&
                                    arr.map((limitation, index) => {
                                        if (!LimitationsJSON[selectedFilter].some(item => item.name === limitation)) {
                                            return (
                                                <TouchableOpacity
                                                    style={[styles.collageItemContainer, styles.selectedCollageBubble]}
                                                    onPress={() => { console.log("pressed"); handleHobbyToggle(limitation) }}
                                                    key={index}
                                                >
                                                    <View key={index} style={styles.selectedCollageBubble}>
                                                        <Text style={styles.selectedCollageText}>{limitation}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            )
                                        }
                                    }
                                    )
                                }
                            </View>
                            : <View>
                                {newHobbiesAndLimitations[0][selectedFilter] ?
                                    arr.map((limitation, index) => {
                                        return (
                                            <TouchableOpacity
                                                style={[styles.collageItemContainer, styles.selectedCollageBubble]}
                                                onPress={() => { console.log("pressed"); handleHobbyToggle(limitation) }}
                                                key={index}
                                            >
                                                <View key={index} style={styles.selectedCollageBubble}>
                                                    <Text style={styles.selectedCollageText}>{limitation}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }
                                    )
                                    :
                                    <View>
                                        <Text style={{ fontSize: 20, fontFamily: 'Urbanist-Medium', color: '#548DFF', textAlign: 'center', marginTop: 20 }}>No Limitations Selected</Text>
                                        <TextInput
                                            mode='outlined'
                                            label={selectedFilter}
                                            placeholderTextColor='#548DFF'
                                            style={styles.inputTxt}
                                            outlineStyle={{ borderRadius: 16, borderWidth: 1.5 }}
                                            activeOutlineColor="#548DFF"
                                            placeholder="Type Something..."
                                            contentStyle={{ fontFamily: 'Urbanist-Regular' }}
                                            outlineColor='#E6EBF2'
                                            onChange={(text) => {}}
                                        />
                                    </View>
                                }
                            </View>
                    }

                </ScrollView>
            </View>
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        backgroundColor: '#D0DFFF',
        marginVertical: 10,
    },
    collageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: Platform.OS === "android" && CONTAINER_PADDING * 3,
    },
    collageBubble: {
        width: BUBBLE_SIZE,
        height: BUBBLE_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        margin: CONTAINER_PADDING / 4,
        borderRadius: BUBBLE_SIZE / 2,
        //backgroundColor: '#D0DFFF',
        backgroundColor: '#F5F8FF',
        borderColor: '#548DFF',
        borderWidth: 1.5,
    },
    selectedCollageBubble: {
        width: BUBBLE_SIZE,
        height: BUBBLE_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        margin: CONTAINER_PADDING / 4,
        borderRadius: BUBBLE_SIZE / 2,
        backgroundColor: '#548DFF',
        borderColor: '#D0DFFF',
        borderWidth: 1.5,
    },
    collageLabelText: {
        fontSize: 15,
        fontFamily: 'Urbanist-Medium',
        color: '#548DFF',
        textAlign: 'center',
        marginTop: 5,
    },
    selectedCollageText: {
        fontSize: 15,
        color: '#fff',
        fontFamily: 'Urbanist-Medium',
    },
    collageContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    collageItemContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5,
    },
    filterContainer: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    filterButton: {
        paddingHorizontal: 15,
        height: 40,
        marginHorizontal: 4,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#D0DFFF',
    },
    selectedFilterButton: {
        backgroundColor: '#548DFF',
    },
    filterButtonText: {
        fontSize: 14,
        fontFamily: 'Urbanist-Medium',
        color: '#fff',
    },
    selectedFilterTxt: {
        fontSize: 14,
        fontFamily: 'Urbanist-Medium',
        color: '#D0DFFF',
    },
    inputTxt: {
        fontFamily: 'Urbanist-Light',
        fontSize: 16,
        color: '#000',
        backgroundColor: '#fff',
        width: ScreenWidth * 0.95,
        marginVertical: 10,
    },
});