import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Button, ScrollView } from 'react-native';
import { Chip } from 'react-native-paper';
import { useUserContext } from '../../UserContext';
import { Feather, Fontisto, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

export default function PatientProfile() {
    const { userContext } = useUserContext();
    const patientData = userContext.patientData;
    const hobbiesAndLimitations = patientData.hobbiesAndLimitationsDTO;

    const hobbiesArr = [
        {
            key: 'TVShow',
            icon: <Feather name="tv" size={28} color="#548Dff" />,
            label: 'TV Show',
        },
        {
            key: 'afternoonNap',
            icon: <MaterialCommunityIcons name="sleep" size={28} color="#548Dff" />,
            label: 'Afternoon Nap',
        },
        {
            key: 'books',
            icon: <Feather name="book-open" size={28} color="#548Dff" />,
            label: 'Books',
        },
        {
            key: 'drink',
            icon: <Feather name="coffee" size={28} color="#548Dff" />,
            label: 'Drink',
        },
        {
            key: 'food',
            icon: <Feather name="gamepad" size={28} color="#548Dff" />,
            label: 'Food',
        },
        {
            key: 'movie',
            icon: <MaterialCommunityIcons name="movie" size={28} color="#548Dff" />,
            label: 'Movie',
        },
        {
            key: 'music',
            icon: <Feather name="music" size={28} color="#548Dff" />,
            label: 'Music',
        },
        {
            key: 'otherH',
            icon: <MaterialCommunityIcons name="human-handsup" size={28} color="#548Dff" />,
            label: 'Other Hobbies',
        },
        {
            key: 'radioChannel',
            icon: <Feather name="radio" size={28} color="#548Dff" />,
            label: 'Radio Channel',
        },
        {
            key: 'specialHabits',
            icon: <MaterialCommunityIcons name="human-handsup" size={28} color="#548Dff" />,
            label: 'Special Habits',
        },
    ];

    const limitationsArr = [
        {
            key: 'allergies',
            icon: <MaterialCommunityIcons name="allergy" size={28} color="#548Dff" />,
            label: 'Allergies',
        },
        {
            key: 'bathRoutine',
            icon: <MaterialCommunityIcons name="bathtub" size={28} color="#548Dff" />,
            label: 'Bath Routine',
        },
        {
            key: 'nightSleep',
            icon: <MaterialCommunityIcons name="sleep" size={28} color="#548Dff" />,
            label: 'Night Sleep',
        },
        {
            key: 'physicalAbilities',
            icon: <Fontisto name="paralysis-disability" size={28} color="#548Dff" />,
            label: 'Physical Abilities',
        },
        {
            key: 'sensitivities',
            icon: <MaterialIcons name="not-accessible" size={28} color="#548Dff" />,
            label: 'Sensitivities',
        },
        {
            key: 'sensitivityToNoise',
            icon: <MaterialCommunityIcons name="volume-high" size={28} color="#548Dff" />,
            label: 'Sensitivity to Noise',
        },
        {
            key: 'otherL',
            icon: <MaterialCommunityIcons name="human-handsup" size={28} color="#548Dff" />,
            label: 'Other Limitations',
        },
    ];

    const [hobbies, setHobbies] = useState([]);
    const [limitations, setLimitations] = useState([]);
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
    }, [hobbiesAndLimitations]);

    const getPatientData = () => {
        console.log('Patient Data');
        console.log(patientData);
        console.log('Hobbies and Limitations');
        console.log(hobbies);
        console.log(limitations);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerTxt}>Name: {patientData.FirstName}</Text>
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
                            onPress={() => console.log('Pressed')}
                        >
                            {l.icon}
                            {l.limitation}
                        </Chip>
                    ))}
                </View>
            </ScrollView>
            {/* Delete this button later */}
            <Button title="Get Patient Data" onPress={getPatientData} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerTxt: {
        fontSize: 20,
        fontFamily: 'Urbanist-Bold',
        textAlign: 'center',
        marginVertical: 20,
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
        height: 100,
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