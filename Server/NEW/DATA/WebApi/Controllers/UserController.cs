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
                return Ok("Full Name: " + user.FirstName + " " + user.LastName +", Email: "+ user.Email);
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



        // POST api/<controller>
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}