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
        igroup194DB db = new igroup194DB();
        // GET: api/Contacts
        [Route("GetContacts/{id}")]
        [HttpGet]
        public IHttpActionResult GetContacts(int id)
        {

            //tblUser d = db.tblUsers.Where(x => x.Id == id).FirstOrDefault();
            //tblForeignUser f = d.tblForeignUser;

            try
            {
                var Contacts = db.tblContacts.Where(x => x.patientId == id.ToString()).Select(y => new ContactDTO
                {
                    contactId = y.contactId,
                    contactName = y.contactName,
                    phoneNo = y.phoneNo,
                    mobileNo = y.mobileNo,
                    email = y.email,
                    role = y.role,
                    contactComment = y.contactComment,
                }).ToList();
                return Ok(Contacts);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET: api/Contacts/5
        [HttpGet]
        [Route("GetSpecificContact/{id}")]
        public IHttpActionResult GetSpecificContact(int id)
        {

            //tblUser d = db.tblUsers.Where(x => x.Id == id).FirstOrDefault();
            //tblForeignUser f = d.tblForeignUser;

            try
            {
                var Contact = db.tblContacts.Where(x => x.contactId == id).Select(y => new ContactDTO
                {
                    contactId = y.contactId,
                    contactName = y.contactName,
                    phoneNo = y.phoneNo,
                    mobileNo = y.mobileNo,
                    email = y.email,
                    role = y.role,
                    contactComment = y.contactComment,
                }).FirstOrDefault();
                return Ok(Contact);
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

        // PUT: api/Contacts/5
        [HttpPut]
        [Route("UpdateContact/{id}")]
        public IHttpActionResult UpdateContact([FromBody] ContactDTO value)
        {
            try
            {
                tblContact c = db.tblContacts.Where(x => x.contactId == value.contactId).FirstOrDefault();
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
                throw;
            }

        }

        // DELETE: api/Contacts/5
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
