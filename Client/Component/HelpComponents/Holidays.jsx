import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native'
import { useState, useEffect } from 'react'
import * as Font from 'expo-font';
Font.loadAsync({
    'Urbanist': require('../../assets/fonts/Urbanist-Regular.ttf'),
    'Urbanist-Bold': require('../../assets/fonts/Urbanist-Bold.ttf'),
    'Urbanist-Light': require('../../assets/fonts/Urbanist-Light.ttf'),
    'Urbanist-Medium': require('../../assets/fonts/Urbanist-Medium.ttf'),
    'Urbanist-SemiBold': require('../../assets/fonts/Urbanist-SemiBold.ttf'),
});
const SCREEN_WIDTH = Dimensions.get('window').width;
export default function Holidays(props) {
    const [selectedHolidays, setSelectedHolidays] = useState([]);

    const isItemSelected = (id) => {
        return selectedHolidays.includes(id);
    };

    const handleItemPress = (item) => {
        if (selectedHolidays.includes(item.id)) {
            setSelectedHolidays(selectedHolidays.filter((id) => id !== item.id));
        } else {
            setSelectedHolidays([...selectedHolidays, item.id]);
        }
        props.sendHolidays(selectedHolidays);
    };

    return (
        <>
            <View style={styles.headerContainer}>
                {/* Line */}
                <View style={styles.line} />
                <Text style={styles.headerSmallTxt}>Choose your preference global </Text>
                <Text style={styles.headerSmallTxt}>religious holidays</Text>
            </View>

            <ScrollView>
                <View style={styles.bodyContainer}>
                    {props.holidaysType.map((item, index) => {
                        const selectedStyle = isItemSelected(item.id) ? styles.selectedItem : {};
                        return (
                            <TouchableOpacity onPress={() => handleItemPress(item)}>
                                <View style={[styles.itemBox, selectedStyle]} key={index}>
                                    <Text style={styles.item}>{item.label}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: '#fff',
    },
    headerSmallTxt: {
        fontFamily: 'Urbanist-SemiBold',
        fontSize: 20,
        color: '#000',
        textAlign: 'center',
        marginBottom: 10,
    },
    line: {
        borderBottomColor: '#808080',
        borderBottomWidth: 0.5,
        marginVertical: 10,
    },
    bodyContainer: {
        // height: 300,
        // backgroundColor: 'red',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        paddingVertical: 10,
    },
    itemBox: {
        width: SCREEN_WIDTH * 0.45,
        height: 45,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#E6EBF2',
        marginVertical: 7,
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        fontFamily: 'Urbanist-Medium',
        fontSize: 16,
        color: '#000',
        textAlign: 'center',
    },
    selectedItem: {
        borderColor: "#548DFF",
    },
});