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
        igroup194Db db = new igroup194Db();

        [HttpGet]
        [Route("GetAllLanguages")]
        public IHttpActionResult GetAllLanguages()
        {
            try
            {
                var languages = from l in db.tblLanguage
                                select new
                                {
                                   LanguageName_En = l.LanguageName_En,
                                   LanguageName_Origin = l.LanguageName_Origin,
                                };                                       
                return Ok(languages);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        // GET api/<controller>/5
        [HttpGet]
        [Route("GetAllCountries")]
        public IHttpActionResult GetAllCountries()
        {
            try
            {
                var countries = from c in db.tblCountry
                                select c.CountryName_En;
                return Ok(countries);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}