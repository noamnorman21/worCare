using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ClassLibrary;

namespace WebAPI.Controllers
{
    // Add Route Prefix to the controller 
    [RoutePrefix("api/User")]
    public class UserController : ApiController
    {
        igroup194_prodEntities db = new igroup194_prodEntities(); 
        // Create a new instance of the database context        
        // Add Specific Route To each controller method

        // GET api/User/5
        [Route("GetUser/{id}")]
        public IHttpActionResult GetUser(int id)
        {
            try
            {
                // Get the user from the database
                var user = db.tblUser.Where(u => u.Id == id).FirstOrDefault();
                // If the user is not found, return a 404 error
                if (user == null)
                {
                    return NotFound();
                }
                // Return the user
                return Ok(user);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        // GET api/User
        [Route("GetAllUsers")]
        public IHttpActionResult GetUser(string email, string password)
        {
            try
            {
                var user = db.tblUser.Where(u => u.Email == email && u.Password == password).FirstOrDefault();
                if (user == null)
                {
                    return NotFound();
                }
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("GetUserById")]
        // GET api/User/GetUserByEmail?email=
        public IHttpActionResult GetUserByEmail(string email)
        {
            try
            {
                var user = db.tblUser.Where(u => u.Email == email).FirstOrDefault();
                if (user == null)
                {
                    return NotFound();
                }
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        // POST api/User        
        public IHttpActionResult Post([FromBody] tblUser user)
        {
            try
            {
                db.tblUser.Add(user);
                db.SaveChanges();
                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT api/User/
        public IHttpActionResult UpdateUser([FromBody] tblUser user)
        {
            // Update the user in the database                                   
            try
            {
                var userToUpdate = db.tblUser.Where(u => u.Email == user.Email).FirstOrDefault();
                if (userToUpdate == null)
                {
                    return NotFound();
                }
                db.SaveChanges();
                return Ok(userToUpdate);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        // DELETE api/User/
        public IHttpActionResult Delete(string email)
        {
            try
            {
                var userToDelete = db.tblUser.Where(u => u.Email == email).FirstOrDefault();
                if (userToDelete == null)
                {
                    return NotFound();
                }
                db.tblUser.Remove(userToDelete);
                db.SaveChanges();
                return Ok(userToDelete);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}