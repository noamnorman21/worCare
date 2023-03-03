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
        igroup194_prodEntities db = new igroup194_prodEntities();

        [Route("GetUser/{id}")]
        public IHttpActionResult GetUser(int id)
        {
            try
            {
                var user = db.tblUsers.Where(x => x.Id == id).FirstOrDefault();
                return Ok(user.FirstName + " " + user.LastName + " - Email:" + user.Email);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetEmail/{userEmail}")]
        public IHttpActionResult GetEmail(string userEmail)
        {
            try
            {
                var user = db.tblUsers.Where(x => x.Email == userEmail).First();
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

        [HttpGet]
        [Route("GetUserForLogin")]
        public IHttpActionResult GetUserForLogin([FromBody] UserDTO userDTO)
        {
            try
            {
                var user = from u in db.tblUsers
                           where u.Email == userDTO.Email && u.Password == userDTO.Password
                           select u;
                if (user == null)
                {
                    return NotFound();
                }
                UserDTO newUser = new UserDTO();
                newUser.Id = user.First().Id;
                newUser.Email = user.First().Email;
                //newUser.Password = user.First().Password;
                newUser.phoneNum = user.First().phoneNum;
                newUser.userUri = user.First().userUri;
                newUser.gender = user.First().gender;
                newUser.FirstName = user.First().FirstName;
                newUser.LastName = user.First().LastName;
                return Ok(newUser);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        // GET : Get all users (email and passwords) from DB for firebase authentication
        [HttpGet]
        [Route("GetAllUsersFireBase")]
        public IHttpActionResult GetAllUsersFireBase()
        {
            try
            {
                var users = db.tblUsers.Select(x => new { x.Email, x.Password }).ToList();
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

        // insert user to db by calling Stored Prodecdure InsertUser
        [HttpPost]
        [Route("InsertUser")]
        public IHttpActionResult InsertUser([FromBody] tblUser user)
        {
            try
            {
                db.InsertUser(user.Email, user.Password, user.FirstName, user.LastName, user.gender, user.phoneNum, user.userUri);
                db.SaveChanges();
                //return the id from the new user
                var newUser = db.tblUsers.Where(x => x.Email == user.Email).FirstOrDefault();
                return Ok(newUser.Id);
            }

            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // update user to db by calling Function UpdateUser
        [HttpPut]
        [Route("UpdateUser")]
        public IHttpActionResult UpdateUser([FromBody] UserDTO userToUpdate)
        {
            try
            {
                tblUser user = db.tblUsers.Where(x => x.Email == userToUpdate.Email).FirstOrDefault();
                user.phoneNum = userToUpdate.phoneNum;
                user.FirstName = userToUpdate.FirstName;
                user.LastName = userToUpdate.LastName;
                user.gender = userToUpdate.gender;
                user.userUri = userToUpdate.userUri;
                user.Password = userToUpdate.Password;
                db.SaveChanges();
                return Ok("User Updated Successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Update user password by calling Function UpdateUserPassword
        [HttpPut]
        [Route("UpdateUserPassword")]
        public IHttpActionResult UpdateUserPassword([FromBody] UserDTO userToUpdate)
        {
            try
            {
                tblUser user = db.tblUsers.Where(x => x.Email == userToUpdate.Email).FirstOrDefault();
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
                var user = db.tblUsers.Where(x => x.Email == userToDelete.Email).FirstOrDefault();
                if (user == null)
                {
                    return NotFound();
                }
                db.tblUsers.Remove(user);
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