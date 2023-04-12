// External imports:
import { StyleSheet, View, Text, Alert, SafeAreaView, TouchableOpacity, Dimensions, Image, LogBox, TextInput, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AntDesign, Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { useUserContext } from '../UserContext';
import { Octicons } from '@expo/vector-icons';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../config/firebase';
import * as ImagePicker from 'expo-image-picker';



// Internal imports:
import Profile from './SettingsComponents/Profile'
import Notifications from './SettingsComponents/Notifications'
import Privacy from './SettingsComponents/Privacy'
import GenderChange from './SettingsComponents/GenderChange';
import ContactUs from './SettingsComponents/ContactUs'
import ImageChange from './SettingsComponents/ImageChange'


const Stack = createNativeStackNavigator();
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

//this is the Setting Main screen, 
//need to add the personal setting (יצירת פרופיל)
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

    LogBox.ignoreLogs([
        'Non-serializable values were found in the navigation state',
    ]);

    useEffect(() => {
        const getData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('userData');
                const userData = jsonValue != null ? JSON.parse(jsonValue) : null;
                setUserName(userContext.FirstName);
                setuserEmail(userData.Email);
                setUserImg(userData.userUri);
                setUserId(userData.UserId);
            } catch (e) {
                console.log('error', e);
            }
        };
        getData();
    }, [isFocused]);

    const sendToFirebase = async (image) => {
        console.log('image', image);
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
        console.log("sendDataToNextDB");
        console.log("user", user);
        console.log("downloadURL", downloadURL);
        const userToUpdate = {
            Email: user.Email,
            userUri: downloadURL == null ? user.userUri : downloadURL,
            phoneNum: user.phoneNum,
            gender: user.gender,
            FirstName: user.FirstName,
            LastName: user.LastName,
            userId: user.userId,
            userType: user.userType
        }
        console.log("userToUpdate", userToUpdate);
        updateUserProfile(userToUpdate);
        route.params.Exit();
    }

    const updateUser = (Field, value) => {
        setIsChanged(true);
        if (Field === "userUri") {
            Alert.alert("התמונה עודכנה בהצלחה");
            setImageChange(true);
        }
        setUser({ ...user, [Field]: value });
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
         setUser({...user,["userUri"]:result.assets[0].uri})
          setImageChange(true)
        }
      }


    useEffect(() => {
        const setNavigation = async () => navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={styles.headerButton} onPress={() => (ImageChange ? sendToFirebase(user.userUri) : sendDataToNextDB())}>
                    <Text style={styles.headerButtonText}>Done</Text>
                </TouchableOpacity>
            ),
            headerLeft: () => (
                <View style={styles.headerLeft}>
                    <TouchableOpacity
                        onPress={() => Alert.alert(
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
                        )}         >
                        <Ionicons name="chevron-back" size={28} color="black" />
                    </TouchableOpacity>
                </View>
            ),
        });
        console.log("setnavigations")
        setNavigation();
    }, [user, isFocused]);

    //the user name will be taken from the database
    //the user image will be taken from the database
    return (
        <SafeAreaView style={styles.container}>
            {/* <Profile updateUser={(Field, value) => updateUser(Field, value)} /> */}
            <TouchableOpacity onPress={() => pickImage()}>
                <Image style={styles.image} source={{ uri: user.userUri }} />
            </TouchableOpacity>
            <View style={styles.fieldView} >
                <Text style={styles.fieldHeader}>First Name</Text>
                <TextInput style={styles.fields} value={user.FirstName} onChangeText={(value) => setUser({ ...user, ["FirstName"]: value })} />
            </View>
            <View style={styles.fieldView} >
                <Text style={styles.fieldHeader}>Last Name</Text>
                <TextInput style={styles.fields} value={user.LastName} onChangeText={(value) => setUser({ ...user, ["LastName"]: value })} />
            </View>
            <View style={styles.fieldView} >
                <Text style={styles.fieldHeader}>Phone Number</Text>
                <TextInput keyboardType='numeric' style={styles.fields} value={user.phoneNum} onChangeText={(value) => setUser({ ...user, ["phoneNum"]: value })} />
            </View>
            <View style={styles.fieldView} >
                <Text style={styles.fieldHeader}>Gender</Text>
                <TouchableOpacity underlayColor={'lightgrey'} style={styles.fields} onPress={() => setModalVisible(true)}>
                    <Text style={styles.fieldTxt}>{displayGender()}</Text>
                    <Ionicons style={styles.arrowLogoStyle} name="chevron-forward" size={24} color="grey" />
                </TouchableOpacity>
                <Modal animationType="slide" visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                    <GenderChange userId={user.userId} Gender={user.gender} cancel={() => setModalVisible(false)} Save={(Gender) => { setModalVisible(false); setUser({ ...user, ["gender"]: Gender }) }} />
                </Modal>
            </View>


            <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Privacy', { updateUser: (Field, Value) => updateUser(Field, Value) })}>
                    <Text style={styles.btnText}>Privacy & My Account</Text>
                    <Ionicons style={styles.arrowLogoStyle} name="chevron-forward" size={24} color="grey" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('ContactUs', { userImg: userImg })}>
                    <Text style={styles.btnText}>Contact Us</Text>
                    <Ionicons style={styles.arrowLogoStyle} name="chevron-forward" size={24} color="grey" />
                </TouchableOpacity>
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
                        marginLeft: SCREEN_WIDTH * 0.03,
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
    ColorBtnContainer: {
        justifyContent: 'space-between',
        width: SCREEN_WIDTH * 0.95,
        marginTop: SCREEN_HEIGHT * 0.06,
    },
    colorBtn1: {
        backgroundColor: '#548DFF',
        width: SCREEN_WIDTH * 0.95,
        height: 54,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    colorBtn2: {
        width: SCREEN_WIDTH * 0.95,
        height: 54,
        borderRadius: 16,
        borderWidth: 1.5,
        backgroundColor: '#F5F8FF',
        borderColor: '#548DFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SCREEN_HEIGHT * 0.02,
    },
    logoStyle: {
        marginLeft: SCREEN_WIDTH * 0.03,
        marginRight: SCREEN_WIDTH * 0.06
    },
    arrowLogoStyle: {
        position: 'absolute',
        right: SCREEN_WIDTH * 0.03,
    },
    title: {
        //the title, it will be on the left side of the screen,just above the image
        fontSize: 25,
        marginLeft: SCREEN_WIDTH * 0.03,
        marginRight: SCREEN_WIDTH * 0.6,
        marginTop: SCREEN_HEIGHT * 0.03,
        fontFamily: 'Urbanist-Bold'
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
    personalContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        width: SCREEN_WIDTH * 1,
        // paddingVertical: SCREEN_HEIGHT * 0.04,
    },
    imageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: SCREEN_WIDTH * 0.0,
        marginTop: SCREEN_HEIGHT * 0.02,
    },
    personalText: {
        fontSize: 25,
        marginRight: SCREEN_WIDTH * 0.03,
        marginLeft: SCREEN_WIDTH * 0.03,
        fontFamily: 'Urbanist-Bold',
    },
    logo: {
        width: SCREEN_WIDTH * 0.2,
        height: SCREEN_HEIGHT * 0.1,
        borderRadius: 100,
        backgroundColor: 'transparent',
        marginRight: SCREEN_WIDTH * 0.03,
        marginTop: SCREEN_HEIGHT * 0.03,
        marginBottom: SCREEN_HEIGHT * 0.0,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 100,
        marginTop: 20,
      },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: SCREEN_WIDTH * 1,
        height: SCREEN_HEIGHT * 0.08,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
    },
    btnText: {
        marginLeft: SCREEN_WIDTH * 0.03,
        fontSize: 20,
        fontFamily: 'Urbanist'
    },
    btnText2: {
        fontSize: 18,
        color: '#548DFF',
        fontFamily: 'Urbanist-SemiBold',
    },
    btnText1: {
        fontSize: 18,
        color: 'white',
        fontFamily: 'Urbanist-SemiBold'
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
        marginLeft: SCREEN_WIDTH * 0.03,
        flex: 2,
        marginTop: 12,
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
        padding: 10,
        fontSize: 16,
        color: '#000',
        fontFamily: 'Urbanist-Light',
    },
});