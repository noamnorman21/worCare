import React, { useState, useEffect, createContext, useContext, useRef } from 'react'
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from './config/firebase';
import { signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import moment from 'moment';
import { query, updateDoc, collection, getDocs, where } from 'firebase/firestore';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';


// ---------------- All Server Urls ---------------- 

// General
let updateProfileUrl = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Settings/UpdateUserProfile'
let getPairedProfile = 'https://proj.ruppin.ac.il/cgroup94/test1/api/User/GetUser/'
let getPatientData = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Patient/GetPatientData';
// Log In
let userForLoginUrl = 'https://proj.ruppin.ac.il/cgroup94/test1/api/User/GetUserForLogin';

// Sign Up
let insertUser = 'https://proj.ruppin.ac.il/cgroup94/test1/api/User/InsertUser';
let getAllLanguages = 'https://proj.ruppin.ac.il/cgroup94/test1/api/LanguageCountry/GetAllLanguages';
let getAllCountries = 'https://proj.ruppin.ac.il/cgroup94/test1/api/LanguageCountry/GetAllCountries';
let getAllCalendars = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Calendars/GetAllCalendars';

// Sign Up Patient
let insertPatient = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Patient/InsertPatient';
let insertPatientHobbiesAndLimitations = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Patient/InsertPatientHobbiesAndLimitations';

// Sign Up Cargiver
let insertForeignUser = 'https://proj.ruppin.ac.il/cgroup94/test1/api/ForeignUser/InsertForeignUser';
let insertCaresForPatient = 'https://proj.ruppin.ac.il/cgroup94/test1/api/ForeignUser/InsertCaresForPatient';

// Contacts
let getContacts = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Contacts/GetContacts';
let newContact = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Contacts/NewContact';
let updateContact = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Contacts/UpdateContact/';//+Contact.contactId
let deleteContactUrl = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Contacts/DeleteContact';

// Payments
let getHistory = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Payments/GetHistory/';//+userId
let deletePayment = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Payments/DeletePayment/';//+Payment.requestId
let updateRequest = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Payments/UpdateRequest';
let newRequest = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Payments/NewRequest';
let getPending = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Payments/GetPending/';//+userId
let getPaychecksUrl='https://proj.ruppin.ac.il/cgroup94/test1/api/PayChecks/GetPaychecks/';

// Tasks
let updateActualTaskUrL = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Task/UpdateActualTask';
let updateActualPrivateTaskUrl = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Task/UpdateActualPrivateTask';
let getAllPublicTasksUrl = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Task/GetAllTasks';
let getAllPrivateTasksUrl = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Task/GetAllPrivateTasks';
let updateDrugForPatientDTOUrl = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Task/UpdateDrugForPatientDTO';
let allDrugsUrl = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Drug/GetAllDrugs';
let InsertPrivateTaskUrl = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Task/InsertPrivateTask';

const UserContext = createContext()
const UserUpdateContext = createContext()

export function useUserContext() {
    return useContext(UserContext)
}

export function UserProvider({ children }) {
    const appEmail = 'worcare21@gmail.com';
    const navigation = useNavigation();
    const [userContext, setUserContext] = useState(null)
    const [userNotifications, setUserNotifications] = useState(null)
    const [userType, setUserType] = useState(null)
    const [userLanguage, setUserLanguage] = useState(null)
    const [userHobbies, setUserHobbies] = useState(null)
    const [userLimitations, setUserLimitations] = useState(null)
    const [userCaresFor, setUserCaresFor] = useState(null)
    const [userContacts, setUserContacts] = useState(null)
    const [userPaychecks, setUserPaychecks] = useState(null)
    const [userPendingPayments, setUserPendingPayments] = useState(null)
    const [userHistoryPayments, setUserHistoryPayments] = useState(null)
    const [FirstName, setFirstName] = useState(null)
    const [LastName, setLastName] = useState(null)
    const [Email, setEmail] = useState(null)
    const [phoneNum, setPhone] = useState(null)
    const [userUri, setUserUri] = useState(null)
    const [BirthDate, setBirthDate] = useState(null)
    const [userGender, setUserGender] = useState(null)
    const [allPublicTasks, setAllPublicTasks] = useState([])
    const [allPrivateTasks, setAllPrivateTasks] = useState([])
    const [allMedicineTasks, setAllMedicineTasks] = useState([]);
    const [allShopTasks, setAllShopTasks] = useState([]);
    const [userCalendar, setUserCalendar] = useState(null)
    const [calendarCode, setCalendarCode] = useState(null)
    const [allDrugs, setAllDrugs] = useState([]);

    // new

    const [pairedEmail, setPairedEmail] = useState(null)
    const [userChats, setUserChats] = useState(null)
    const [CountryName_En, setCountryName_En] = useState(null)
    const [holidays, setHolidays] = useState([]);
    const [patientData, setPatientData] = useState(null)
    const [patientHL, setPatientHL] = useState(null)
    const [patientId, setPatientId] = useState(null)


    //new for chat logo
    const [newMessages, setNewMessages] = useState(0);

    async function logInContext(userData) {
        setUserType(userData.userType);
        setUserLanguage(userData.Language);
        setUserCalendar(userData.Calendar);
        setUserCaresFor(userData.CaresFor);
        setUserContacts(userData.Contacts);
        setUserPaychecks(userData.Paychecks);
        setUserPendingPayments(userData.PendingPayments);
        setUserHistoryPayments(userData.HistoryPayments);
        setFirstName(userData.FirstName);
        setEmail(userData.Email);
        setLastName(userData.LastName);
        setPhone(userData.Phone);
        setUserUri(userData.userUri);
        setBirthDate(userData.BirthDate);
        setUserGender(userData.Gender)
        setCalendarCode(userData.calendarCode);
        setPatientHL(userData.patientHL);
        setPatientData(userData.patientData);
        setPatientId(userData.patientId);
        let usertoSync = {
            userId: userData.userId,
            userType: userData.userType,
            FirstName: userData.FirstName,
            LastName: userData.LastName,
            Email: userData.Email,
            phoneNum: userData.phoneNum,
            userUri: userData.userUri,
            gender: userData.gender,
            workerId: userData.workerId,//if user is a caregiver, this field will be same as userId
            involvedInId: userData.involvedInId,//if user is a not caregiver, this field will be same as userId
            patientId: userData.patientId,
            calendarCode: userData.calendarCode,
            CountryName_En: userData.CountryName_En,
            patientHL: userData.patientHL,
            patientData: userData.patientData,
            pushToken: userData.pushToken,
            pushToken2: userData.pushTokenSecoundSide,
        }
        setUserContext(usertoSync);
        let notifications = {
            financeNotifications: true,
            chatNotifications: true,
            tasksNotifications: true,
            medNotifications: true,
            allNotifications: true,
        }
        setUserNotifications(notifications)
        fetchUserContacts(usertoSync);
        GetUserPending(usertoSync);
        GetUserHistory(usertoSync);
        // getPaychecks(usertoSync);
        await getAllPrivateTasks(usertoSync);
        await getAllPublicTasks(usertoSync);
        await getHolidaysForUser(usertoSync.calendarCode);
        if (userData.userType == "User") {
            getPairedEmail(userData.workerId);
        }
        else {
            getPairedEmail(userData.involvedInId);
        }
    }
    // ----------------------  Push Notifications  ----------------------
    // For Push Notifications - Start
    async function registerForPushNotificationsAsync() {
        let token;

        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                Alert.alert('Failed to get push token for push notification!');
                return;
            }
            token = (await Notifications.getExpoPushTokenAsync()).data;
            console.log(token);
        } else {
            Alert.alert('Must use physical device for Push Notifications');
        }
        return token;
    }

    // send push notification to user from client side without trigger
    async function sendPushNotification(pushData) {
        const message = {
            to: pushData.expoPushToken,
            // sound: 'default',
            title: pushData.title,
            body: pushData.body,
            //data: { data: pushData.data },
        };
        console.log('expoPushToken: ', pushData.expoPushToken);
        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
    }

    async function getHolidaysForUser(calendarCode) {
        setHolidays([]);
        try {
            for (const country of calendarCode) {
                await getHolidays(country);
            }
        } catch (error) {
            console.error('Error fetching holidays:', error);
        }
    }

    async function getHolidays(country) {
        const apiKey = '1269df65cf0081dab91555b4d1bd5171de6dc403'
        const year = moment().year();
        const url = `https://calendarific.com/api/v2/holidays?api_key=${apiKey}&country=${country}&year=${year}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.response && data.response.holidays) {
                const holidays = data.response.holidays.map((holiday) => ({
                    date: holiday.date.iso,
                    name: holiday.name,
                    desc: holiday.description,
                }));
                setHolidays((prev) => [...prev, ...holidays]);
            } else {
                throw new Error('Invalid API response');
            }
        } catch (error) {
            console.error('Error fetching holidays:', error);
        }
    }

    function getPairedEmail(id) {
        console.log('getPairedEmail')
        fetch(getPairedProfile + id, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
            })
        })
            .then(res => {
                if (!res.ok)
                    return Promise.reject(res.statusText);
                return res.json()
            })
            .then(
                (result) => {
                    let temp = result.split(":")
                    temp = temp[1];
                    setPairedEmail(temp)
                },
                (error) => {
                    console.log("err post=", error);
                });
    }

    function logOutContext() {
        console.log("logOutContext")
        setUserContext(null)
        setNewMessages(0)
        logOutFireBase()
    }




    //updated for firebase upadte after settings change
    function updateUserProfile(userData) {
        const userToUpdate = {
            userId: userData.userId,
            userType: userData.userType,
            FirstName: userData.FirstName,
            LastName: userData.LastName,
            Email: userData.Email,
            phoneNum: userData.phoneNum,
            userUri: userData.userUri,
            gender: userData.gender,
            workerId: userData.workerId,//if user is a caregiver, this field will be same as userId
            involvedInId: userData.involvedInId,//if user is a not caregiver, this field will be same as userId
            patientId: userData.patientId,
        }

        fetch(updateProfileUrl, {
            method: 'PUT',
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8',
            }),
            body: JSON.stringify(userToUpdate)
        })
            .then(res => {
                if (res.ok) {
                    return res.json()
                        .then(
                            async (result) => {
                                Alert.alert('User Updated', 'Your User has been Updated successfully');
                                updateUserContext(userToUpdate)
                                const jsonValue = JSON.stringify(userToUpdate)
                                AsyncStorage.setItem('userData', jsonValue);
                                updateProfile(auth.currentUser, {
                                    displayName: userToUpdate.FirstName + " " + userToUpdate.LastName,
                                    photoURL: userToUpdate.userUri,
                                })
                                //update user in firebase Allusers collection for future conversations
                                const q = query(collection(db, "AllUsers"), where("id", "==", userToUpdate.Email));
                                const querySnapshot = await getDocs(q);
                                querySnapshot.forEach((doc) => {
                                    updateDoc(doc.ref, { id: userToUpdate.Email, name: userToUpdate.FirstName + " " + userToUpdate.LastName, avatar: userToUpdate.userUri });
                                    console.log("Document successfully updated!");
                                });
                            }
                        )
                }
                else {
                    console.log('err post=', res);
                    Alert.alert('Error', 'Sorry, there was an error updating your user. Please try again later.');
                }
            }
            )
            .catch((error) => {
                console.log('Error:', error.message);
            }
            );
    }

    function updateUserContext(userContext) {
        console.log("updateUser", userContext);
        setUserContext(userContext)
    }

    function updateuserNotifications(notifications) {
        console.log("updateUser", notifications)
        setUserNotifications(notifications)
        AsyncStorage.setItem('userNotifications', JSON.stringify(notifications));
    }

    async function updateRememberUserContext(userContext) {
        console.log("updateRememberUser", userContext);
        setUserContext(userContext);
    }

    // ---------------- Contacts ----------------
    async function fetchUserContacts(temp) {
        console.log("FetchUserContacts")
        let user = {}
        if (temp != undefined) {
            user = {
                userId: temp.userId,
                patientId: temp.patientId,
                userType: temp.userType,
            }
        }
        else {
            user = {
                userId: userContext.userId,
                patientId: userContext.patientId,
                userType: userContext.userType,
            }
        }
        // new part when server is uploaded
        const response = await fetch(getContacts, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user)
        });
        const data = await response.json();
        if (data != null) {
            setUserContacts(data);
            return data;
        }
    }

    useEffect(() => {
        if(patientId!=null && userContext!=null){
        console.log(patientId)
        console.log(userContext.patientId)
        fetchUserContacts(userContext);
        getAllPublicTasks(userContext);
        getAllPrivateTasks(userContext);
        GetUserPending(userContext);
        GetUserHistory(userContext);
        // getPaychecks(userContext);        
        }
    }, [patientId]);



    function updateUserContacts() {
        fetchUserContacts();
    }

    function addNewContact(Contact) {
        fetch(newContact, {
            method: 'POST',
            body: JSON.stringify(Contact),
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
            })
        })
            .then(res => {
                return res.json()
            })
            .then(
                (result) => {
                    console.log("fetch POST= ", result);
                    Alert.alert("Contact added successfully");
                    fetchUserContacts();
                },
                (error) => {
                    console.log("err post=", error);
                });
    }

    async function saveContact(Contact) {
        console.log("contact to save = ", Contact)
        fetch(updateContact, {
            method: 'PUT',
            body: JSON.stringify(Contact),
            headers: new Headers({ 'Content-Type': 'application/json; charset=UTF-8' })
        })
            .then(res => {
                if (res.status === 200) {
                    console.log('contact updated');
                    return res.json();
                }
                else {
                    Alert.alert('Something went wrong', 'Please try again');
                    console.log('cannot update contact');
                }
            })
            .then(
                (result) => {
                    console.log("fetch POST= ", result);
                    Alert.alert('Contact Saved', 'The contact was saved successfully');
                    //   setSaving(false);
                    //   setEdit(false);
                    //   setIsChanged(false);
                    fetchUserContacts();
                },
                (error) => {
                    console.log("err post2=", error);
                });
    }

    function deleteContact(Contact) {
        Alert.alert(
            'Delete Contact',
            'Are you sure you want to delete this contact?',
            [
                { text: "Don't Delete", style: 'cancel', onPress: () => { } },
                {
                    text: 'Delete',
                    style: 'destructive',
                    // If the user confirmed, then we dispatch the action we blocked earlier
                    // This will continue the action that had triggered the removal of the screen
                    onPress: () => {
                        fetch(deleteContactUrl, {
                            method: 'DELETE',
                            body: JSON.stringify(Contact),
                            headers: new Headers({
                                'Content-Type': 'application/json; charset=UTF-8',
                            })
                        })
                            .then(res => {
                                return res.json()
                            })
                            .then(
                                (result) => {
                                    console.log("fetch POST= ", result);
                                    if (result === 1) {
                                        Alert.alert('Contact Deleted', 'The contact was deleted successfully');
                                    }
                                    fetchUserContacts();
                                    navigation.goBack();
                                },
                                (error) => {
                                    console.log("err post=", error);
                                });
                    }
                },
            ]
        );
    }

    // ---------------- Finance ----------------
    async function GetUserPending(userData) {
        console.log("GetUserPending")
        try {
            let user;
            if (userData === undefined) {
                user = {
                    userId: userContext.userId,
                    userType: userContext.userType,
                    patientId: userContext.patientId,
                    workerId: userContext.workerId
                }
            }
            else {
                user = {
                    userId: userData.userId,
                    userType: userData.userType,
                    patientId: userData.patientId,
                    workerId: userData.workerId
                }
            }            
            console.log(user,)
            fetch(getPending, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                body: JSON.stringify(user)
            }).then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                else {
                    return null;
                }
            })
                .then((responseJson) => {
                    if (responseJson != null) {
                        setUserPendingPayments(responseJson);
                    }
                })
                .catch((error) => {
                    console.log(error);
                }
                )
        } catch (error) {
            console.log(error)
        }
    }

    async function GetUserHistory(userData) {
        console.log("GetUserHistory")
        try {
            let user;
            if (userData === undefined) {
                user = {
                    userId: userContext.userId,
                    userType: userContext.userType,
                    patientId: userContext.patientId,
                    workerId: userContext.workerId
                }
            }
            else {
                user = {
                    userId: userData.userId,
                    userType: userData.userType,
                    patientId: userData.patientId,
                    workerId: userData.workerId
                }
            }
            fetch(getHistory, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user)
            }).then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
                else {
                    return null;
                }
            })
                .then((responseJson) => {
                    if (responseJson != null) {
                        setUserHistoryPayments(responseJson);
                    }
                })
                .catch((error) => {
                    console.log(error);
                }
                )
        } catch (error) {
            console.log(error)
        }
    }

    // async function getPaychecks(userData) {
    //     console.log("getPaychecks")
    //     let user;
    //     if (userData === undefined) {

    //         user = {
    //             userId: userContext.userId,
    //             userType: userContext.userType,
    //             patientId: userContext.patientId
    //         }
    //     }
    //     else {
    //         user = {
    //             userId: userData.userId,
    //             userType: userData.userType,
    //             patientId: userData.patientId
    //         }
    //     }
    //     try {
    //       const response = await fetch(getPaychecksUrl, {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(user)
    //       });
    //       const data = await response.json();
    //       if (data != null) {
    //         setUserPaychecks(data);
    //       }          
    //     } catch (error) {
    //       console.log(error)
    //     }
    //   }

    function updatePendings(pendings) {
        setUserPendingPayments(pendings);
    }

    // ---------------- Tasks ----------------
    async function GetAllDrugs() {
        console.log("GetAllDrugs")
        fetch(allDrugsUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
        })
            .then(res => {
                if (res.ok) {
                    return res.json()
                }
                else {
                    console.log("not found")
                }
            })
            .then(data => {
                if (data != null) {
                    //exmaple of data object: {drugId:1, drugName:"פרסקוטיקס", drugUrl:"https://www.drugs.com/images/pills/augmentin.jpg", modifyDate:"2021-05-05T00:00:00",Type:"pills"} 
                    setAllDrugs(data);
                }
            })
            .catch((error) => {
                console.log("err=", error);
            });

    }

    async function getAllPublicTasks(userData) {
        try {
            const response = await fetch(getAllPublicTasksUrl, {
                method: 'POST',
                headers: new Headers({ 'Content-Type': 'application/json; charset=UTF-8', }),
                body: JSON.stringify(userData.patientId),
            });
            const result = await response.json();
            setAllPublicTasks(result);
            filterTasks(result);
        } catch (error) {
            console.log('err post=', error);
        }
    }

    async function filterTasks(tasks) {
        let filteredTasks = tasks.filter(task => task.type == false);
        setAllShopTasks(filteredTasks);
        let filteredMedicineTasks = tasks.filter(task => task.type == true);
        //save only today tasks
        filteredMedicineTasks = filteredMedicineTasks.filter(task => {
            let today = new Date()
            let taskDate = new Date(task.taskDate)
            return taskDate.getDate() == today.getDate() && taskDate.getMonth() == today.getMonth() && taskDate.getFullYear() == today.getFullYear()
        })
        //sort by time from erliest to latest
        filteredMedicineTasks.sort((a, b) => {
            let aTime = new Date(a.taskDate);
            let bTime = new Date(b.taskDate);
            return aTime - bTime;
        })
        setAllMedicineTasks(filteredMedicineTasks);
    }

    async function getAllPrivateTasks(userData) {
        //do it only if userType is caregiver
        if (userData.userType != "Caregiver") {
            return setAllPrivateTasks([]);
        }
        let forginUser = {
            Id: userData.workerId
        }
        try {
            const response = await fetch(getAllPrivateTasksUrl, {
                method: 'POST',
                headers: new Headers({ 'Content-Type': 'application/json; charset=UTF-8', }),
                body: JSON.stringify(forginUser),
            });
            const result = await response.json();
            setAllPrivateTasks(result);
        } catch (error) {
            console.log('err post=', error);
        }
    }

    function updateActualTask(task, isPrivateTask) {
        if (isPrivateTask) {
            fetch(updateActualPrivateTaskUrl, {
                method: 'PUT',
                headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; charset=UTF-8',
                }),
                body: JSON.stringify(task)
            })
                .then(res => {
                    if (res.ok) {
                        return res.json()
                            .then(
                                (result) => {
                                    getAllPrivateTasks(userContext);
                                }
                            )
                    }
                    else {
                        console.log('err post=', res);

                    }
                }
                )
                .catch((error) => {
                    console.log('Error:', error.message);
                }
                );
        }
        else {
            fetch(updateActualTaskUrL, {
                method: 'PUT',
                headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; charset=UTF-8',
                }),
                body: JSON.stringify(task)
            })
                .then(res => {
                    if (res.ok) {
                        return res.json()
                            .then(
                                (result) => {
                                    console.log("fetch updateActualTaskUrL= ", result);
                                    getAllPublicTasks(userContext);
                                }
                            )
                    }
                    else {
                        console.log('err post=', res);
                    }
                }
                )
                .catch((error) => {
                    console.log('Error:', error.message);
                }
                );
        }
    }

    function UpdateDrugForPatientDTO(drugForPatient) {
        fetch(updateDrugForPatientDTOUrl, {
            method: 'PUT',
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8',
            }),
            body: JSON.stringify(drugForPatient)
        })
            .then(res => {
                if (res.ok) {
                    return res.json()
                        .then(
                            (result) => {
                                console.log("fetch UpdateDrugForPatientDTO= ", result);
                                getAllPublicTasks(userContext);
                            }
                        )
                }
                else {
                    console.log('err post=', res);
                }
            }
            )
            .catch((error) => {
                console.log('Error:', error.message);
            }
            );
    }

    function addPrivateTaskContext(taskData) {
        console.log("addPrivateTask");
        fetch(InsertPrivateTaskUrl, {
            method: 'POST',
            body: JSON.stringify(taskData),
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
            })
        })
            .then(res => { return res.json() })
            .then(
                (result) => {
                    console.log("fetch POST= ", result);
                }
            )
            .catch((error) => {
                console.log('Error=', error);
            }
            );
    }

    // ---------------- Firebase ----------------
    async function logInFireBase(email, password) {
        console.log('logInFireBase')
        console.log(email)
        console.log(password)
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log('user logged in');
                // getChatConvo(userCredential.user.email)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorMessage);
            });
    }

    async function logOutFireBase() {
        signOut(auth).then(() => {
            console.log('user logged out');
        }).catch((error) => {
            console.log(error);
        });
    }


    function UpdatePatientId(patientId) {
        if (userContext.userType != "Caregiver") {
            //need to set new involved in id            
            return;
        }
        else {
            //need to set new worker Id
        }

        setPatientId(patientId);
        setUserContext({ ...userContext, patientId: patientId });
    }

    const value = {
        userContext, allShopTasks, allMedicineTasks, userContacts, userNotifications, userPendingPayments,
        userHistoryPayments, userChats, setUserChats, logInFireBase, GetUserHistory, GetUserPending, 
        deleteContact, addNewContact, saveContact, updateActualTask, updateRememberUserContext, logInContext,
        fetchUserContacts, logOutContext, updateUserContext, updateUserContacts, updatePendings,
        updateUserProfile, updateuserNotifications, appEmail, getAllPrivateTasks, getAllPublicTasks,
        allPublicTasks, allPrivateTasks, UpdateDrugForPatientDTO, holidays, GetAllDrugs, allDrugs, addPrivateTaskContext,
        newMessages, setNewMessages, logOutFireBase, registerForPushNotificationsAsync, sendPushNotification,UpdatePatientId, userPaychecks
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContext;