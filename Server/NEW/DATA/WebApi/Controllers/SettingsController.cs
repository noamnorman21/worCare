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

        [HttpPut]
        [Route("UpdateImage")]
        public IHttpActionResult UpdateImage([FromBody] UserDTO userToChange)
        {
            try
            {
                var user = db.tblUsers.Where(x => x.Email == userToChange.Email).FirstOrDefault();
                user.userUri = userToChange.userUri;
                db.SaveChanges();
                return Ok("Image Updated");


            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("UpdateFirstName")]
        public IHttpActionResult UpdateFirstName([FromBody] UserDTO userToChange)
        {
            try
            {
                var user = db.tblUsers.Where(x => x.Id == userToChange.Id).FirstOrDefault();
                if (user == null)
                {
                    return NotFound();
                }
                user.FirstName = userToChange.FirstName;
                db.SaveChanges();
                return Ok("First Name Updated");


            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("UpdateLastName")]
        public IHttpActionResult UpdateLastName([FromBody] UserDTO userToChange)
        {
            try
            {
                var user = db.tblUsers.Where(x => x.Id == userToChange.Id).FirstOrDefault();
                if (user == null)
                {
                    return NotFound();
                }
                user.LastName = userToChange.LastName   ;
                db.SaveChanges();
                return Ok("Last Name Updated");


            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPut]
        [Route("UpdateGender")]
        public IHttpActionResult UpdateGender([FromBody] UserDTO userToChange)
        {
            try
            {
                var user = db.tblUsers.Where(x => x.Id == userToChange.Id).FirstOrDefault();
                if (user == null)
                {
                    return NotFound();
                }
                user.gender = userToChange.gender;
                db.SaveChanges();
                return Ok("Gender Updated");


            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("UpdateUserProfile")]
        public IHttpActionResult UpdateUserProfile([FromBody] UserDTO userToUpdate)
        {
            try
            {
                tblUser user = db.tblUsers.Where(x => x.Email == userToUpdate.Email).FirstOrDefault();
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
                tblUser user = db.tblUsers.Where(x => x.Id == userToUpdate.Id).FirstOrDefault();
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
                tblUser user = db.tblUsers.Where(x => x.Id == userToUpdate.Id).FirstOrDefault();
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
