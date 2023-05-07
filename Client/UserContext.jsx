import React, { useState, useEffect, createContext, useContext, useRef } from 'react'
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

const UserContext = createContext()
const UserUpdateContext = createContext()

export function useUserContext() {
    return useContext(UserContext)
}

export function UserProvider({ children }) {
    const appEmail = 'worcare21@gmail.com';
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
            console.log("temp", temp);
            user = {
                userId: temp.userId,
                userType: temp.userType,
            }
        }
        else {
            console.log("userContext", userContext);
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
        // if (data.length > 0) {
        //     let contacts = data.map((item) => {
        //         return <ContactCard key={item.contactId} contact={item} fetchContacts={fetchContacts} />
        //     })
        //     setUserContacts(data);
        // }
        // else {
        //     setContacts([])
        //     setContactToRender([])
        //     setaddModalVisible(true)
        // }
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
    //actuallTask, isPrivateTask
    function updateActualTask(task, isPrivateTask) {
        let updateActualTaskUrL = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Task/UpdateActualTask';
        let UpdateActualPrivateTaskUrl = 'https://proj.ruppin.ac.il/cgroup94/test1/api/Task/UpdateActualPrivateTask';
        

        // console.log(task);
        // console.log(isPrivateTask);
        // return;

        if (isPrivateTask) {
            fetch(UpdateActualPrivateTaskUrl, {
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




    const value = { userContext, userContacts, userNotifications, updateActualTask, updateRememberUserContext, logInContext, fetchUserContacts, logOutContext, updateUserContext, updateUserContacts, updatePendings, updateUserProfile, updateuserNotifications, appEmail }
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContext;