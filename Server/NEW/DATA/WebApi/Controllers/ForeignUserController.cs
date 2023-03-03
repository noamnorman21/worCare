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
        igroup194_prodEntities db = new igroup194_prodEntities();
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
            //first we will check if the id is exist in tblUser
            var userExist = db.tblUsers.Where(x => x.Id == user.Id).First();
            if (userExist==null)
                return NotFound();

   


            //if the id is exist we will add a new row to tblForeignUser
            tblForeignUser foreignUser = new tblForeignUser();
            foreignUser.Id = user.Id;
            foreignUser.DateOfBirth = user.DateOfBirth;
            foreignUser.VisaExpirationDate = user.VisaExpirationDate;
            foreignUser.LanguageName_En = user.LanguageName_En;
            foreignUser.CountryName_En = user.CountryName_En;
            db.tblForeignUsers.Add(foreignUser);
            db.SaveChanges();
            return Ok("foreign user added successfully");

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