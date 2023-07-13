import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, Dimensions, StyleSheet, Modal, Text, Alert, Linking } from 'react-native';
import { Octicons, Ionicons, AntDesign, Feather } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useUserContext } from '../UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { Button, Paragraph, Dialog, Portal, Provider } from 'react-native-paper';


import LogIn from './SignUpComponents/LogIn';
import SettingScreen from './SettingScreen';
import Contacts from './Contacts';
import PushNotifications from './PushNotifications';
import PatientProfile from './ProfileComponents/PatientProfile';

import Home from './Home';
import Finance from './Finance';
import Chats from './Chats';
import Tasks from './Tasks';
import Rights from './Rights';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('screen').width;

function CustomHeader() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { userContext, appEmail, logOutFireBase, UpdatePatient, patientList } = useUserContext();
    const { userUri, FirstName } = userContext;
    const [newUserDialogVisable, setNewUserDialogVisable] = useState(false);
    const [switchPatientDialogVisable, setSwitchPatientDialogVisable] = useState(false);
    const [patientArr, setPatientArr] = useState([])
    const navigation = useNavigation();
    const patientFirstName = userContext.patientData.FirstName.split(' ')[0];

    const navigateToSignUp = () => {
        AsyncStorage.removeItem("user");
        AsyncStorage.removeItem("userData");
        logOutFireBase()
        navigation.dispatch(StackActions.replace('SignUp', { userType: "User", patientId: undefined }))
    }

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    const togllePatiemtDialog = () => {
        if (patientList && patientList.length > 1) {
            setSwitchPatientDialogVisable(!switchPatientDialogVisable);
        }
    }

    if (!userContext) {
        return null;
    }

    //updates 
    useEffect(() => {
        if (patientList && patientList.length > 1) {
            let arr = patientList.map(element => {
                return (
                    <Button key={element.patientId} labelStyle={styles.dialogTxt} onPress={() => {
                        setSwitchPatientDialogVisable(false)
                        console.log(`patient: ${element.patientId}`)
                        switchPatient(element)
                        // navigation.navigate('NewPatientLvl1')
                    }}>{element.FirstName} {element.LastName}</Button>
                )
            });
            setPatientArr(arr)
        }
    }, [patientList])

    function switchPatient(patient) {
        let usertoSync = {
            userId: userContext.userId,
            userType: userContext.userType,
            FirstName: userContext.FirstName,
            LastName: userContext.LastName,
            Email: userContext.Email,
            phoneNum: userContext.phoneNum,
            userUri: userContext.userUri,
            gender: userContext.gender,
            workerId: userContext.workerId,//if user is a caregiver, this field will be same as userId
            involvedInId: userContext.userId,//if user is a not caregiver, this field will be same as userId
            patientId: userContext.patientId,
            calendarCode: userContext.calendarCode,
            CountryName_En: userContext.CountryName_En,
            patientHL: userContext.patientHL,
            patientData: userContext.patientData,
            pushToken: userContext.pushToken,
            pushToken2: userContext.pushTokenSecoundSide,
            notification: userContext.notification,
        }
        usertoSync.patientId = patient.patientId;
        if (usertoSync.userType == "User") {
            usertoSync.workerId = patient.workerId;
        }
        else {
            usertoSync.involvedInId = patient.userId;
        }
        usertoSync.patientData = patient;
        usertoSync.patientHL = patient.hobbiesAndLimitationsDTO;
        UpdatePatient(usertoSync)
    }

    return (
        <>
            <Stack.Navigator>
                <Stack.Screen
                    name="AppBarDown"
                    component={AppBarDown}
                    options={({ navigation }) => ({
                        title: ' ',
                        headerTitleAlign: 'center',
                        headerLeft: () => (
                            <View style={styles.headerLeft}>
                                <TouchableOpacity onPress={toggleModal}>
                                    <Feather name="menu" size={30} color="black" />
                                </TouchableOpacity>
                                <Modal
                                    visible={isModalVisible}
                                    animationType="fade"
                                    transparent={true}
                                    onRequestClose={toggleModal}
                                >
                                    <View style={styles.modalContainer}>
                                        <View style={styles.imgContainer}>
                                            <LinearGradient
                                                colors={['#87AFFF', '#7DA9FF', '#6D9EFF', '#548DFF']}
                                                style={styles.background}
                                            />
                                            <Image style={styles.image} source={{ uri: userUri }} />
                                            <Text style={styles.name}>Hello, {FirstName}</Text>
                                            <TouchableOpacity
                                                style={styles.switchUser}
                                                disabled={patientList && patientList.length > 1 ? false : true}
                                                onPress={() => {
                                                    toggleModal()
                                                    togllePatiemtDialog()
                                                }}>
                                                <AntDesign name="retweet" size={20} color={patientList && patientList.length > 1 ? "#216Bff" : "#808080"} />
                                                <Text style={patientList && patientList.length > 1 ? styles.switchTxt : styles.switchTxtDisabled}>
                                                    Switch Patient
                                                </Text>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={styles.closeButtonContainer}>
                                            <TouchableOpacity onPress={toggleModal}>
                                                <Feather name="x" size={32} color="#fff1e6" />
                                            </TouchableOpacity>
                                        </View>

                                        <TouchableOpacity onPress={
                                            () => {
                                                navigation.navigate('PatientProfile')
                                                toggleModal()
                                            }
                                        }>
                                            <View style={styles.menuItem}>
                                                <Feather name="user" size={30} color="#fff1e6" />
                                                <Text style={styles.menuItemText}>Patient Profile</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <View style={styles.line} />

                                        <TouchableOpacity onPress={() => {
                                            navigation.navigate('SettingScreen')
                                            toggleModal()
                                        }}>
                                            <View style={styles.menuItem}>
                                                <Feather name="settings" size={30} color="#fff1e6" />
                                                <Text style={styles.menuItemText}>Settings</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <View style={styles.line} />

                                        <TouchableOpacity onPress={
                                            () => {
                                                navigation.navigate('Contacts')
                                                toggleModal()
                                            }
                                        }>
                                            <View style={styles.menuItem}>
                                                <AntDesign name="contacts" size={30} color="#fff1e6" />
                                                <Text style={styles.menuItemText}>Contacts</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <View style={styles.line} />

                                        <TouchableOpacity onPress={
                                            () => {
                                                navigation.navigate('PushNotifications')
                                                toggleModal()
                                            }
                                        }>
                                            <View style={styles.menuItem}>
                                                <Feather name="bell" size={30} color="#fff1e6" />
                                                <Text style={styles.menuItemText}>Notifications</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <View style={styles.line} />
                                        

                                        <TouchableOpacity onPress={
                                            () => {
                                                userContext.userType === 'User' ?
                                                    setNewUserDialogVisable(true) :
                                                    setNewUserDialogVisable(false)
                                                toggleModal()
                                            }
                                        }>
                                            
                                            <View style={styles.menuItem}>
                                                <AntDesign name="adduser" size={30} color="#fff1e6" />
                                                <Text style={styles.menuItemText}>Add New Patient</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <View style={styles.line} />

                                        <TouchableOpacity onPress={
                                            () => {
                                                Linking.openURL(`mailto:${appEmail}`)
                                                toggleModal()
                                            }
                                        }>
                                            <View style={styles.menuItem}>
                                                <Feather name="mail" size={30} color="#fff1e6" />
                                                <Text style={styles.menuItemText}>Contact Us</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <View style={styles.line} />

                                        <TouchableOpacity onPress={
                                            async () => {
                                                toggleModal()
                                                AsyncStorage.removeItem("user");
                                                AsyncStorage.removeItem("userData");
                                                navigation.popToTop()
                                                logOutFireBase()
                                            }
                                        }>
                                            <View style={styles.menuItem}>
                                                <Feather name="log-out" size={30} color="#fff1e6" />
                                                <Text style={styles.menuItemText}>Log out</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </Modal>
                            </View>
                        ),
                        headerRight: () => (
                            <View style={styles.headerRight}>
                                <TouchableOpacity
                                    style={{ right: Dimensions.get('screen').width * 0.06 }}
                                    onPress={() => navigation.navigate('PushNotifications')}
                                >
                                    <Feather name="bell" size={28} color="#000000" />
                                </TouchableOpacity>
                            </View>
                        ),
                        headerTitle: () => (
                            <Image
                                source={require('../images/logo_New_Small.png')}
                                style={styles.headerLogo}
                            />
                        ),
                        unmountOnBlur: true,
                    })}
                />
                <Stack.Screen
                    name="PatientProfile"
                    component={PatientProfile}
                    options={() => ({
                        headerTitle: `${patientFirstName}'s Profile`,
                        presentation: 'modal',
                        cardOverlayEnabled: true,
                        headerShown: true,
                        headerTitleAlign: 'center',
                    })}
                />
                <Stack.Screen
                    name="SettingScreen"
                    component={SettingScreen}
                    options={() => ({
                        headerTitle: 'Settings',
                        presentation: 'stack',
                        cardOverlayEnabled: true,
                        headerShown: false,
                    })}
                />
                <Stack.Screen
                    name="PushNotifications"
                    component={PushNotifications}
                    options={() => ({
                        headerTitle: 'Notifications',
                        presentation: 'stack',
                        cardOverlayEnabled: true,
                    })}
                />
                <Stack.Screen
                    name="Contacts"
                    component={Contacts}
                    options={{ unmountOnBlur: true, headerShown: false }}
                />
                <Stack.Screen
                    name="LogIn"
                    component={LogIn}
                    options={{ unmountOnBlur: true, headerShown: false }}
                />
            </Stack.Navigator>
            <Dialog visible={newUserDialogVisable} onDismiss={() => setNewUserDialogVisable(false)}
                style={styles.dialogStyle}>
                <Dialog.Title style={styles.dialogTitle}>Choose User Type</Dialog.Title>
                <Dialog.Content>
                    <Paragraph style={{ fontFamily: 'Urbanist-Medium', fontSize: 18 }}>Do you want to create New Patient Profile?</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button labelStyle={styles.dialogTxt} onPress={() => {
                        setNewUserDialogVisable(false)
                        console.log('new patient')
                        navigation.navigate('NewPatientLvl1')
                    }}>New Patient</Button>
                    <Button labelStyle={styles.dialogTxt} onPress={() => {
                        setNewUserDialogVisable(false)
                    }}>Cancel</Button>
                </Dialog.Actions>
            </Dialog>
            <Dialog visible={switchPatientDialogVisable} onDismiss={() => setSwitchPatientDialogVisable(false)}
                style={styles.dialogStyle}>
                <Dialog.Title style={styles.dialogTitle}>Switch Patient</Dialog.Title>
                <Dialog.Content>
                    <Paragraph style={styles.dialpgParagraph}>Do you want to switch to another patient?</Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                    {patientArr}
                </Dialog.Actions>
            </Dialog>
        </>
    );
}

function AppBarDown() {
    const { newMessages } = useUserContext();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                activeTintColor: '#548DFF',
                inactiveTintColor: '#808080',
                style: styles.tabBar,
                tabBarIcon: ({ color, size }) => {
                    if (route.name === 'Home') {
                        return <Octicons name="home" size={size} color={color} />;
                    } else if (route.name === 'Finance') {
                        return <Octicons name="credit-card" size={size} color={color} />;
                    } else if (route.name === 'Chats') {
                        return <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />;
                    } else if (route.name === 'Tasks') {
                        return <Octicons name="checklist" size={size} color={color} />;
                    } else if (route.name === 'Rights') {
                        return <Octicons name="question" size={size} color={color} />;
                    }
                },
                headerShown: false,
                tabBarBadge: ((route) => {
                    if (route.name === 'Chats' && newMessages > 0) {
                        return newMessages;
                    }
                }
                )(route),
            })}
            initialRouteName="Home"
        >
            <Tab.Screen name="Home" component={Home} options={{ tabBarLabel: 'Home' }} />
            <Tab.Screen name="Finance" component={Finance} options={{ tabBarLabel: 'Finance', unmountOnBlur: true }} />
            <Tab.Screen
                name="Chats"
                component={Chats}
                options={({ route }) => ({
                    tabBarStyle: ((route) => {
                        const routeName = getFocusedRouteNameFromRoute(route) ?? '';
                        if (routeName === 'ChatRoom') {
                            return { display: 'none' };
                        }
                        return;
                    })(route),
                })}
            />
            <Tab.Screen name="Tasks" component={Tasks} options={{ tabBarLabel: 'Tasks', unmountOnBlur: true }} />
            <Tab.Screen name="Rights" component={Rights} options={{ tabBarLabel: 'Rights' }} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabBar: {
        backgroundColor: '#fff',
        paddingTop: 10
    },
    headerLeft: {
        marginTop: 5,
        marginLeft: Dimensions.get('screen').width * 0.05,
        flex: 1,
        justifyContent: 'space-between',
        alignContent: 'space-between'
    },
    headerRight: {
        marginTop: 5,
        flex: 1,
        justifyContent: 'space-between',
        alignContent: 'space-between'
    },
    headerLogo: {
        width: 50,
        height: 50,
        bottom: Dimensions.get('screen').height * 0.005,
        left: Dimensions.get('screen').width * 0.005
    },
    modalContainer: {
        width: SCREEN_WIDTH * 0.75,
        height: SCREEN_HEIGHT,
        paddingVertical: 25,

    },
    closeButtonContainer: {
        position: 'absolute',
        marginVertical: 10,
        left: 20,
        top: 40,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        paddingLeft: 20,
    },
    menuItemText: {
        fontFamily: 'Urbanist-Medium',
        fontSize: 18,
        marginHorizontal: 20,
        color: '#fff1e6',
    },
    image: {
        width: 75,
        height: 75,
        borderRadius: 50,
    },
    imgContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: SCREEN_HEIGHT * 0.05,
    },
    name: {
        fontSize: 20,
        color: '#fff1e6',
        marginVertical: 10,
        fontFamily: 'Urbanist-SemiBold',
    },
    background: {
        position: 'absolute',
        width: SCREEN_WIDTH * 0.75,
        height: SCREEN_HEIGHT * 2,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    line: {
        height: 1,
        width: '100%',
        backgroundColor: '#fff1e6',
        marginVertical: 10,
    },
    switchUser: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
    },
    switchTxt: {
        fontFamily: 'Urbanist-Bold',
        fontSize: 16,
        marginHorizontal: 10,
        color: '#216Bff',
    },
    switchTxtDisabled: {
        fontFamily: 'Urbanist-Bold',
        fontSize: 16,
        marginHorizontal: 10,
        color: '#808080',
    },
    dialogStyle: {
        backgroundColor: '#87AFFF',
    },
    dialogTxt: {
        fontFamily: 'Urbanist-SemiBold',
        color: '#000',
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

export { AppBarDown, CustomHeader };