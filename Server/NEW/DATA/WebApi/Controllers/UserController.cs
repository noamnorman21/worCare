using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.SqlTypes;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using DATA;
using WebApi.DTO;

namespace WebApi.Controllers
{
    [RoutePrefix("api/User")]
    public class UserController : ApiController
    {
        igroup194DB db = new igroup194DB();

        [HttpPost]
        [Route("GetEmailForgotPassword")] // POST - Because The FromBody - Check if email exists in DB and send email with new password
        public IHttpActionResult GetEmailForgotPassword([FromBody] UserDTO userD)
        {
            try
            {
                var user = db.tblUser.Where(x => x.Email == userD.Email).FirstOrDefault();
                if (user == null)
                    return NotFound();
                UserDTO userDTO = new UserDTO();
                userDTO.FirstName = user.FirstName;
                userDTO.Email = user.Email;
                return Ok(userDTO);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("UpdatePushToken")]
        public IHttpActionResult UpdatePushToken([FromBody] UserDTO userD)
        {
            try
            {
                var user = db.tblUser.Where(x => x.userId == userD.userId).FirstOrDefault();
                if (user == null)
                    return NotFound();
                user.pushToken = userD.pushToken;
                foreach (var item in db.tblScheduledNotifications.Where(x => x.pushToken == userD.lastToken).ToList())
                {
                    item.pushToken = userD.pushToken;
                }
                db.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //need to publish in filezilla
        [HttpPost]
        [Route("GetUserToken")] // POST - Because The FromBody - Check if email and password exists in DB
        public IHttpActionResult GetUserToken([FromBody] UserDTO userDTO)
        {
            try
            {
                UserDTO userToReturn = new UserDTO();
                var user = db.tblUser.Where(x => x.Email == userDTO.Email).FirstOrDefault();
                userToReturn.pushToken = user.pushToken;
                userToReturn.userId = user.userId;
                var forigenUser = db.tblForeignUser.Where(y => y.Id == user.userId).FirstOrDefault();
                if (forigenUser!=null)
                {
                    userToReturn.lagnuagecode = db.tblForeignUser.Where(y => y.Id == user.userId).Select(y => y.tblLanguage.LanguageName_Encode).FirstOrDefault();
                }
                else
                {
                    userToReturn.lagnuagecode = "HE";
                }
                return Ok(userToReturn);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("GetUserNotificatoins")] // POST - Because The FromBody - Check if email and password exists in DB
        public IHttpActionResult GetUserNotificatoins([FromBody] UserDTO userDTO)
        {
            try
            {
                var user = db.tblUser.Where(x => x.userId == userDTO.userId).FirstOrDefault();
                if (user == null)
                    return NotFound();

                UserDTO newUser = new UserDTO();
                newUser.chatNotifications = user.chatNotifications;
                newUser.tasksNotifications = user.tasksNotifications;
                newUser.medNotifications = user.medNotifications;
                newUser.financeNotifications = user.financeNotifications;
                return Ok(newUser);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("UpdateUserNotificatoins")] 
        public IHttpActionResult UpdateUserNotificatoins([FromBody] UserDTO userDTO)
        {
            try
            {
                var user = db.tblUser.Where(x => x.userId == userDTO.userId).FirstOrDefault();
                if (user == null)
                    return NotFound();

                user.chatNotifications = userDTO.chatNotifications;
                user.tasksNotifications = userDTO.tasksNotifications;
                user.medNotifications = userDTO.medNotifications;
                user.financeNotifications = userDTO.financeNotifications;
                db.SaveChanges();
                return Ok("Notifications Updated :)");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("GetUserForLogin")] // POST - Because The FromBody - Check if email and password exists in DB
        public IHttpActionResult GetUserForLogin([FromBody] UserDTO userDTO)
        {
            try
            {
                var user = from u in db.tblUser
                           where u.Email == userDTO.Email && u.Password == userDTO.Password
                           select u;
                if (user == null)
                    return NotFound();
                UserDTO newUser = new UserDTO();
                newUser.userId = user.FirstOrDefault().userId;
                newUser.Email = user.FirstOrDefault().Email;
                newUser.phoneNum = user.FirstOrDefault().phoneNum;
                newUser.userUri = user.FirstOrDefault().userUri;
                newUser.gender = user.FirstOrDefault().gender;
                newUser.FirstName = user.FirstOrDefault().FirstName;
                newUser.LastName = user.FirstOrDefault().LastName;
                newUser.pushToken = user.FirstOrDefault().pushToken;
                newUser.medNotifications = user.FirstOrDefault().medNotifications;
                newUser.chatNotifications = user.FirstOrDefault().chatNotifications;
                newUser.financeNotifications = user.FirstOrDefault().financeNotifications;
                newUser.tasksNotifications = user.FirstOrDefault().tasksNotifications;
                var userCalendar = from c in db.tblCalendarForUser
                                   where c.userId == newUser.userId
                                   select c;

                newUser.calendarCode = new List<string>();
                foreach (var item in userCalendar)
                {
                    var countryCode = from c in db.tblCalendarsType
                                      where c.calendarNum == item.calendarNum
                                      select c;
                    newUser.calendarCode.Add(countryCode.FirstOrDefault().calendarCode);
                }

                var userRole = from r in db.tblForeignUser
                               where r.Id == newUser.userId
                               select r.Id;
                if (userRole.Count() > 0)
                {
                    newUser.userType = "Caregiver";
                    newUser.patientId = (from id in db.tblCaresForPatient
                                         where id.workerId == newUser.userId
                                         select id.patientId).FirstOrDefault().ToString();
                    newUser.involvedInId = (from id in db.tblPatient
                                            where id.patientId == newUser.patientId
                                            select id.userId).FirstOrDefault();
                    //get the Expo token of the InvolvedIn user
                    newUser.pushTokenSecoundSide = (from id in db.tblUser
                                                    where id.userId == newUser.involvedInId
                                                    select id.pushToken).FirstOrDefault();

                    newUser.workerId = newUser.userId;
                    var calendarInvolved = from c in db.tblCalendarForUser
                                           where c.userId == newUser.involvedInId
                                           select c;
                    foreach (var item in calendarInvolved)
                    {
                        var countryCode = from c in db.tblCalendarsType
                                          where c.calendarNum == item.calendarNum
                                          select c;
                        if (!newUser.calendarCode.Contains(countryCode.FirstOrDefault().calendarCode))
                            newUser.calendarCode.Add(countryCode.FirstOrDefault().calendarCode);
                    }
                    newUser.CountryName_En = (from c in db.tblForeignUser
                                              where c.Id == newUser.userId
                                              select c.CountryName_En).FirstOrDefault();
                }
                else
                {
                    newUser.userType = "User";
                    newUser.patientId = (from id in db.tblPatient
                                         where id.userId == newUser.userId
                                         select id.patientId).FirstOrDefault().ToString();
                    newUser.involvedInId = newUser.userId;
                    newUser.workerId = (from id in db.tblCaresForPatient
                                        where id.patientId == newUser.patientId
                                        select id.workerId).FirstOrDefault();
                    //get the Expo token of the caregiver user
                    newUser.pushTokenSecoundSide = (from i in db.tblUser
                                                    where i.userId == newUser.workerId
                                                    select i.pushToken).FirstOrDefault();

                    var calendarCare = from c in db.tblCalendarForUser
                                       where c.userId == newUser.workerId
                                       select c;
                    foreach (var item in calendarCare)
                    {
                        var countryCode = from c in db.tblCalendarsType
                                          where c.calendarNum == item.calendarNum
                                          select c;
                        if (!newUser.calendarCode.Contains(countryCode.FirstOrDefault().calendarCode))
                            newUser.calendarCode.Add(countryCode.FirstOrDefault().calendarCode);
                    }
                }
                var patient = db.tblPatient.Where(x => x.patientId == newUser.patientId).FirstOrDefault();
                PatientDTO patientDTO = new PatientDTO();
                patientDTO.FirstName = patient.FirstName;
                patientDTO.DateOfBirth = patient.DateOfBirth;
                patientDTO.patientId = newUser.patientId;
                patientDTO.LanguageName_En = patient.tblLanguage.LanguageName_En;
                var hobbies = from h in db.tblHobbies
                              where h.patientId == newUser.patientId
                              select h;
                var limitations = from l in db.tblLimitations
                                  where l.patientId == newUser.patientId
                                  select l;
                patientDTO.hobbiesAndLimitationsDTO = new List<HobbiesAndLimitationsDTO>();
                HobbiesAndLimitationsDTO hlDTO = new HobbiesAndLimitationsDTO();
                foreach (var item in hobbies)
                {
                    hlDTO.food = item.food;
                    hlDTO.music = item.music;
                    hlDTO.movie = item.movie;
                    hlDTO.books = item.books;
                    hlDTO.drink = item.drink;
                    hlDTO.radioChannel = item.radioChannel;
                    hlDTO.TVShow = item.TVShow;
                    hlDTO.specialHabits = item.specialHabits;
                    hlDTO.afternoonNap = item.afternoonNap;
                    hlDTO.nightSleep = item.nightSleep;
                    hlDTO.otherH = item.other;
                }
                foreach (var item in limitations)
                {
                    hlDTO.allergies = item.allergies;
                    hlDTO.sensitivities = item.sensitivities;
                    hlDTO.physicalAbilities = item.physicalAbilities;
                    hlDTO.bathRoutine = item.bathRoutine;
                    hlDTO.sensitivityToNoise = item.sensitivityToNoise;
                    hlDTO.otherL = item.other;
                }
                patientDTO.hobbiesAndLimitationsDTO.Add(hlDTO);
                newUser.patient = patientDTO;

                //Get the user's Notifictions that already sent to him
                var userNotifications = from n in db.tblNotifictions
                                        where n.userId == newUser.userId
                                        select n;
                newUser.notification = new List<NotificationsThatSentDTO>();
                foreach (var item in userNotifications)
                {
                    NotificationsThatSentDTO notification = new NotificationsThatSentDTO();
                    notification.notificationID = item.notificationID;
                    notification.title = item.title;
                    notification.time = item.time;
                    notification.status = item.status;
                    notification.userId = newUser.userId;
                    notification.pushMessage = item.pushMessage;
                    newUser.notification.Add(notification);
                }
                newUser.notification = newUser.notification.OrderByDescending(x => x.time).ToList();
                return Ok(newUser);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("GetEmail")] // POST - Because The FromBody - check if email exist in DB        
        public IHttpActionResult GetEmail([FromBody] UserDTO userDTO)
        {
            try
            {
                var user = db.tblUser.Where(x => x.Email == userDTO.Email).FirstOrDefault();
                if (user == null)
                    return Ok("the email available");

                return NotFound();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("GetPhoneNum")] // POST - Because The FromBody - Check if phone number exist in DB
        public IHttpActionResult GetPhoneNum([FromBody] UserDTO userDTO)
        {
            try
            {
                var user = db.tblUser.Where(x => x.phoneNum == userDTO.phoneNum).FirstOrDefault(); ;
                if (user == null)
                    return Ok("the phone number available");
                return NotFound();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetAllUsers")] // GET - all users (email and passwords) from DB for firebase authentication
        public IHttpActionResult GetAllUsersFireBase()
        {
            try
            {
                var users = db.tblUser.Select(x => new { x.Email, x.Password }).ToList();
                if (users == null)
                    return NotFound();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("GetUserByEmail")] // POST - Because The FromBody
        public IHttpActionResult GetUserByEmail([FromBody] UserDTO user)
        {
            try
            {
                var userToReturn = db.tblUser.Where(x => x.Email == user.Email).Select(x=> x.userId).FirstOrDefault();
                if (userToReturn == null)
                    return NotFound();
                return Ok(userToReturn);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("InsertUser")] // POST - Because The FromBody - insert user to db by calling Stored Prodecdure InsertUser
        public IHttpActionResult InsertUser([FromBody] UserDTO user)
        {
            try
            {
                tblCalendarForUser calendarForUser = new tblCalendarForUser();
                //the store procedure is checking if the user already exists in the db, if not, it will insert the user
                db.InsertUser(user.Email, user.Password, user.FirstName, user.LastName, user.gender, user.phoneNum, user.userUri, user.pushToken, true, true, true, true);
                db.SaveChanges();
                var newUser = db.tblUser.Where(x => x.Email == user.Email).FirstOrDefault();
                if (newUser == null)
                    return NotFound();
                //we are using here partial class tblCalendarForUser to call the method InsertCalendar
                int result = calendarForUser.InsertCalendar(newUser.userId, user.Calendars);
                if (result == -1)
                    return BadRequest("Error in insert calendar for user");
                return Ok(newUser.userId);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("UpdateUserPassword")] // PUT - Update user password by calling Function UpdateUserPassword
        public IHttpActionResult UpdateUserPassword([FromBody] UserDTO userToUpdate)
        {
            try
            {
                tblUser user = db.tblUser.Where(x => x.Email == userToUpdate.Email).FirstOrDefault();
                user.Password = userToUpdate.Password;
                db.SaveChanges();
                return Ok("User Password Updated Successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //Only If user realy sure he wants to delete his account we will
        //delete him from the db - but first we will alert him to fuck himself
        [HttpDelete]
        [Route("DeleteUser")]
        public IHttpActionResult Delete([FromBody] UserDTO userToDelete)
        {
            try
            {
                var claendar = db.tblCalendarForUser.Where(x => x.userId == userToDelete.userId).ToList();
                foreach (var item in claendar)
                {
                    db.tblCalendarForUser.Remove(item);
                }
                if (userToDelete.userType == "User")
                {
                    var Patients = db.tblPatient.Where(x => x.userId == userToDelete.userId);
                    foreach (var item in Patients)
                    {
                        //remove PaymentRequest notifications
                        var workerId = db.tblCaresForPatient.Where(x => x.patientId == item.patientId).ToList();
                        foreach (var worker in workerId)
                        {
                            var requests = db.tblPaymentRequest.Where(y => y.userId == worker.workerId);
                            foreach (var req in requests)
                            {
                                var notifications = db.tblScheduledNotifications.Where(z => z.paymentId == req.requestId);
                                foreach (var noti in notifications)
                                {
                                    db.tblScheduledNotifications.Remove(noti);
                                }
                            }
                        }

                        //Remove Contacts
                        var contacts = db.tblContacts.Where(x => x.patientId == item.patientId).ToList();
                        foreach (var con in contacts)
                        {
                            db.tblContacts.Remove(con);
                        }

                        //remove Hobbies
                        var hobbies = db.tblHobbies.Where(x => x.patientId == item.patientId).ToList();
                        foreach (var hobby in hobbies)
                        {
                            db.tblHobbies.Remove(hobby);
                        }

                        //remove Limitations
                        var limitations = db.tblLimitations.Where(x => x.patientId == item.patientId).ToList();
                        foreach (var limit in limitations)
                        {
                            db.tblLimitations.Remove(limit);
                        }
                        //remove PatientTask
                        var PatientTasks = db.tblPatientTask.Where(x => x.patientId == item.patientId).ToList();
                        foreach (var task in PatientTasks)
                        {
                            var ProdList = db.tblProductList.Where(x => x.taskId == task.taskId).ToList();
                            foreach (var prod in ProdList)
                            {
                                db.tblProductList.Remove(prod);
                            }

                            var Lists = db.tblList.Where(x => x.taskId == task.taskId).ToList();
                            foreach (var list in Lists)
                            {
                                db.tblList.Remove(list);
                            }

                            var actualTasks = db.tblActualTask.Where(x => x.taskId == task.taskId).ToList();
                            foreach (var act in actualTasks)
                            {
                                var noti = db.tblScheduledNotifications.Where(y => y.actualTaskId == act.actualId).FirstOrDefault();
                                if (noti != null)
                                {
                                    db.tblScheduledNotifications.Remove(noti);
                                }
                                db.tblActualTask.Remove(act);
                            }

                            //remove Actuall list
                            var actuall = db.tblActualList.Where(x => x.listId == task.listId).ToList();
                            foreach (var act in actuall)
                            {
                                db.tblActualList.Remove(act);
                            }

                            //remove DrugForPatient
                            var dForp = db.tblDrugForPatient.Where(y => y.listId == task.listId).ToList();
                            foreach (var drug in dForp)
                            {
                                db.tblDrugForPatient.Remove(drug);
                            }
                            db.tblPatientTask.Remove(task);
                        }

                        //remove CaresForPatient 
                        var caresForPatient = db.tblCaresForPatient.Where(x => x.patientId == item.patientId).ToList();
                        foreach (var care in caresForPatient)
                        {
                            db.tblCaresForPatient.Remove(care);
                        }

                        //remove Patient
                        db.tblPatient.Remove(item);
                    }
                }
                else
                {
                    var patientTasks = db.tblPatientTask.Where(x => x.workerId == userToDelete.userId).ToList();
                    foreach (var task in patientTasks)
                    {
                        var actuall = db.tblActualTask.Where(y => y.taskId == task.taskId).ToList();
                        foreach (var act in actuall)
                        {
                            var noti = db.tblScheduledNotifications.Where(y => y.actualTaskId == act.actualId).FirstOrDefault();
                            if (noti != null)
                            {
                                db.tblScheduledNotifications.Remove(noti);
                            }
                            db.tblActualTask.Remove(act);
                        }
                        task.workerId = null;
                    }

                    //remove paymentRequests
                    var payments = db.tblPaymentRequest.Where(x => x.userId == userToDelete.userId).ToList();
                    foreach (var pay in payments)
                    {
                        var notifications = db.tblScheduledNotifications.Where(x => x.paymentId == pay.requestId).ToList();
                        foreach (var noti in notifications)
                        {
                            db.tblScheduledNotifications.Remove(noti);
                        }
                        db.tblPaymentRequest.Remove(pay);
                    }

                    //remove caresForPatient
                    var cares = db.tblCaresForPatient.Where(x => x.workerId == userToDelete.userId).ToList();
                    foreach (var care in cares)
                    {
                        db.tblCaresForPatient.Remove(care);
                    }

                    //remove private Task
                    var privateTasks = db.tblPrivateTask.Where(x => x.workerId == userToDelete.userId).ToList();
                    foreach (var task in privateTasks)
                    {
                        var actuall = db.tblPrivateActualTask.Where(y => y.taskId == task.taskId).ToList();
                        foreach (var act in actuall)
                        {
                            var noti = db.tblScheduledNotifications.Where(y => y.actualTaskId == act.actualId).FirstOrDefault();
                            if (noti != null)
                            {
                                db.tblScheduledNotifications.Remove(noti);
                            }
                            db.tblPrivateActualTask.Remove(act);
                        }
                        db.tblPrivateTask.Remove(task);
                    }

                    //remove forigen user
                    var forigenUser = db.tblForeignUser.Where(x => x.Id == userToDelete.userId).FirstOrDefault();
                    if (forigenUser != null)
                    {
                        db.tblForeignUser.Remove(forigenUser);
                    }
                }

                // remove Paychecks
                var paychecks = db.tblPaycheck.Where(x => x.UserId == userToDelete.userId).ToList();
                foreach (var item in paychecks)
                {
                    db.tblPaycheck.Remove(item);
                }
                //remove User
                var user = db.tblUser.Where(x => x.Email == userToDelete.Email).FirstOrDefault();
                if (user == null)
                    return NotFound();
                db.tblUser.Remove(user);
                db.SaveChanges();
                return Ok("User Deleted Successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}