import { View, StyleSheet, Text, Image, TouchableOpacity, Dimensions, Modal } from 'react-native'
import { useState } from 'react'

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function SignUpFinish({ navigation, route }) {
    const [modalVisible, setModalVisible] = useState(false);
    const tblHobbies = route.params.tblHobbies;
    const tblLimitations = route.params.tblLimitations;    

    const sendToDB = () => {
        console.log("Send to DB")
    }

    return (
        <View style={styles.container} >
            <View style={styles.headerContainer}>
                <Text style={styles.headerTxt}>Great Job!</Text>
            </View>

            <View style={styles.imgContainer}>
                <Image source={require('../../../images/logo_New_Small.png')} style={styles.image} />
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
                {/* <Text> Share your code with your friends and family to help them sign up. </Text> */}

                <View style={styles.btnContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={sendToDB}
                    >
                        <Text style={styles.buttonText}>Sign Up</Text>
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
                                <Image source={require('../../../images/logo_New_Small.png')} style={styles.image} />
                                <Text style={styles.modalText}>Invite a Caregiver</Text>
                                <Text style={styles.modalSmallText}>
                                    Please share this code with a caregiver.
                                </Text>
                                <Text style={styles.modalSmallText}>
                                    Once they have joined, you will both be connected.
                                </Text>
                            </View>
                            <View style={styles.modalHeader}>
                                <TouchableOpacity style={styles.modalBtn1}>
                                    <Text style={styles.modalBtnText}> YOURNAME-PATIENTID</Text>
                                    <Text style={styles.modalBtnText1}>Copy Code</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalBtn2}>
                                    <Text style={styles.modalBtnText2}>Share Code</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Text style={styles.modalBtnText3}>Done</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
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