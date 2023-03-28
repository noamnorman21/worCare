import { UserContext, useState, useEffect } from 'react'

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
    const [userPayments, setUserPayments] = useState(null)
    const [userPendingPayments, setUserPendingPayments] = useState(null)
    const [userHistoryPayments, setUserHistoryPayments] = useState(null)
    const [userName, setUserName] = useState(null)
    const [userEmail, setUserEmail] = useState(null)
    const [userPassword, setUserPassword] = useState(null)
    const [userPhone, setUserPhone] = useState(null)
    const [userImage, setUserImage] = useState(null)
    const [userBirthDate, setUserBirthDate] = useState(null)
    const [userGender, setUserGender] = useState(null)

    const value = {
        user,
        setUser
    }
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContext;