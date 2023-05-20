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
                var userCalendar = from c in db.tblCalendarForUser
                                   where c.userId == newUser.userId
                                   select c;
                foreach (var item in userCalendar)
                {
                    var countryCode = from c in db.tblCalendarsType
                                      where c.calendarNum == item.calendarNum
                                      select c;
                    newUser.calendarCode += countryCode.First().calendarCode;
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
                    newUser.workerId = newUser.userId;
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
                }
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
                db.InsertUser(user.Email, user.Password, user.FirstName, user.LastName, user.gender, user.phoneNum, user.userUri);
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