import { useState, useEffect, createContext, useContext, useRef} from 'react'
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    const [userContext, setUserContext] = useState(null)
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
    const [userUri, setuserUri] = useState(null)
    const [BirthDate, setBirthDate] = useState(null)
    const [userGender, setuserGender] = useState(null)

    function logInContext(userData) {
        let usertoSync = {
            userId: userData.userId,
            userType: userData.userType,
            FirstName: userData.FirstName,
            LastName: userData.LastName,
            Email: userData.Email,
            phoneNum: userData.phoneNum,
            userUri: userData.userUri,
            gender: userData.gender,
        }
        
        setUserContext(usertoSync);
       
    }



    function logOutContext() {
        setUserContext(null)
    }

    function updateUserProfile(user) {
        const userToUpdate = {
          Email: user.Email,
          userUri: user.userUri,
          phoneNum: user.phoneNum,
          gender: user.gender,
          FirstName: user.FirstName,
          LastName: user.LastName,
          userId: user.userId,
          userType: user.userType
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

    function updaterememberUserContext(userContext) {
        console.log("updateUser", userContext);
        setUserContext(userContext)
    }

    function updateuserContacts(Contacts) {
        setUserContacts(Contacts)
    }

    function UpdatePendings (pendings){
        setUserPendingPayments(pendings);
    }



    const value = { userContext, userContacts, logInContext, logOutContext, updateUserContext, updateuserContacts, UpdatePendings, updateUserProfile }
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContext;


