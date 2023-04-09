using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.SqlTypes;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Helpers;
using System.Web.Http;
using System.Web.Http.Cors;
using DATA;
using WebApi.DTO;
namespace WebApi.Controllers
{
    [RoutePrefix("api/Contacts")]
    public class ContactController : ApiController
    {
        igroup194Db db = new igroup194Db();

        // GET: api/Contacts לתקן כמו שצריך
        [Route("GetContacts")]
        [HttpPost]
        public IHttpActionResult GetContacts([FromBody] UserDTO user)
        {
            try
            {
                string PatientId;
                if (user.userType == "User")
                {
                    PatientId = db.tblPatient.Where(x => x.userId == user.userId).Select(y => y.patientId).FirstOrDefault();
                }
                else
                {
                    PatientId = db.tblCaresForPatient.Where(x => x.workerId == user.userId).Select(y => y.patientId).FirstOrDefault();
                }

                var Contacts = db.tblContacts.Where(x => x.patientId == PatientId).Select(y => new ContactDTO
                {
                    contactId = y.contactId,
                    contactName = y.contactName,
                    phoneNo = y.phoneNo,
                    mobileNo = y.mobileNo,
                    email = y.email,
                    role = y.role,
                    contactComment = y.contactComment,
                    patientId = y.patientId
                }).ToList();
                return Ok(Contacts);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST: api/Contacts
        [HttpPost]
        [Route("NewContact")]
        public IHttpActionResult NewContact([FromBody] ContactDTO con)
        {
            try
            {

                db.NewContact(con.contactName, con.phoneNo, con.mobileNo, con.email, con.role, con.contactComment, con.patientId);
                db.SaveChanges();
                return Ok("Contact Added Succesfully!");

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/Contacts/{id}
        [HttpPut]
        [Route("UpdateContact")]
        public IHttpActionResult UpdateContact([FromBody] ContactDTO value)
        {
            try
            {
                tblContacts c = db.tblContacts.Where(x => x.contactId == value.contactId).FirstOrDefault();
                c.contactName = value.contactName;
                c.phoneNo = value.phoneNo;
                c.mobileNo = value.mobileNo;
                c.email = value.email;
                c.role = value.role;
                c.contactComment = value.contactComment;
                db.SaveChanges();
                return Ok("Contact Updated Successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/Contacts/{id}
        [HttpDelete]
        [Route("DeleteContact")]
        public IHttpActionResult DeleteContact([FromBody] ContactDTO ContactToDelete)
        {
            try
            {
                var user = db.tblContacts.Where(x => x.contactId == ContactToDelete.contactId).FirstOrDefault();
                if (user == null)
                {
                    return NotFound();
                }
                db.tblContacts.Remove(user);
                db.SaveChanges();
                return Ok("Contact Deleted Successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}