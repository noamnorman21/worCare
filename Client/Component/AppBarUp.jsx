import { View, TouchableOpacity, SafeAreaView, Image, Dimensions,Button } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import AppBarDown from './AppBarDown';
import SettingScreen from './SettingScreen';
import Contacts from './Contacts';
import PushNotifications from './PushNotifications';

const Stack = createStackNavigator();
export default function CustomHeader(props, {navigation}) {
    return (


        <NavigationContainer independent={true} zIndex='0'   >
            <Stack.Navigator>
                <Stack.Screen name='AppBarUp' component={AppBarUp} options={(route) => ({
                    headerShown: false,  
                                   
                    style: {
                        flex: 1,
                    },

                })} />
                <Stack.Screen name='SettingScreen' component={SettingScreen} options={() => ({
                    headerShown: true,
                    headerTitle: 'check',
                    presentation: 'stack',
                    cardOverlayEnabled: true,
                  
                })} />
                <Stack.Screen name='PushNotifications' component={PushNotifications} options={() => ({
                    headerShown: true,
                    headerTitle: 'bla',
                    presentation: 'stack',
                    cardOverlayEnabled: true,
                })} />
                <Stack.Screen name='Contacts' component={Contacts} />
            </Stack.Navigator>

        </NavigationContainer>
        
        // <View style={{flex:1}}>
        //     <NavigationContainer independent={true} >
        //         <Stack.Navigator headerMode='none' >
        //             <Stack.Screen name='AppBarUp' component={AppBarUp} />
        //             <Stack.Screen name='SettingScreen' component={SettingScreen} />
        //             <Stack.Screen name='PushNotifications' component={PushNotifications} />
        //             <Stack.Screen name='Contacts' component={Contacts} />
        //         </Stack.Navigator>
        //     </NavigationContainer>
        // </View>
    );
    {/* <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerTitle: (props) => <LogoTitle {...props} />,
            headerRight: () => (
              <Button
                onPress={() => alert('This is a button!')}
                title="Info"
                color="#00cc00"
              />
            ),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer> */}

}

function AppBarUp({ navigation }) {
    return (
        <SafeAreaView style={{ flexDirection: 'row', backgroundColor: 'white', margin: 0, padding: 20, height: 100, alignItems: 'center', zIndex: 0 }}>
            {/* Left - Settings - ClickAble - To SettingScreen */}
            <View style={{ marginLeft: Dimensions.get('screen').width * 0.075, flex: 1, justifyContent: 'space-between', alignContent: 'space-between' }}>
                <TouchableOpacity onPress={() => { navigation.navigate('SettingScreen') }}>
                    <Image source={require('../images/icons/Profile.png')} style={{ width: 24, height: 24 }} />
                </TouchableOpacity>
            </View>
            {/*במעבר למסך ההגדרות ישלפו הגדרות המתשתמש הנבחרות לתפעול האפליקתיה.
            בנוסף תתבצע פעות גט למסד הנתונים וישלפו כלל הפרטים של המשתמש, על מנת לאפשר שינוי של הפרופיל. */}
            {/* Middle - Logo - not clickable */}
            <View style={{ flex: 1, marginLeft: Dimensions.get('screen').width * 0.01 }}>
                <Image source={require('../images/logo_New_Small.png')} style={{ width: 50, height: 50 }} />
            </View>
            {/* Right - Notifications - ClickAble - To PushNotifications */}
            <View style={{ marginRight: Dimensions.get('screen').width * 0.01 }}>
                <TouchableOpacity onPress={() => { navigation.navigate('PushNotifications') }}>
                    <Image source={require('../images/icons/notifications.png')} style={{ width: 24, height: 24 }} />
                </TouchableOpacity>
            </View>
            {/* Right - Contacts - ClickAble - To Contacts */}
            <View style={{ marginRight: Dimensions.get('screen').width * 0.05 }}>
                <TouchableOpacity onPress={() => { navigation.navigate('Contacts') }}>
                    <AntDesign name="contacts" size={24} color={'#000000'} />
                </TouchableOpacity>
            </View>
            {/*בעת ניווט למסך אנשי הקשר תתבצע פעולת גט (באמצעות מספר מטופל- המקושר למשתמש), וישלפו נתוני איש הקשר 
            הנתונים הנשלפים הינם שם, מספר טלפון, מספר נייד, אימייל, תפקיד, הערות ומספר מטופל.
            בנוסף ישלפו מספרים חשובים אשר נשמרו על ידי המשתמש. */}
        </SafeAreaView>
    )
}