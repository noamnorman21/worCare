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
    public class UserController : ApiController
    {
        igroup194DBContext db = new igroup194DBContext(); // Create a new instance of the database context        
        // Add Specific Route To each controller method
        // GET api/User
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