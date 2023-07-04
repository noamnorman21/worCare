import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Chip } from 'react-native-paper';
import { useUserContext } from '../../UserContext';
import { Feather, Fontisto, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HobbiesJSON from '../SignUpComponents/User/Hobbies.json';
import LimitationsJSON from '../SignUpComponents/User/Limitations.json';
const Tab = createMaterialTopTabNavigator();
const BUBBLE_SIZE = 100;
const CONTAINER_PADDING = 10;

export default function PatientProfile() {
    const { userContext } = useUserContext();
    const patientData = userContext.patientData;
    const hobbiesAndLimitations = userContext.patientHL;
    const birthDate = moment(patientData.DateOfBirth).format('DD/MM/YYYY');
    const [selectedCategory, setSelectedCategory] = useState('TVShow');
    const [selectedHobbies, setSelectedHobby] = useState([]);
    // Hobbies
    const [hobbies, setHobbies] = useState([]);
    const [books, setBooks] = useState(HobbiesJSON.books);
    const [drink, setDrink] = useState(HobbiesJSON.drink);
    const [food, setFood] = useState(HobbiesJSON.food);
    const [movie, setMovie] = useState(HobbiesJSON.movie);
    const [music, setMusic] = useState(HobbiesJSON.music);
    const [radioChannel, setRadioChannel] = useState(HobbiesJSON.radioChannel);
    const [specialHabits, setSpecialHabits] = useState(HobbiesJSON.specialHabits);
    // Limitations
    const [limitations, setLimitations] = useState([]);
    const [allergies, setAllergies] = useState(LimitationsJSON.allergies);
    const [sensitivities, setSensitivities] = useState(LimitationsJSON.sensitivities);
    const [physicalAbilities, setPhysicalAbilities] = useState(LimitationsJSON.physicalAbilities);
    const [bathRoutine, setBathRoutine] = useState(LimitationsJSON.bathRoutine);

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

    useEffect(() => {
        // console.log(books);
        const updatedLimitations = [];
        limitationsArr.forEach((limitationObj) => {
            const limitationsData = hobbiesAndLimitations[0][limitationObj.key];
            console.log("limitationsss",limitationObj.key,limitationsData);
            if (limitationsData) {
                const limitationArr = limitationsData.split(', ');
                limitationArr.forEach((limitation) => {
                    const { icon, label } = limitationObj;
                    updatedLimitations.push({ limitation, icon, label });
                });
            }
        });
        setLimitations(updatedLimitations);
    }, [hobbiesAndLimitations]);

    useEffect(() => {
        const updatedHobbies = [];

        // hobbiesArr.forEach((hobbyObj) => {
        //     const hobbiesData = hobbiesAndLimitations[0][hobbyObj.key];
        //     if (hobbiesData) {
        //         const hobbyArr = hobbiesData.split(', ');
        //         hobbyArr.forEach((hobby) => {
        //             const { icon, label } = hobbyObj;
        //             if (HobbiesJSON[hobbyObj.key]) {
        //                 for (const h of HobbiesJSON[hobbyObj.key]) {
        //                     console.log(h.name)
        //                     // console.log(h);
        //                     if (hobbiesData.includes(h.name)) {
        //                         console.log(true);
        //                         hobbiesArr[hobbyObj.key].selected = true;
        //                         // updatedHobbies.push({ name: hobby, icon, label, selected: true, ...h });
        //                         break; // exit the loop once a match is found
        //                     }
        //                 }
        //             }
        //         });
        //     } else {
        //         updatedHobbies.push({ name: hobbyObj.key, icon: hobbyObj.icon, label: hobbyObj.label, selected: false });
        //     }
        // });

        setHobbies(updatedHobbies);
    }, [hobbiesAndLimitations, selectedCategory, selectedHobbies]);

    useEffect(() => {
        const categoryHobbies = HobbiesJSON[selectedCategory];
        setSelectedHobby(categoryHobbies ? categoryHobbies.map((hobby) => ({ ...hobby, selected: false })) : []);
    }, [selectedCategory]);

    const handleHobbyToggle = (hobby) => {
        console.log(hobbies);
    };

    const HobbiesScreen = () => {
        return (
            <View>
                <ScrollView horizontal contentContainerStyle={styles.filterContainer}>
                    {hobbiesArr.map((category, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.filterButtonText,
                                selectedCategory === category.key && styles.selectedFilterTxt,
                            ]}
                            onPress={() => setSelectedCategory(category.key)}
                        >
                            <View
                                key={index}
                                style={[
                                    styles.filterButton,
                                    selectedCategory === category.key && styles.selectedFilterButton,
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
                        selectedCategory && HobbiesJSON[selectedCategory] &&
                        HobbiesJSON[selectedCategory].map((hobby, index) => {
                            return (
                                <TouchableOpacity
                                    style={[styles.collageItemContainer, hobbiesAndLimitations[0][selectedCategory].includes(hobby.name) ? styles.selectedCollageBubble : null]}
                                    onPress={() =>{console.log("pressed") ;handleHobbyToggle(hobby)}}
                                    key={index}
                                >
                                    <View key={index} style={hobbiesAndLimitations[0][selectedCategory].includes(hobby.name) ?styles.selectecollageBubble:styles.collageBubble}>
                                        <Text style={hobbiesAndLimitations[0][selectedCategory].includes(hobby.name) ? styles.selectedCollageText : styles.collageText}>{hobby.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                </ScrollView>
            </View>
        );
    };

    const LimitationsScreen = () => {
        const [selectedFilter, setSelectedFilter] = useState('allergies');

        // Filter the limitations array based on the selected filter
        const filteredLimitations = selectedFilter === 'allergies'
            ? limitations
            : limitations.filter((l) => l.key === selectedFilter);

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
                    {/* {filteredLimitations.map((l, index) => (
                        <View key={index} style={styles.collageItemContainer}>
                            <Chip key={index} style={styles.collageBubble} mode="outlined">
                                {l.icon}
                            </Chip>
                            <Text style={styles.collageLabelText}>{l.limitation}</Text>
                        </View>
                    ))} */}
                    {/*version without icon- render according to category */}
                    {
                        LimitationsJSON[selectedFilter] && LimitationsJSON[selectedFilter].map((limitation, index) => {
                            return (
                                <TouchableOpacity
                                    style={[styles.collageItemContainer, hobbiesAndLimitations[0][selectedFilter].includes(limitation.name) ? styles.selectedCollageBubble : null]}
                                    onPress={() =>{console.log("pressed") ;handleHobbyToggle(limitation)}}
                                    key={index}
                                >
                                    <View key={index} style={hobbiesAndLimitations[0][selectedFilter].includes(limitation.name) ?styles.selectedCollageBubble:styles.collageBubble}>
                                        <Text style={hobbiesAndLimitations[0][selectedFilter].includes(limitation.name) ? styles.selectedCollageText : styles.collageText}>{limitation.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                        
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
    },
    collageBubble: {
        width: BUBBLE_SIZE,
        height: BUBBLE_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
        margin: CONTAINER_PADDING / 4,
        borderRadius: BUBBLE_SIZE / 2,
        backgroundColor: '#D0DFFF',
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
        borderColor: '#548DFF',
        borderWidth: 1.5,
    },
    collageLabelText: {
        fontSize: 15,
        fontFamily: 'Urbanist-Medium',
        color: '#548DFF',
        textAlign: 'center',
        marginTop: 5,
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
        color: '#548DFF',
    },
    selectedFilterTxt: {
        fontSize: 14,
        fontFamily: 'Urbanist-Medium',
        color: '#D0DFFF',
    },
});