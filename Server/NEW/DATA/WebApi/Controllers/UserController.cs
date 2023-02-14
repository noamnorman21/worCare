using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using DATA;

namespace WebApi.Controllers
{
    [RoutePrefix("api/User")]
    public class UserController : ApiController
    {
        igroup194_Model db = new igroup194_Model();

        // GET api/<controller>
        [HttpGet]
        [Route("GetUser/{id}")]
        public IHttpActionResult GetUser(int id)
        {
            try
            {
                var user = db.tblUser.Where(x => x.Id == id).FirstOrDefault();
                return Ok(user.FirstName + user.userUri + user.gender);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //this is get method that return the user by email
        [HttpGet]
        [Route("GetUserEmail")]
        public IHttpActionResult GetUserEmail([FromBody] string email)
        {
            try
            {
                var user = db.tblUser.Where(x => x.Email == email).FirstOrDefault();
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

        // PUT api/<controller>/5
        public void Put(int id, [FromBody] string value)
        {
        }

        //Only If user realy sure he wants to delete his account we will
        //delete him from the db - but first we will alert him to fuck himself
        [HttpDelete]
        [Route("DeleteUser")]
        public IHttpActionResult Delete([FromBody] string email)
        {
            try
            {
                var user = db.tblUser.Where(x => x.Email == email).FirstOrDefault();
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