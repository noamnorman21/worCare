using DATA;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace WebApi.Controllers
{
    [RoutePrefix("api/Calendars")] // Calendars Types
    public class CalendarsController : ApiController
    {
        igroup194Db db = new igroup194Db();
       
        [HttpGet] //get all calendars types
        [Route("GetAllCalendars")]
        public IHttpActionResult GetAllCalendars()
        {
            try
            {
                var calendars = from c in db.tblCalendarsType
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
    
    }
}