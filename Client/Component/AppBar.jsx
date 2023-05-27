import { View, TouchableOpacity, Image, Dimensions, StyleSheet, Modal } from 'react-native'
import { Octicons, Ionicons, AntDesign, Feather } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useState } from 'react';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import SettingScreen from './SettingScreen';
import Contacts from './Contacts';
import PushNotifications from './PushNotifications';

import Home from './Home';
import Finance from './Finance';
import Chats from './Chats';
import Tasks from './Tasks';
import Rights from './Rights';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


function CustomHeader() {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    return (
        <Stack.Navigator>
            <Stack.Screen
                name='AppBarDown'
                component={AppBarDown}
                options={({ navigation }) => ({
                    title: ' ',
                    headerTitleAlign: 'center',
                    headerLeft: () => (
                        <View style={styles.headerLeft}>
                            <TouchableOpacity onPress={toggleModal} >
                                <Feather name="menu" size={28} color="black" />
                            </TouchableOpacity>
                            <View>
                                <Modal
                                    visible={isModalVisible}
                                    animationType="fade"
                                    transparent={true}
                                    onRequestClose={toggleModal}
                                >
                                    <View style={styles.modalContainer}>
                                        <TouchableOpacity style={styles.closeButton} onPress={toggleModal}>
                                            <Feather name="x" size={24} color="black" />
                                        </TouchableOpacity>
                                        {/* Add your sidebar menu content here */}
                                        {/* Example content */}
                                        <View style={styles.menuItem}>
                                            <Feather name="home" size={24} color="black" />
                                            {/* Add more menu items */}
                                        </View>
                                    </View>
                                </Modal>
                            </View>
                        </View>
                    ),
                    headerRight: () => (
                        <View style={styles.headerRight}>
                            <TouchableOpacity
                                style={{ right: Dimensions.get('screen').width * 0.06 }}
                                onPress={() => { navigation.navigate('PushNotifications') }}
                            >
                                <Feather
                                    name="bell"
                                    size={28}
                                    color={'#000000'}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ right: Dimensions.get('screen').width * 0.04 }}
                                onPress={() => { navigation.navigate('Contacts') }}
                            >
                                <AntDesign
                                    name="contacts"
                                    size={28}
                                    color={'#000000'}
                                />
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
            < Stack.Screen name='SettingScreen'
                component={SettingScreen}
                options={() => ({
                    headerTitle: 'Settings',
                    presentation: 'stack',
                    cardOverlayEnabled: true,
                    headerShown: false,
                })}
            />
            < Stack.Screen name='PushNotifications' component={PushNotifications}
                options={() => ({
                    headerTitle: 'Notifications',
                    presentation: 'stack',
                    cardOverlayEnabled: true,
                })} />
            < Stack.Screen name='Contacts' component={Contacts} options={{ unmountOnBlur: true, headerShown: false }} />
        </Stack.Navigator >
    );
}

function AppBarDown() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                activeTintColor: '#548DFF',
                inactiveTintColor: '#808080',
                style: styles.tabBar,
                tabBarIcon: ({ color, size }) => {
                    if (route.name === 'Home') {
                        return <Octicons name={'home'} size={size} color={color} />
                    } else if (route.name === 'Finance') {
                        return <Octicons name={'credit-card'} size={size} color={color} />
                    } else if (route.name === 'Chats') {
                        return <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />
                    } else if (route.name === 'Tasks') {
                        return <Octicons name="checklist" size={size} color={color} />
                    } else if (route.name === 'Rights') {
                        return <Octicons name="question" size={size} color={color} />
                    }
                },
                headerShown: false
            })
            }
            initialRouteName="Home"
        >
            <Tab.Screen name="Home" component={Home} options={{ tabBarLabel: 'Home' }} />
            <Tab.Screen name="Finance" component={Finance} options={{ tabBarLabel: 'Finance', unmountOnBlur: true }} />
            <Tab.Screen name="Chats" component={Chats} options={({ route }) => ({
            tabBarStyle: ((route) => {
              const routeName = getFocusedRouteNameFromRoute(route) ?? ""
              if (routeName === 'ChatRoom') {
                return { display: "none" }
              }
              return
            })(route),
          })} />
            <Tab.Screen name="Tasks" component={Tasks} options={{ tabBarLabel: 'Tasks', unmountOnBlur: true }} />
            <Tab.Screen name="Rights" component={Rights} options={{ tabBarLabel: 'Rights' }} />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
    tabBar: { backgroundColor: '#fff', paddingTop: 10 },
    headerLeft: { marginTop: 10, marginLeft: Dimensions.get('screen').width * 0.075, flex: 1, justifyContent: 'space-between', alignContent: 'space-between' },
    headerRight: { marginTop: 10, marginLeft: Dimensions.get('screen').width * 0.075, flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'space-between' },
    headerLogo: { width: 50, height: 50, bottom: Dimensions.get('screen').height * 0.01, left: Dimensions.get('screen').width * 0.005 },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingTop: 50,
        paddingLeft: 20,
        backgroundColor: '#fff',
        width: Dimensions.get('screen').width * 0.75,
    },
    closeButton: {
        marginBottom: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
});

export { AppBarDown, CustomHeader }