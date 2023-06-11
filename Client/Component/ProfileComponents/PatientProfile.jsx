import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';
import { useUserContext } from '../../UserContext';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export default function PatientProfile() {
    const { userContext } = useUserContext();
    const { patientId, userLimitations } = userContext;

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerTxt}>Name: {patientId}</Text>
            <Text style={styles.headerTxt}>Hobbies</Text>
            <View style={styles.chipsContainer}>
                <Chip
                    textStyle={styles.chipTxt}
                    style={styles.chip}
                    mode="outlined"
                    onPress={() => console.log('Pressed')}>
                    <Feather
                        name="book-open"
                        size={16}
                        color="#548Dff"
                    />
                    Action
                </Chip>
                <Chip style={styles.chip} textStyle={styles.chipTxt} mode="outlined" onPress={() => console.log('Pressed')}>
                    <Feather
                        name="book-open"
                        size={16}
                        color="#548Dff"
                    />
                    Romantic
                </Chip>
                <Chip style={styles.chip} textStyle={styles.chipTxt} mode="outlined" onPress={() => console.log('Pressed')}>
                    <Feather
                        name="book-open"
                        size={16}
                        color="#548Dff"
                    />
                    Drama
                </Chip>
            </View>
            <Text style={styles.headerTxt}>Limitations</Text>
            <View style={styles.chipsContainer}>

                <Chip style={styles.chip} textStyle={styles.chipTxt} mode="outlined" onPress={() => console.log('Pressed')}>
                    <MaterialCommunityIcons name="peanut-off-outline" size={16} color="#548Dff" />
                    Peanuts
                </Chip>
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // justifyContent: 'center',
        // alignItems: 'center',
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
        height: 36,
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
