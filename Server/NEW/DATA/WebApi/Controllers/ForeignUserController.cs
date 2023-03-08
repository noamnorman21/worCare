using DATA;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApi.DTO;

namespace WebApi.Controllers
{
    [RoutePrefix("api/ForeignUser")]
    public class ForeignUserController : ApiController
    {
        igroup194DB db = new igroup194DB();
        // GET api/<controller>
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
        }

        [HttpPost]
        [Route("InsertForeignUser")]
        public IHttpActionResult Post([FromBody] ForeignUserDTO user)

        {
            try
            {
                tblUser userExist = db.tblUsers.Where(x => x.Id == user.Id).First();      
                if (userExist == null)
                    return NotFound();

                //add the jewish(id-24) calnder as primary calnder
                db.InsertCalendarForUser(24, userExist.Id, true);
                foreach (int item in user.Calendars)
                {
                    //here we will add all the calendars that the user choose 
                    if (item!=24)
                        db.InsertCalendarForUser(item, userExist.Id, false);           
                }
        
                db.InsertForeignUser(user.Id, user.DateOfBirth, user.VisaExpirationDate, user.LanguageName_En, user.CountryName_En);
                
                return Ok("Foreign user added");
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

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}