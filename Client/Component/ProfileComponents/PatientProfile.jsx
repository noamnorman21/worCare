import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { Chip } from 'react-native-paper';
import { useUserContext } from '../../UserContext';
import { Feather, Fontisto, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const Tab = createMaterialTopTabNavigator();
const BUBBLE_SIZE = 80;
const CONTAINER_PADDING = 10;
import { LinearGradient } from 'expo-linear-gradient';

export default function PatientProfile() {
    const { userContext } = useUserContext();
    const patientData = userContext.patientData;
    const hobbiesAndLimitations = patientData.hobbiesAndLimitationsDTO;
    const birthDate = moment(patientData.DateOfBirth).format('DD/MM/YYYY');
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


    const [hobbies, setHobbies] = useState([]);
    useEffect(() => {
        hobbiesArr.forEach((hobbyObj) => {
            const hobbiesData = hobbiesAndLimitations[0][hobbyObj.key];
            if (hobbiesData) {
                const hobbyArr = hobbiesData.split(', ');
                hobbyArr.forEach((hobby) => {
                    const { icon, label } = hobbyObj;
                    setHobbies((prevHobbies) => [
                        ...prevHobbies,
                        { hobby, icon, label },
                    ]);
                });
            }
        });
    }, []);

    const [limitations, setLimitations] = useState([]);
    useEffect(() => {
        limitationsArr.forEach((limitationObj) => {
            const limitationsData = hobbiesAndLimitations[0][limitationObj.key];
            if (limitationsData) {
                const limitationArr = limitationsData.split(', ');
                limitationArr.forEach((limitation) => {
                    const { icon, label } = limitationObj;
                    setLimitations((prevLimitations) => [
                        ...prevLimitations,
                        { limitation, icon, label },
                    ]);
                });
            }
        });
    }, []);

    const HobbiesScreen = () => {
        return (
            <LinearGradient
                colors={['#6D9EFF50', '#548DFF']}
                style={styles.background}
            >
                <ScrollView contentContainerStyle={styles.collageContainer}>
                    {hobbies.map((h, index) => (
                        <View key={index} style={styles.collageItemContainer}>
                            <Chip
                                style={styles.collageBubble}
                                mode="outlined"
                            >
                                {h.icon}
                            </Chip>
                            <Text style={styles.collageLabelText}>{h.hobby}</Text>
                        </View>
                    ))}
                </ScrollView>
            </LinearGradient>
        );
    };

    const LimitationsScreen = () => {
        return (
            <LinearGradient
                colors={['#6D9EFF50', '#548DFF']}
                style={styles.background}
            >
                <ScrollView contentContainerStyle={styles.collageContainer}>
                    {limitations.map((l, index) => (
                        <View key={index} style={styles.collageItemContainer}>
                            <Chip
                                style={styles.collageBubble}
                                mode="outlined"
                            >
                                {l.icon}
                            </Chip>
                            <Text style={styles.collageLabelText}>{l.limitation}</Text>
                        </View>
                    ))}
                </ScrollView>
            </LinearGradient>
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
                        tabBarStyle: { backgroundColor: '#6D9EFF20' },
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
        backgroundColor: '#216BFF90',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    headerBlock: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D0DFFF',
        borderColor: '#548DFF',
        borderWidth: 1.5,
        borderRadius: 20,
        marginHorizontal: 5,
        // SHADOW EFFECT
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
    headerTxt: {
        fontSize: 20,
        fontFamily: 'Urbanist-Bold',
        textAlign: 'center',
        marginVertical: 10,
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
    collageLabelText: {
        fontSize: 15, // Adjust the font size as needed
        fontFamily: 'Urbanist-Medium',
        color: '#548DFF',
        textAlign: 'center',
        marginTop: 5, // Add a margin top to create space between icon and text
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
});