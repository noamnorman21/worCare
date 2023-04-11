// External imports:
import { StyleSheet, View, Text, Alert, SafeAreaView, TouchableOpacity, Dimensions, Image, LogBox } from 'react-native'
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



// Internal imports:
import Profile from './SettingsComponents/Profile'
import Notifications from './SettingsComponents/Notifications'
import Privacy from './SettingsComponents/Privacy'
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
        console.log("updateUser");
        console.log("Field", Field);
        setIsChanged(true);
        if (Field === "userUri") {
            Alert.alert("התמונה עודכנה בהצלחה");
            setImageChange(true);
        }
        setUser({ ...user, [Field]: value });
    }

    useEffect(() => {
        const setNavigation = async () => navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={styles.headerButton} onPress={() => (ImageChange ? sendToFirebase(user.userUri) : sendDataToNextDB())}>
                    <Octicons name="check" size={22} />
                </TouchableOpacity>
            ),
            headerLeft: () => (
                <View style={styles.headerLeft}>
                    <TouchableOpacity
                        onPress={isChanged?()=> Alert.alert(
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
                        ):route.params.Exit}         >
                        <Ionicons
                            name="arrow-back"
                            size={28}
                            color={'#000000'}
                        />
                    </TouchableOpacity>
                </View>
            ),
            
        });
        console.log("setnavigations")
        setNavigation();
    }, [user,isFocused]);



    //the user name will be taken from the database
    //the user image will be taken from the database
    return (
        <SafeAreaView style={styles.container}>
            <Profile updateUser={(Field, value) => updateUser(Field, value)} />
            <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Privacy', {updateUser:(Field, Value)=>updateUser(Field, Value)})}>
                    <Ionicons style={styles.logoStyle} name='key' size={30} color='gray' />
                    <Text style={styles.btnText}>Privacy & My Account</Text>
                    <AntDesign style={styles.arrowLogoStyle} name="right" size={25} color="gray" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('ContactUs', { userImg: userImg })}>
                    <Ionicons style={styles.logoStyle} name='send' size={30} color='gray' />
                    <Text style={styles.btnText}>Contact Us</Text>
                    <AntDesign style={styles.arrowLogoStyle} name="right" size={25} color="gray" />
                </TouchableOpacity>
                {/* <View style={styles.ColorBtnContainer}>
                    <TouchableOpacity style={styles.colorBtn1}
                        onPress={() => {
                            AsyncStorage.removeItem("user");
                            AsyncStorage.removeItem("userData");
                            Alert.alert('Log Out', 'You have been logged out', [
                                {
                                    text: 'OK',
                                    onPress: () => {
                                        route.params.logout();
                                    }
                                },
                            ]);
                        }}
                    >
                        <Text style={styles.btnText1}>Log Out</Text>
                    </TouchableOpacity>


                </View> */}
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
                    headerBackTitleVisible: false,
                    headerShown: false,
                }}>
                <Stack.Screen name="Settings" component={HomeScreen} options={() => ({ headerTitle: 'Settings', headerShown: true, headerTitleAlign:'center' })} initialParams={{ logout: () => { navigation.dispatch(StackActions.replace('LogIn')) }, Exit: () => navigation.navigate('AppBarDown')}} />
                <Stack.Screen name="Profile" component={Profile} />
                <Stack.Screen name="Notifications" component={Notifications} />
                <Stack.Screen name="Privacy" component={Privacy} options={{ headerTitle: 'Privacy & My Account', headerTitleAlign:'center', headerShown: true }} initialParams={{ logout: () => { navigation.dispatch(StackActions.replace('LogIn')) },  AddNewAccount: () => { navigation.dispatch(StackActions.replace('LogIn')); navigation.navigate('SignUp', {patiendId:null}) }  }} />
                <Stack.Screen name="ContactUs" component={ContactUs} options={{ headerTitle: 'Contact Us' }} />
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
        width: SCREEN_WIDTH * 0.20,
        height: SCREEN_HEIGHT * 0.09,
        borderRadius: 100,
        marginTop: SCREEN_HEIGHT * 0.022,
        marginLeft: SCREEN_WIDTH * 0.05,
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
        width: SCREEN_WIDTH * 0.1,
        height: SCREEN_HEIGHT * 0.05,
        alignItems: 'center',
        justifyContent: 'center',
    },
});