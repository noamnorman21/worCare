import { View, StyleSheet, Text, Image, TouchableOpacity, Dimensions, Modal, Alert, Platform } from 'react-native'
import { useState, useEffect } from 'react'
import ContactsList from '../HelpComponents/ContactsList';
import * as SMS from 'expo-sms';
import * as Linking from 'expo-linking';
import { auth, db } from '../../config/firebase'
import { collection, addDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut } from 'firebase/auth';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
import { useUserContext } from '../../UserContext';
import { Buffer } from 'buffer';


export default function NewPatientFinish({ navigation, route }) {
    const tblPatient = route.params.tblPatient;
    const [contactUser, setContactUser] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [contactVisible, setContactVisible] = useState(false);
    const [contactNumber, setContactNumber] = useState('');
    const [isAvailable, setIsAvailable] = useState(false);
    const [message, setMessage] = useState('');
    const [link, setLink] = useState('');
    const [fromShare, setFromShare] = useState(false);
    const { userContext } = useUserContext();


    const encryptPatientId = (patientId) => {
        const encodedId = Buffer.from(patientId).toString('base64');
        return encodedId;
    };

    // link to the specific screen in the app and send the patient id to the screen as a parameter
    // link to screen "Welcome" and send the patient id to the screen as a parameter
    useEffect(() => {
        (async () => {
            const encryptedPatientId = await encryptPatientId(tblPatient.patientId);
            setLink(Linking.createURL(`InvitedFrom/${encryptedPatientId}/${route.params.tblUser.FirstName}/${route.params.tblUser.Email}`));
            const isAvailable = await SMS.isAvailableAsync();
            setIsAvailable(isAvailable);
        }
        )();
    }, []);

    const btnSendSMS = async () => {
        if (isAvailable) {
            // do your SMS stuff here
            const { result } = await SMS.sendSMSAsync([contactNumber], message);
            if (Platform.OS === 'ios') {
                if (result === 'sent') {
                    // Alert.alert('Invitation sent \n\n We will notify you when your friend will join');
                    setFromShare(true);
                    Alert.alert('Invitation sent', 'We will notify you when your friend will join', [
                        {
                            text: "OK",
                            onPress: () => { setModalVisible(false), createNewPatient() },
                            style: "cancel"
                        },
                    ]);
                }
                else {
                    Alert.alert('Invitation Failed', 'Please try again', [
                        {
                            text: "OK",
                            style: "cancel"
                        },
                    ]);
                }
            }
            else {
                Alert.alert('Invitation sent', 'We will notify you when your friend will join', [
                    {
                        text: "OK",
                        onPress: () => { setModalVisible(false), createNewPatient() },
                        style: "cancel"
                    },
                ]);
            }
            // Alert.alert(result);
        } else {
            // misfortune... there's no SMS available on this device
            Alert.alert('SMS is not available on this device');
        }
    }

    const changeVisible = () => {
        setModalVisible(false);
        setContactVisible(true);
    }

    const sendVisible = () => {
        setContactVisible(false);
        setModalVisible(true);
    }

    const sendContact = (name, number) => {
        if (name === '' || number === '') {
            Alert.alert('Please fill all the fields');
        }
        // if name is only one word without space
        if (name.indexOf(' ') === -1) {
            console.log("1:", name);
            setContactUser(name);
        }
        else {
            console.log("2:", name.substring(0, name.indexOf(' ')));
            name = name.substring(0, name.indexOf(' '));
            setContactUser(name);
        }
        setContactNumber(number);
        setMessage("Hello " + name + ",\n\n" +
            "I would like to invite you to join worCare app.\n" +
            "Please click on the link below to download the app and join worCare.\n\n" +
            link +
            "\n\n" + "Thank you,\n" + "worCare Team."
        );
    }


    // InsertPatient
    const createNewPatient = () => {
        tblPatient.userId = userContext.userId;
        fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Patient/InsertPatient', { //send the patient data to the DB
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(tblPatient),
        })
            .then((response) => response.json())
            .then((json) => {
                addHobbiesAndLimitations()
            })
            .catch((error) => {
                console.error(error);
            }
            );
    }

    // InsertPatientHobbiesAndLimitations
    const addHobbiesAndLimitations = async () => {

        console.log(route.params.HobbiesAndLimitationsData)
        console.log("from share: ", fromShare)

        fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Patient/InsertPatientHobbiesAndLimitations', { //send the user data to the DB
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(route.params.HobbiesAndLimitationsData),
        })
            .then((response) => response.json())
            .then((json) => {
                if (!fromShare) {
                    Alert.alert(
                        "Great Job!",
                        "You have successfully Added a new patient!",
                        [
                            {
                                text: "OK",
                                onPress: () => navigation.navigate('CustomHeader', { tblUser: route.params.tblUser })
                            }
                        ],
                        { cancelable: false }
                    );
                    console.log(json)
                }
                else {
                    navigation.navigate('CustomHeader')
                }
            })
            .catch((error) => {
                console.error(error);
            }
            );
    }

    return (
        <View style={styles.container} >
            <View style={styles.headerContainer}>
                <Text style={styles.headerTxt}>Great Job!</Text>
            </View>

            <View style={styles.imgContainer}>
                <Image source={require('../../images/logo_New_Small.png')} style={styles.image} />
            </View>

            <View style={styles.bodyContainer}>
                <View style={styles.btnContainer}>
                    <TouchableOpacity
                        style={styles.buttonShare}
                        onPress={() => { setModalVisible(true) }}
                    >
                        <Text style={styles.btnShare}> Share My Code With Caregiver </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.btnContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={createNewPatient}
                    >
                        <Text style={styles.buttonText}>Add New Patient</Text>
                    </TouchableOpacity>
                    <View style={styles.legalTextContainer}>
                        <Text style={styles.legalText}>
                            By signing up {" "}
                            <Text style={styles.legalTextLink}>worCare</Text>
                            <Text style={styles.legalText}>, you agree to our </Text>
                            <Text style={styles.legalTextLink}>Terms Of Service</Text>{" "}
                            <Text style={styles.legalText}>and</Text>{" "}
                            <Text style={styles.legalTextLink}>Privacy Policy</Text>{" "}
                        </Text>
                    </View>
                </View>
            </View>

            <Modal visible={modalVisible} transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalHeader}>
                                <Image source={require('../../images/logo_New_Small.png')} style={styles.image} />
                                <Text style={styles.modalText}>Invite a Caregiver</Text>
                                <Text style={styles.modalSmallText}>
                                    Please invite a caregiver.
                                </Text>
                                <Text style={styles.modalSmallText}>
                                    Once they have joined, you will both be connected.
                                </Text>
                            </View>
                            <View style={styles.modalHeader}>
                                <TouchableOpacity style={styles.modalBtn1}
                                    onPress={changeVisible}
                                >
                                    <Text style={styles.modalBtnText}>
                                        {/* if contactUser different then '' write Choose Caregiver Contact */}
                                        {contactUser == '' ? 'Choose Caregiver Contact' : contactUser}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    disabled={contactUser == '' ? true : false}

                                    onPress={btnSendSMS}
                                    style={[styles.modalBtn2, contactUser == '' && styles.modalBtn2disabled]}>
                                    <Text style={styles.modalBtnText2}>Send Invitation</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Text style={styles.modalBtnText3}>Done</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

            <ContactsList sendVisible={sendVisible} contactVisible={contactVisible} sendContact={sendContact} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    bodyContainer: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerContainer: {
        flex: 1.5,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imgContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: SCREEN_WIDTH * 0.85,
        height: 54,
        backgroundColor: '#548DFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontFamily: 'Urbanist-Bold',
        fontSize: 16,
    },
    legalTextContainer: {
        marginVertical: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 35,
    },
    legalText: {
        fontFamily: 'Urbanist',
        fontSize: 14,
        color: '#000',
        textAlign: 'center',
    },
    legalTextLink: {
        fontFamily: 'Urbanist-SemiBold',
        fontSize: 14,
        color: '#548DFF',
    },
    buttonShare: {
        width: SCREEN_WIDTH * 0.85,
        height: 54,
        backgroundColor: '#F5F8FF',
        borderColor: '#548DFF',
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    btnShare: {
        color: '#548DFF',
        fontFamily: 'Urbanist-Bold',
        fontSize: 16,
    },
    image: {
        width: 128,
        height: 128,
        resizeMode: 'contain',
    },
    headerTxt: {
        fontFamily: 'Urbanist-Bold',
        fontSize: 30,
        color: '#000',
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // semi-transparent black color
    },
    modalContent: {
        paddingVertical: 20,
        width: SCREEN_WIDTH * 0.9,
        height: SCREEN_HEIGHT * 0.6,
        backgroundColor: 'rgba(0, 0, 0, 0.75)', // semi-transparent black color
        borderRadius: 16,
    },
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalText: {
        color: '#fff',
        fontFamily: 'Urbanist-Bold',
        fontSize: 24,
        textAlign: 'center',
        paddingTop: 20,
    },
    modalSmallText: {
        color: '#9E9E9E',
        fontFamily: 'Urbanist',
        fontSize: 13,
        textAlign: 'center',
        marginTop: 7,
    },
    image: {
        width: 70,
        height: 70,
        resizeMode: 'contain',
    },
    modalBtn1: {
        width: SCREEN_WIDTH * 0.75,
        height: 54,
        backgroundColor: '#000000B2',
        alignItems: 'center',
        borderColor: '#548DFF',
        borderWidth: 1.5,
        justifyContent: 'center',
        borderRadius: 16,
        marginVertical: 20,
    },
    modalBtn2: {
        width: SCREEN_WIDTH * 0.75,
        height: 54,
        backgroundColor: '#F5F8FF',
        borderColor: '#548DFF',
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 16,
        marginVertical: 10,
    },
    modalBtn2disabled: {
        opacity: 0.2,
    },
    modalBtnText1: {
        color: '#9E9E9E',
        fontFamily: 'Urbanist-Bold',
        fontSize: 13,
    },
    modalBtnText2: {
        color: '#000',
        fontFamily: 'Urbanist-Bold',
        fontSize: 17,
    },
    modalBtnText: {
        color: '#548DFF',
        fontFamily: 'Urbanist-Bold',
        fontSize: 17,
    },
    modalHeader: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalBtnText3: {
        color: '#548DFF',
        fontFamily: 'Urbanist-Bold',
        fontSize: 17,
        marginTop: 10,
        textDecorationLine: 'underline',
    },
});