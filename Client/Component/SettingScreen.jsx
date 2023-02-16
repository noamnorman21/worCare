import { StyleSheet, View, Text, Button, SafeAreaView, TouchableOpacity, Dimensions, Image } from 'react-native'
import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
// Internal imports:
import Profile from './SettingsComponents/Profile'
import Notifications from './SettingsComponents/Notifications'
import Privacy from './SettingsComponents/Privacy'
import ContactUs from './SettingsComponents/ContactUs'

const Stack = createNativeStackNavigator();

//this is the Setting Main screen, 
//need to add the personal setting (יצירת פרופיל)
function HomeScreen({ navigation }, props) {
    //the user name will be taken from the database
    //the user image will be taken from the database
    const [userName, setUserName] = useState('Noam')
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.personalContainer}>
                <View style={styles.imageContainer}>
                    {/* here will be the user name and image and the logo of the app */}
                    <Image style={styles.image} source={require('../images/Avatar.png')} />
                    <View style={styles.personalTextContainer}>
                        <Text style={styles.personalText}>Hello, {userName}</Text>
                        {/* <Text style={styles.personalText}></Text> */}
                    </View>
                </View>
            </View>

            <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Profile')}>
                    <Ionicons
                        style={{
                            marginLeft: Dimensions.get('window').width * 0.03,
                            marginRight: Dimensions.get('window').width * 0.06
                        }}
                        name='ios-person-outline'
                        size={30}
                        color='gray'
                    />
                    <Text style={styles.btnText}>Profile</Text>
                    <AntDesign
                        style={{
                            position: 'absolute',
                            right: Dimensions.get('window').width * 0.03,
                        }}
                        name="right"
                        size={25}
                        color="gray" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Notifications')}>
                    <SimpleLineIcons style={{
                        marginLeft: Dimensions.get('window').width * 0.03,
                        marginRight: Dimensions.get('window').width * 0.06

                    }} name='bell' size={30} color='gray' />
                    <Text style={styles.btnText}>Notifications</Text>
                    <AntDesign
                        style={{
                            position: 'absolute',
                            right: Dimensions.get('window').width * 0.03,
                        }} name="right" size={24} color="gray" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Privacy')}>
                    <Ionicons style={{
                        marginLeft: Dimensions.get('window').width * 0.03,
                        marginRight: Dimensions.get('window').width * 0.06

                    }} name='key' size={30} color='gray' />
                    <Text style={styles.btnText}>Privacy & My Account</Text>
                    <AntDesign
                        style={{
                            position: 'absolute',
                            right: Dimensions.get('window').width * 0.03,
                        }} name="right" size={25} color="gray" />

                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('ContactUs')}>
                    <Ionicons style={{
                        marginLeft: Dimensions.get('window').width * 0.03,
                        marginRight: Dimensions.get('window').width * 0.06

                    }} name='send' size={30} color='gray' />
                    <Text style={styles.btnText}>Contact Us</Text>
                    <AntDesign
                        style={{
                            position: 'absolute',
                            right: Dimensions.get('window').width * 0.03,
                        }} name="right" size={25} color="gray" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export default function SettingScreen(props) {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator
                screenOptions={{
                    //this is the animation for the navigation
                    animation: 'slide_from_right',
                    headerBlurEffect: 'light',
                    headerStyle: {
                        backgroundColor: '#F5F5F5',
                        height: Dimensions.get('window').height * 0.0,
                    },
                    headerTintColor: '#548DFF',
                    headerTitleStyle: {
                        fontSize: 18,
                        color: 'black',
                        marginLeft: Dimensions.get('window').width * 0.03,
                    },
                    headerBackTitleVisible: false,
                    // headerBackImage: () => (
                    //   <Ionicons style={{
                    //     marginLeft: Dimensions.get('window').width * 0.03,
                    //     marginRight: Dimensions.get('window').width * 0.05
                    //   }} name='ios-arrow-back' size={30} color='gray' />
                    // ),
                    //do not show the header,just the back button

                }}
            >
                <Stack.Screen name="Settings" options={{ headerShown: false }} component={HomeScreen} />
                <Stack.Screen name="Profile" component={Profile} />
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
    title: {
        //the title, it will be on the left side of the screen,just above the image
        fontSize: 25,
        fontWeight: 'bold',
        marginLeft: Dimensions.get('window').width * 0.03,
        marginRight: Dimensions.get('window').width * 0.6,
        marginTop: Dimensions.get('window').height * 0.03,
    },

    btnContainer: {
        flex: 6,
        alignItems: 'center',
        justifyContent: 'flex-start',

    },
    personalContainer: {
        flex: 2.2,
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
        fontSize: 21,
    },
});