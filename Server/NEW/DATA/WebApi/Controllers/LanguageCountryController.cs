using DATA;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace WebApi.Controllers
{
    [RoutePrefix("api/LanguageCountry")]
    public class LanguageCountryController : ApiController
    {
        // GET api/<controller>
        igroup194_prodEntities db = new igroup194_prodEntities();

        [HttpGet]
        [Route("GetAllLanguages")]
        public IHttpActionResult GetAllLanguages()
        {
            try
            {
                var languages = from l in db.tblLanguages
                                select l.LanguageName_En;                        
                return Ok(languages);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        // GET api/<controller>/5
        [Route("GetAllCountries")]
        public IHttpActionResult GetAllCountries()
        {
            try
            {
                var countries = from c in db.tblCountries
                                select c.CountryName_En;
                return Ok(countries);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
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