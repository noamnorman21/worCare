﻿using DATA;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApi.DTO;
using System.Web.Http.Cors;

namespace WebApi.Controllers
{
    [RoutePrefix("api/ForeignUser")]
    public class ForeignUserController : ApiController
    {
        igroup194DB db = new igroup194DB();

        [HttpPost]
        [Route("InsertForeignUser")]
        public IHttpActionResult Post([FromBody] ForeignUserDTO user)
        {
            try
            {
                tblUser userExist = db.tblUsers.Where(x => x.Id == user.Id).First();
                if (userExist == null)
                    return NotFound();
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