import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Button, ScrollView } from 'react-native';
import { Chip } from 'react-native-paper';
import { useUserContext } from '../../UserContext';
import { Feather, Fontisto, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import moment from "moment";

export default function PatientProfile() {
    const { userContext } = useUserContext();
    const patientData = userContext.patientData;
    const hobbiesAndLimitations = patientData.hobbiesAndLimitationsDTO;
    // DateOfBirth , languange, ID 
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

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerTxt}>Name: {patientData.FirstName}</Text>
            <View style={styles.headerData}>
                <View style={styles.headerBlock}>
                    <Text style={styles.headerTxtSM}>Date of Birth</Text>
                    <Text style={styles.headerTxtSM}>{birthDate}</Text>
                </View>
                <View style={styles.headerBlock}>
                    <Text style={styles.headerTxtSM}>Language</Text>
                    <Text style={styles.headerTxtSM}>{patientData.LanguageName_En}</Text>
                </View>
                <View style={styles.headerBlock}>
                    <Text style={styles.headerTxtSM}>ID</Text>
                    <Text style={styles.headerTxtSM}>{patientData.patientId}</Text>
                </View>
            </View>

            <Text style={styles.headerTxt}>Hobbies</Text>
            <ScrollView horizontal={true} style={{ marginHorizontal: 5 }}>
                <View style={styles.chipsContainer}>
                    {hobbies.map((h, index) => (
                        <Chip
                            key={index}
                            textStyle={styles.chipTxt}
                            style={styles.chip}
                            mode="outlined"
                            onPress={() => console.log('Pressed')}
                        >
                            {h.icon}
                            {h.hobby}
                        </Chip>
                    ))}
                </View>
            </ScrollView>
            <Text style={styles.headerTxt}>Limitations</Text>
            <ScrollView horizontal={true} style={{ marginHorizontal: 5 }}>
                <View style={styles.chipsContainer}>
                    {limitations.map((l, index) => (
                        <Chip
                            key={index}
                            textStyle={styles.chipTxt}
                            style={styles.chip}
                            mode="outlined"
                            onPress={() => console.log(patientData)}
                        >
                            {l.icon}
                            {l.limitation}
                        </Chip>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerBlock: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#548DFF',
        borderWidth: 1,
        borderRadius: 10,
    },
    headerData: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: 10,
    },
    headerTxtSM: {
        fontSize: 16,
        fontFamily: 'Urbanist-Medium',
        textAlign: 'center',
        padding: 10,
    },
    headerTxt: {
        fontSize: 20,
        fontFamily: 'Urbanist-Bold',
        textAlign: 'center',
        marginVertical: 10,
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    chip: {
        marginVertical: 8,
        marginHorizontal: 8,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D0DFFF',
        borderColor: '#548DFF',
        borderWidth: 1.5,
    },
    chipTxt: {
        fontFamily: 'Urbanist-Medium',
        fontSize: 16,
        color: '#548DFF',
    },
});