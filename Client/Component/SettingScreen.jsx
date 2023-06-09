import { StyleSheet, View, Text, Alert, SafeAreaView, TouchableOpacity, Dimensions, Image, LogBox, TextInput, Modal, Linking } from 'react-native'
import React, { useState, useEffect } from 'react'
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useUserContext } from '../UserContext';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../config/firebase';
import * as ImagePicker from 'expo-image-picker';
import Privacy from './SettingsComponents/Privacy'
import GenderChange from './SettingsComponents/GenderChange';

const Stack = createNativeStackNavigator();
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

function HomeScreen({ navigation, route }) {
    const [userImg, setUserImg] = useState(null);
    const [userName, setUserName] = useState(null);
    const [userEmail, setuserEmail] = useState(null);
    const [userId, setUserId] = useState(null);
    const isFocused = useIsFocused();
    const { userContext, setUserContext, updateUserProfile } = useUserContext();
    const [user, setUser] = useState(userContext);
    const [isChanged, setIsChanged] = useState(false);
    const [ImageChange, setImageChange] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [saving, setSaving] = useState(false);

    LogBox.ignoreLogs([
        'Non-serializable values were found in the navigation state',
    ]);

    useEffect(() => {
        const getData = async () => {
            try {
                setUserName(userContext.FirstName);
                setuserEmail(userContext.Email);
                setUserImg(userContext.userUri);
                setUserId(userContext.UserId);
            } catch (e) {
                console.log('error', e);
            }
        };
        getData();
    }, [isFocused]);

    const sendToFirebase = async (image) => {
        // if the user didn't upload an image, we will use the default image
        if (userImg === null) {
            //זה תמונה מכוערת -נועם תחליף אותה
            let defultImage = "https://png.pngtree.com/element_our/20200610/ourmid/pngtree-character-default-avatar-image_2237203.jpg"
            sendDataToNextDB(defultImage);
        }
        const filename = image.substring(image.lastIndexOf('/') + 1);
        const storageRef = ref(storage, "images/" + filename);
        const blob = await fetch(image).then(response => response.blob());
        try {
            const uploadTask = uploadBytesResumable(storageRef, blob);
            uploadTask.on('state_changed',
                snapshot => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% complete`);
                },
                error => {
                    console.error(error);
                    Alert.alert('Upload Error', 'Sorry, there was an error uploading your image. Please try again later.');
                },
                () => {
                    getDownloadURL(storageRef).then(downloadURL => {
                        console.log('File available at', downloadURL);
                        sendDataToNextDB(downloadURL);
                    });
                }
            );
        } catch (error) {
            console.error(error);
            Alert.alert('Upload Error', 'Sorry, there was an error uploading your image. Please try again later.');
            sendDataToNextDB();
        }
    }

    const updateuserEmail = (newEmail) => {
        setuserEmail(newEmail);
    }

    const displayGender = () => {
        if (user.gender == "M") {
            return "Male"
        }
        else if (user.gender == "F") {
            return "Female"
        }
        else {
            return "Other"
        }
    }

    const sendDataToNextDB = (downloadURL) => {
        const userToUpdate = {
            Email: userEmail,
            userUri: downloadURL == null ? userContext.userUri : downloadURL,
            phoneNum: user.phoneNum,
            gender: user.gender,
            FirstName: user.FirstName,
            LastName: user.LastName,
            userId: userContext.userId,
            userType: userContext.userType,
            workerId: userContext.workerId,//if user is a caregiver, this field will be same as userId
            involvedInId: userContext.involvedInId,//if user is a not caregiver, this field will be same as userId
            patientId: userContext.patientId,
        }
        if (userToUpdate.phoneNum != userContext.phoneNum) {
            fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/User/GetPhoneNum', {
                method: 'POST',
                body: JSON.stringify(userToUpdate),
                headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                })
            })
                .then(res => {
                    if (res.ok) {
                        updateUserProfile(userToUpdate);
                        route.params.Exit();
                    }
                    else {
                        Alert.alert('Phone Already in system', 'Please enter a different phone number');
                    }
                })
        }
        else {
            updateUserProfile(userToUpdate);
            route.params.Exit();
        }
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setUser({ ...user, ["userUri"]: result.assets[0].uri })
            setImageChange(true)
            setIsChanged(true);
        }
    }

    const cancelChanges = () => {
        if (isChanged)
            Alert.alert(
                "Cancel Changes",
                "Are you sure you want leave without Saving?",
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel"
                    },
                    { text: "OK", onPress: () => route.params.Exit() }
                ],
                { cancelable: false }
            )
        else
            route.params.Exit()
    }

    useEffect(() => {
        console.log("saving", isChanged);
        if (saving && isChanged) {
            if (ImageChange) {
                sendToFirebase(user.userUri);
            }
            else {
                sendDataToNextDB();
            }
        }
        else if (saving && !isChanged) {
            console.log("no changes");
            route.params.Exit();
        }
    }, [saving]);

    useEffect(() => {
        const setNavigation = async () => navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={styles.headerButton} onPress={() => setSaving(true)}>
                    <Text style={styles.headerButtonText}>Done</Text>
                </TouchableOpacity>
            ),
            headerLeft: () => (
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={cancelChanges}>
                        <Ionicons name="chevron-back" size={28} color="black" />
                    </TouchableOpacity>
                </View>
            ),
        });
        setNavigation();
    }, [navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.imgContainer}>
                <TouchableOpacity onPress={() => pickImage()}>
                    <Image style={styles.image} source={{ uri: user.userUri }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => pickImage()}>
                    <Text style={styles.imageTxt}>Edit profile picture</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.fieldView} >
                <Text style={styles.fieldHeader}>First Name</Text>
                <TextInput style={styles.fields} value={user.FirstName} onChangeText={(value) => { setUser({ ...user, ["FirstName"]: value }); setIsChanged(true) }} />
            </View>
            <View style={styles.fieldView} >
                <Text style={styles.fieldHeader}>Last Name</Text>
                <TextInput style={styles.fields} value={user.LastName} onChangeText={(value) => { setUser({ ...user, ["LastName"]: value }); setIsChanged(true) }} />
            </View>
            <View style={styles.fieldView} >
                <Text style={styles.fieldHeader}>Phone Number</Text>
                <TextInput keyboardType='numeric' style={styles.fields} value={user.phoneNum} onChangeText={(value) => { setUser({ ...user, ["phoneNum"]: value }); setIsChanged(true) }} />
            </View>
            <View style={styles.fieldView} >
                <Text style={styles.fieldHeader}>Gender</Text>
                <TouchableOpacity underlayColor={'lightgrey'} style={styles.fields} onPress={() => setModalVisible(true)}>
                    <Text style={styles.fieldTxt}>{displayGender()}</Text>
                    <Ionicons style={styles.arrowLogoStyle} name="chevron-forward" size={24} color="grey" />
                </TouchableOpacity>
                <Modal animationType="slide" visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                    <GenderChange userId={user.userId} Gender={user.gender} cancel={() => setModalVisible(false)} Save={(Gender) => { setModalVisible(false); setUser({ ...user, ["gender"]: Gender }); setIsChanged(true) }} />
                </Modal>
            </View>
            <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Privacy', { updateuserEmail: (value) => { updateuserEmail(value) } })}>
                    <Text style={styles.btnText}>Privacy & My Account</Text>
                    <Ionicons style={styles.arrowLogoStyle} name="chevron-forward" size={24} color="grey" />
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.btn} onPress={() => optionsToEmail()}>
                    <Text style={styles.btnText}>Contact Us</Text>
                    <Ionicons style={styles.arrowLogoStyle} name="chevron-forward" size={24} color="grey" />
                </TouchableOpacity> */}
            </View>
        </SafeAreaView>
    );
}

export default function SettingScreen({ navigation }) {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator
                screenOptions={{
                    //this is the animation for the navigation
                    animation: 'slide_from_right',
                    headerBlurEffect: 'light',
                    headerTintColor: '#548DFF',
                    headerTitleStyle: {
                        fontSize: 18,
                        color: 'black',
                        paddingLeft: 10,
                    },
                    headerShown: true,
                }}>
                <Stack.Screen name="Settings" component={HomeScreen} options={() => ({ headerTitle: 'Settings', headerShown: true, headerTitleAlign: 'center' })} initialParams={{ logout: () => { navigation.dispatch(StackActions.replace('LogIn')) }, Exit: () => navigation.navigate('AppBarDown') }} />
                <Stack.Screen name="Privacy" component={Privacy} options={{ headerTitle: 'Privacy & My Account', headerTitleAlign: 'center', headerShown: true }} initialParams={{ logout: () => { navigation.dispatch(StackActions.replace('LogIn')) } }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    imgContainer: {
        alignItems: 'center',
        marginVertical: SCREEN_HEIGHT * 0.04,
    },
    imageTxt: {
        color: '#548DFF',
        fontFamily: 'Urbanist-SemiBold',
        fontSize: 16,
        marginVertical: 10,
    },
    logoStyle: {
        paddingHorizontal: 10,
    },
    arrowLogoStyle: {
        position: 'absolute',
        right: SCREEN_WIDTH * 0.03,
    },
    headerButton: {
        width: SCREEN_WIDTH * 0.1,
        height: SCREEN_HEIGHT * 0.05,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnContainer: {
        flex: 4,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 100,
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: SCREEN_WIDTH * 1,
        marginVertical: 20,
    },
    btnText: {
        paddingLeft: 10,
        fontSize: 16,
        fontFamily: 'Urbanist-SemiBold',
    },
    headerButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerButtonText: {
        color: '#548DFF',
        fontFamily: 'Urbanist-SemiBold',
        fontSize: 16,
    },
    fieldTxt: {
        fontSize: 16,
        color: '#000',
        fontFamily: 'Urbanist-Light',
    },
    fieldHeader: {
        fontSize: 16,
        fontFamily: 'Urbanist-SemiBold',
        color: '#000',
        paddingLeft: 10,
        flex: 2,
        marginVertical: 15,
    },
    fieldView: {
        flexDirection: 'row',
    },
    fields: {
        justifyContent: 'center',
        flex: 3.75,
        borderRadius: 16,
        borderBottomWidth: 1,
        borderColor: 'lightgrey',
        paddingLeft: 10,
        marginVertical: 15,
        paddingBottom: 3,
        fontSize: 16,
        color: '#000',
        fontFamily: 'Urbanist-Light',
    },
});