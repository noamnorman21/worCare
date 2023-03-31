import { useState, useEffect, createContext, useContext } from 'react'
import React from 'react'

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

const UserContext = React.createContext()
const UserUpdateContext = React.createContext()

export function useUserContext() {
    return useContext(UserContext)
}

export function UserProvider({ children }) {
const [user, setUser] = useState(null)
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
    const [Password, setPassword] = useState(null)
    const [phoneNum, setPhone] = useState(null)
    const [userUri, setuserUri] = useState(null)
    const [BirthDate, setBirthDate] = useState(null)
    const [gender, setGender] = useState(null)

    

    function singin (userData) {        
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
        setPassword(userData.Password);
        setPhone(userData.Phone);
        setuserUri(userData.userUri);
        setBirthDate(userData.BirthDate);
        setGender(userData.Gender)

        let usertoSync = {
            Id: userData.Id,
            userType: userData.userType,
            FirstName: userData.FirstName,
            LastName: userData.LastName,
            Email: userData.Email,
            Password: userData.Password,
            phoneNum: userData.phoneNum,
            userUri: userData.userUri,
            gender: userData.gender,    
        }
        console.log("dfg",usertoSync);
        setUser(usertoSync);        
    }

    function signout() {
        setUser(null)
    }

    
    const value={user,singin,signout}   
        return (
            <UserContext.Provider value={value}>
                {children}
            </UserContext.Provider>
        )
    }

    export default UserContext;


   