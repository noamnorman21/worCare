using DATA;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace WebApi.Controllers
{
    [RoutePrefix("api/Calendars")]
    public class CalendarsController : ApiController
    {
        igroup194DB db = new igroup194DB();
        
        //get all calendars types
        [HttpGet]
        [Route("GetAllCalendars")]
        public IHttpActionResult  GetAllCalendars()
        {
            try
            {
                var calendars = from c in db.tblCalendarsTypes
                                select new
                                {
                                    calendarNum = c.calendarNum,
                                    CalendarName = c.calendarName
                                };
                
                return Ok(calendars);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
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