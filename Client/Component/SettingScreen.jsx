// External imports:
import { StyleSheet, View, Text, Alert, SafeAreaView, TouchableOpacity, Dimensions, Image, LogBox } from 'react-native'
import React, { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AntDesign, Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

// Internal imports:
import Profile from './SettingsComponents/Profile'
import Notifications from './SettingsComponents/Notifications'
import Privacy from './SettingsComponents/Privacy'
import ContactUs from './SettingsComponents/ContactUs'
import ImageChange from './SettingsComponents/ImageChange'

const Stack = createNativeStackNavigator();

//this is the Setting Main screen, 
//need to add the personal setting (יצירת פרופיל)
function HomeScreen({ navigation, route }) {
    const [userImg, setUserImg] = useState(null);
    const [userName, setUserName] = useState(null);
    const [userEmail, setuserEmail] = useState(null);
    const [userId, setUserId] = useState(null);
    const isFocused = useIsFocused();


    LogBox.ignoreLogs([
        'Non-serializable values were found in the navigation state',
      ]);

    useEffect(() => {
        const getData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('userData');
                const userData = jsonValue != null ? JSON.parse(jsonValue) : null;
                setUserName(userData.FirstName);
                setuserEmail(userData.Email);
                setUserImg(userData.userUri);
                setUserId(userData.UserId);                
                console.log('Setting screen', userData);
                
            } catch (e) {
                console.log('error', e);
            }
        };
        getData();
    }, [isFocused]);

    //the user name will be taken from the database
    //the user image will be taken from the database
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.personalContainer}>
                <View style={styles.imageContainer}>
                    {/* here will be the user name and image and the logo of the app */}
                    <Image style={styles.image} source={{ uri: userImg }} />
                    {/* <Image style={styles.image} source={require(`${userImg}`)} /> */}
                    <View style={styles.personalTextContainer}>
                        <Text style={styles.personalText}>Hello, {userName}</Text>
                        {/* <Text style={styles.personalText}></Text> */}
                    </View>
                </View>
            </View>

            <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.btn} onPress={() => [navigation.navigate('Profile', {email:userEmail})]}>
                    <Ionicons style={styles.logoStyle} name='ios-person-outline' size={30} color='gray' />
                    <Text style={styles.btnText}>Profile</Text>
                    <AntDesign style={styles.arrowLogoStyle} name="right" size={25} color="gray" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Notifications')}>
                    <SimpleLineIcons style={styles.logoStyle} name='bell' size={30} color='gray' />
                    <Text style={styles.btnText}>Notifications</Text>
                    <AntDesign style={styles.arrowLogoStyle} name="right" size={24} color="gray" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Privacy')}>
                    <Ionicons style={styles.logoStyle} name='key' size={30} color='gray' />
                    <Text style={styles.btnText}>Privacy & My Account</Text>
                    <AntDesign style={styles.arrowLogoStyle} name="right" size={25} color="gray" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('ContactUs', {userImg:userImg})}>
                    <Ionicons style={styles.logoStyle} name='send' size={30} color='gray' />
                    <Text style={styles.btnText}>Contact Us</Text>
                    <AntDesign style={styles.arrowLogoStyle} name="right" size={25} color="gray" />
                </TouchableOpacity>
                <View style={styles.ColorBtnContainer}>
                    <TouchableOpacity style={styles.colorBtn1}
                        onPress={() => {
                            AsyncStorage.removeItem("user");
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

                    <TouchableOpacity style={styles.colorBtn2}
                        onPress={() => {
                            Alert.alert('Delete Account', 'Are you sure you want to delete your account?', [
                                {
                                    text: 'Cancel',
                                    onPress: () => console.log('Cancel Pressed'),
                                    style: 'cancel'
                                },
                                {
                                    text: 'OK',
                                    onPress: () => {
                                        navigation.navigate('LogIn')
                                    }
                                },
                            ]);
                        }}
                    >
                        <Text style={styles.btnText2}>Delete Account</Text>
                    </TouchableOpacity>
                </View>
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
                        marginLeft: Dimensions.get('window').width * 0.03,
                    },
                    headerBackTitleVisible: false,
                    // how to hide the parent header in the child stack navigator   
                    
                }}>

                <Stack.Screen name="Settings" component={HomeScreen} options={() => ({ headerTitle: 'Settings', headerShown: false })} initialParams={{logout:()=>{navigation.navigate('LogIn')}}} />
                <Stack.Screen name="Profile" component={Profile} options={{ headerLeft: () => null }} />
                <Stack.Screen name="Notifications" component={Notifications} />
                <Stack.Screen name="Privacy" component={Privacy} options={{ headerTitle: 'Privacy & My Account' }} />
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
        // flexDirection: 'row',
        justifyContent: 'space-between',
        width: Dimensions.get('window').width * 0.95,
        marginTop: Dimensions.get('window').height * 0.06,
    },
    colorBtn1: {
        backgroundColor: '#548DFF',
        width: Dimensions.get('window').width * 0.95,
        height: 54,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    colorBtn2: {
        width: Dimensions.get('window').width * 0.95,
        height: 54,
        borderRadius: 16,
        borderWidth: 1.5,
        backgroundColor: '#F5F8FF',
        borderColor: '#548DFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Dimensions.get('window').height * 0.02,
    },
    logoStyle: {
        marginLeft: Dimensions.get('window').width * 0.03,
        marginRight: Dimensions.get('window').width * 0.06
    },
    arrowLogoStyle: {
        position: 'absolute',
        right: Dimensions.get('window').width * 0.03,
    },
    title: {
        //the title, it will be on the left side of the screen,just above the image
        fontSize: 25,
        fontWeight: 'bold',
        marginLeft: Dimensions.get('window').width * 0.03,
        marginRight: Dimensions.get('window').width * 0.6,
        marginTop: Dimensions.get('window').height * 0.03,
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
        width: Dimensions.get('window').width * 1,
        // paddingVertical: Dimensions.get('window').height * 0.04,
    },
    imageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: Dimensions.get('window').width * 0.0,
        marginTop: Dimensions.get('window').height * 0.02,
    },
    personalText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: Dimensions.get('window').width * 0.03,
        marginLeft: Dimensions.get('window').width * 0.03,
    },
    logo: {
        width: Dimensions.get('window').width * 0.2,
        height: Dimensions.get('window').height * 0.1,
        borderRadius: 100,
        backgroundColor: 'transparent',
        marginRight: Dimensions.get('window').width * 0.03,
        marginTop: Dimensions.get('window').height * 0.03,
        marginBottom: Dimensions.get('window').height * 0.0,
    },
    image: {
        width: Dimensions.get('window').width * 0.20,
        height: Dimensions.get('window').height * 0.09,
        borderRadius: 100,
        marginTop: Dimensions.get('window').height * 0.022,
        marginLeft: Dimensions.get('window').width * 0.05,
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: Dimensions.get('window').width * 1,
        height: Dimensions.get('window').height * 0.08,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
    },
    btnText: {
        fontSize: 18,
    },
    btnText2: {
        fontSize: 18,
        color: '#548DFF',
    },
    btnText1: {
        fontSize: 18,
        color: 'white',
    },
});