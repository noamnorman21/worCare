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
        igroup194Db db = new igroup194Db();

        [HttpGet]
        [Route("GetUser/{id}")] // Just for testing purposes
        public IHttpActionResult GetUser(int id)
        {
            try
            {
                var user = db.tblUser.Where(x => x.userId == id).FirstOrDefault();
                return Ok(user.FirstName + " " + user.LastName + " - Email:" + user.Email);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

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
                newUser.userId = user.First().userId;
                newUser.Email = user.First().Email;
                newUser.phoneNum = user.First().phoneNum;
                newUser.userUri = user.First().userUri;
                newUser.gender = user.First().gender;
                newUser.FirstName = user.First().FirstName;
                newUser.LastName = user.First().LastName;
                newUser.pushToken = user.First().pushToken;
                var userCalendar = from c in db.tblCalendarForUser
                                   where c.userId == newUser.userId
                                   select c;

                newUser.calendarCode = new List<string>();
                foreach (var item in userCalendar)
                {
                    var countryCode = from c in db.tblCalendarsType
                                      where c.calendarNum == item.calendarNum
                                      select c;
                    newUser.calendarCode.Add(countryCode.First().calendarCode);
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
                        if (!newUser.calendarCode.Contains(countryCode.First().calendarCode))
                            newUser.calendarCode.Add(countryCode.First().calendarCode);
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
                        if (!newUser.calendarCode.Contains(countryCode.First().calendarCode))
                            newUser.calendarCode.Add(countryCode.First().calendarCode);
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
        [Route("InsertUser")] // POST - Because The FromBody - insert user to db by calling Stored Prodecdure InsertUser
        public IHttpActionResult InsertUser([FromBody] UserDTO user)
        {
            try
            {
                tblCalendarForUser calendarForUser = new tblCalendarForUser();
                //the store procedure is checking if the user already exists in the db, if not, it will insert the user
                db.InsertUser(user.Email, user.Password, user.FirstName, user.LastName, user.gender, user.phoneNum, user.userUri, user.pushToken);
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