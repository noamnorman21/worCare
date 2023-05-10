import React, { useState, useEffect, createContext, useContext, useRef } from 'react'
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
//--ruppin api server--

//login
let userForLoginUrl = 'https://proj.ruppin.ac.il/cgroup94/test1/api/User/GetUserForLogin';

//signUp
let insertUser = 'https://proj.ruppin.ac.il/cgroup94/test1/api/User/InsertUser';
let getAllLanguages = 'https://proj.ruppin.ac.il/cgroup94/test1/api/LanguageCountry/GetAllLanguages';
let getAllCountries = 'https://proj.ruppin.ac.il/cgroup94/test1/api/LanguageCountry/GetAllCountries';
let getAllCalendars = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Calendars/GetAllCalendars';

//signUpPatient
let insertPatient = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Patient/InsertPatient';
let insertPatientHobbiesAndLimitations = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Patient/InsertPatientHobbiesAndLimitations';

//signUpCargiver
let insertForeignUser = 'https://proj.ruppin.ac.il/cgroup94/test1/api/ForeignUser/InsertForeignUser';
let insertCaresForPatient = 'https://proj.ruppin.ac.il/cgroup94/test1/api/ForeignUser/InsertCaresForPatient';

//Contacts
let newContact = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Contacts/NewContact';
let updateContact = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Contacts/UpdateContact/';//+Contact.contactId
let deleteContact = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Contacts/DeleteContact';

//Payments
let getHistory = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Payments/GetHistory/';//+userId
let deletePayment = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Payments/DeletePayment/';//+Payment.requestId
let updateRequest = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Payments/UpdateRequest';
let newRequest = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Payments/NewRequest';
let getPending = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Payments/GetPending/';//+userId

// tasks
let updateActualTaskUrL = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Task/UpdateActualTask';
let updateActualPrivateTaskUrl = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Task/UpdateActualPrivateTask';
let getAllPublicTasksUrl = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Task/GetAllTasks';
let getAllPrivateTasksUrl = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Task/GetAllPrivateTasks';

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
    const [userCountry, setUserCountry] = useState(null)
    const [userCalendar, setUserCalendar] = useState(null)
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
    const [allPublicTasks, setAllPublicTasks] = useState(null)
    const [allPrivateTasks, setAllPrivateTasks] = useState(null)

    function logInContext(userData) {
        setUserType(userData.userType);
        setUserLanguage(userData.Language);
        setUserCountry(userData.Country);
        setUserCalendar(userData.Calendar);
        setUserHobbies(userData.Hobbies);
        setUserLimitations(userData.Limitations);
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

        }

        setUserContext(usertoSync);
        let notifications = {
            emailNotifications: true,
            financeNotifications: true,
            chatNotifications: true,
            tasksNotifications: true,
            contactNotifications: true,
            allNotifications: true,
        }
        setUserNotifications(notifications)
        fetchUserContacts(usertoSync);
        GetUserPending(usertoSync);
        GetUserHistory(usertoSync);
        getAllPrivateTasks(usertoSync);
        getAllPublicTasks(usertoSync);
    }

    function logOutContext() {
        setUserContext(null)
    }

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
        fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Settings/UpdateUserProfile', {
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
                            (result) => {
                                console.log("fetch POST= ", result);
                                Alert.alert('User Updated', 'Your User has been Updated successfully');
                                updateUserContext(userToUpdate)
                                const jsonValue = JSON.stringify(userToUpdate)
                                AsyncStorage.setItem('userData', jsonValue);
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

    async function fetchUserContacts(temp) {
        console.log("FetchUserContacts")
        let user = {}
        if (temp != undefined) {
            user = {
                userId: temp.userId,
                userType: temp.userType,
            }
        }
        else {
            user = {
                userId: userContext.userId,
                userType: userContext.userType,
            }
        }
        // new part when server is uploaded
        const response = await fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Contacts/GetContacts', {
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

    function updateUserContacts() {
        fetchUserContacts();
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

    function updatePendings(pendings) {
        setUserPendingPayments(pendings);
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
                                    console.log("fetch UpdateActualPrivate= ", result);
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

    function addNewContact(Contact) {
        fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Contacts/NewContact', {
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
        let urlContactUpdate = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Contacts/UpdateContact/';
        fetch(urlContactUpdate, {
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
                        fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Contacts/DeleteContact/', {
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

    //Finance
    async function GetUserPending(userData) {
        console.log("GetUserHistory")
        try {
            let user;
            if (userData === undefined) {
                user = {
                    userId: userContext.userId,
                    userType: userContext.userType
                }
            }
            else {
                user = {
                    userId: userData.userId,
                    userType: userData.userType
                }
            }
            fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Payments/GetPending/', {
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
                    userType: userContext.userType
                }
            }
            else {
                user = {
                    userId: userData.userId,
                    userType: userData.userType
                }
            }
            fetch('https://proj.ruppin.ac.il/cgroup94/test1/api/Payments/GetHistory/', {
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

    async function getAllPublicTasks(userData) {   
        console.log("getAllPublicTaskssssssssssssssssssssss")
        console.log("userData.patientId = ", userData.patientId)
        try {
            const response = await fetch(getAllPublicTasksUrl, {
                method: 'POST',
                headers: new Headers({ 'Content-Type': 'application/json; charset=UTF-8', }),
                body: JSON.stringify(userData.patientId),
            });
            const result = await response.json();
            setAllPublicTasks(result);
        } catch (error) {
            console.log('err post=', error);
        }
    }
    async function getAllPrivateTasks(userData) {
        //do it only if userType is caregiver
        if (userData.userType != "Caregiver") {
            return;
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


    const value = { userContext, userContacts, userNotifications, userPendingPayments, userHistoryPayments, GetUserHistory, GetUserPending,
         deleteContact, addNewContact, saveContact, updateActualTask, updateRememberUserContext, logInContext, fetchUserContacts, logOutContext,
          updateUserContext, updateUserContacts, updatePendings, updateUserProfile, updateuserNotifications, appEmail,getAllPrivateTasks,getAllPublicTasks,allPublicTasks,allPrivateTasks };
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContext;