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


        [Route("GetPatients")]
        [HttpPost]
        public IHttpActionResult GetPatients([FromBody] int id)
        {
            try
            {
                var Patients = db.tblPatients.Where(x => x.userId == id).Select(y => new PatientDTO
                {
                    Id = y.Id,
                }).ToList();

                return Ok(Patients);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET: api/Contacts
        [Route("GetContacts")]
        [HttpPost]
        public IHttpActionResult GetContacts([FromBody] UserDTO user)
        {
            try
            {
                var Patients = new List<PatientDTO>();
                if (user.userType == "User")
                {
                    var Temp = db.tblPatients.Where(x => x.userId == user.Id).Select(y => new PatientDTO
                    {
                        Id = y.Id,
                    }).ToList();
                    Patients = Temp;
                }
                else
                {
                    var Temp = db.tblCaresForPatients.Where(x => x.workerId == user.Id).Select(y => new PatientDTO
                    {
                        Id = y.patientId,
                    }).ToList();
                    Patients = Temp;
                }
                var patientContacts = new List<dynamic>();
                foreach (var item in Patients)
                {
                    var Contacts = db.tblContacts.Where(x => x.patientId == item.Id).Select(y => new ContactDTO
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
                    patientContacts.Add(Contacts);
                }
                return Ok(patientContacts);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        // GET: api/Contacts/{id}
        [HttpGet]
        [Route("GetSpecificContact/{id}")]
        public IHttpActionResult GetSpecificContact(int id)
        {
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

        // PUT: api/Contacts/{id}
        [HttpPut]
        [Route("UpdateContact")]
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