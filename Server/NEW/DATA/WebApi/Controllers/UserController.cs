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
        [Route("GetUser/{id}")]
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
        [Route("GetEmailForgotPassword")]
        public IHttpActionResult GetEmailForgotPassword([FromBody] UserDTO userD)
        {
            try
            {
                var user = db.tblUser.Where(x => x.Email == userD.Email).First();
                if (user == null)
                {
                    return NotFound();
                }
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
        [Route("GetUserForLogin")]
        public IHttpActionResult GetUserForLogin([FromBody] UserDTO userDTO)
        {
            try
            {
                var user = from u in db.tblUser
                           where u.Email == userDTO.Email && u.Password == userDTO.Password
                           select u;
                if (user == null)
                {
                    return NotFound();
                }

                UserDTO newUser = new UserDTO();
                newUser.userId = user.First().userId;
                newUser.Email = user.First().Email;
                newUser.phoneNum = user.First().phoneNum;
                newUser.userUri = user.First().userUri;
                newUser.gender = user.First().gender;
                newUser.FirstName = user.First().FirstName;
                newUser.LastName = user.First().LastName;
                var userRole = from r in db.tblForeignUser
                               where r.Id == newUser.userId
                               select r.Id;
                if (userRole.Count() > 0)
                {
                    newUser.userType = "Caregiver";
                }
                else
                {
                    newUser.userType = "User";
                }
                return Ok(newUser);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
        [HttpPost]
        [Route("GetEmail")] //check if email exist in DB        
        public IHttpActionResult GetEmail([FromBody] UserDTO userDTO)
        {
            try
            {
                var user = db.tblUser.Where(x => x.Email == userDTO.Email).First();
                if (user == null)
                {
                    return Ok("the email available");
                }
                
                return NotFound();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
        [HttpPost]
        [Route("GetPhoneNum")] //check if phone number exist in DB
        public IHttpActionResult GetPhoneNum([FromBody] UserDTO userDTO)
        {
            try
            {
                var user = db.tblUser.Where(x => x.phoneNum == userDTO.phoneNum).First();
                if (user == null)
                {
                    return Ok("the phone number available");
                }
                return NotFound();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
        [HttpGet]
        [Route("GetAllUsers")] // GET all users (email and passwords) from DB for firebase authentication
        public IHttpActionResult GetAllUsersFireBase()
        {
            try
            {
                var users = db.tblUser.Select(x => new { x.Email, x.Password }).ToList();
                if (users == null)
                {
                    return NotFound();
                }
                return Ok(users);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
        [HttpPost]
        [Route("InsertUser")] // insert user to db by calling Stored Prodecdure InsertUser
        public IHttpActionResult InsertUser([FromBody] UserDTO user)
        {
            try
            {
                tblCalendarForUser calendarForUser = new tblCalendarForUser();
                //the store procedure is checking if the user already exists in the db, if not, it will insert the user
                db.InsertUser(user.Email, user.Password, user.FirstName, user.LastName, user.gender, user.phoneNum, user.userUri);
                db.SaveChanges();
                var newUser = db.tblUser.Where(x => x.Email == user.Email).First();
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
        [Route("UpdateUserPassword")] // Update user password by calling Function UpdateUserPassword
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