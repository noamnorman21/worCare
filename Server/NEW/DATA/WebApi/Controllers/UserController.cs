using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using DATA;
using WebApi.DTO;

namespace WebApi.Controllers
{
    [RoutePrefix("api/User")]
    public class UserController : ApiController
    {
        igroup194_Model db = new igroup194_Model();

        [HttpGet]
        public IHttpActionResult Get()

        {
            try
            {
                var users = db.tblUser.Select(x => new UserDTO
                {
                    Email = x.Email,
                    Password = x.Password
                }).ToList();
                return Ok(users);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
                throw;
            }






        }

        [HttpGet]
        [Route("GetUser/{id}")]
        public IHttpActionResult GetUser(int id)
        {
            try
            {
                var user = db.tblUser.Where(x => x.Id == id).FirstOrDefault();
                return Ok(user.FirstName + " " + user.LastName);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        
        //this is get method that return the user by email
        [HttpGet]
        [Route("GetUserEmail")]
        public IHttpActionResult GetUserEmail([FromBody] UserDTO userEmail)
        {

            try
            {
                var user = db.tblUser.Where(x => x.Email == userEmail.Email).FirstOrDefault();
                if (user == null)
                {
                    return NotFound();
                }
                return Ok(user.Email);
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
                return Ok("User Inserted Successfully");
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
                tblUser user = db.tblUser.Where(x => x.Email == userToUpdate.Email).FirstOrDefault();
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
                {
                    return NotFound();
                }
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