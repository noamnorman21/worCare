using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DATA;
using WebApi.DTO;

namespace WebApi.Controllers
{
    [RoutePrefix("api/Settings")]
    public class SettingsController : ApiController
    {
        igroup194DB db = new igroup194DB();

        // gets all user details and updates them - if only one field is changed,
        // the other fields will be updated to the same value as before
        [HttpPut]
        [Route("UpdateUserProfile")] 
        public IHttpActionResult UpdateUserProfile([FromBody] UserDTO userToUpdate)
        {
            try
            {
                tblUser user = db.tblUser.Where(x => x.Email == userToUpdate.Email).FirstOrDefault();
                user.phoneNum = userToUpdate.phoneNum;
                user.FirstName = userToUpdate.FirstName;
                user.LastName = userToUpdate.LastName;
                user.gender = userToUpdate.gender;
                user.userUri = userToUpdate.userUri;
                db.SaveChanges();
                return Ok("User Updated Successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("UpdateUserEmail")]
        public IHttpActionResult UpdateUserEmail([FromBody] UserDTO userToUpdate)
        {
            try
            {
                tblUser user = db.tblUser.Where(x => x.userId == userToUpdate.userId).FirstOrDefault();
                user.Email = userToUpdate.Email;
                db.SaveChanges();
                return Ok("Email Updated Successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("SetNewPassword")]
        public IHttpActionResult SetNewPassword([FromBody] UserDTO userToUpdate)
        {
            try
            {
                tblUser user = db.tblUser.Where(x => x.userId == userToUpdate.userId).FirstOrDefault();
                user.Password = userToUpdate.Password;
                db.SaveChanges();
                return Ok("Password Updated Successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}