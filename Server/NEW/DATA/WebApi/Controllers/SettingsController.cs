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
    }
}
