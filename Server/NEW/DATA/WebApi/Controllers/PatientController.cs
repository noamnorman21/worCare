using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DATA;
using WebApi.DTO;
using System.Web.Http.Cors;

namespace WebApi.Controllers
{
    [RoutePrefix("api/Patient")]
    public class PatientController : ApiController
    {
        igroup194DB db = new igroup194DB();

        [HttpGet]
        [Route("GetPatient/{id}")]
        public IHttpActionResult GetPatient(string id)
        {
            try
            {
                var patient = db.tblPatients.Where(x => x.Id == id).FirstOrDefault();
                return Ok(patient.FirstName + " " + patient.LastName);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("InsertPatient")]
        public IHttpActionResult InsertPatient([FromBody] PatientDTO patient)
        {
            try
            {
                tblPatient patientExist = db.tblPatients.Where(x => x.Id == patient.Id).First();
                if (patientExist != null)
                    return BadRequest("Patient already exists");
                db.InsertPatient(patient.Id, patient.FirstName, patient.LastName, patient.DateOfBirth, patient.userId, patient.LanguageName_En);
                db.SaveChanges();
                return Ok("Patient added");
            }
            catch (Exception)
            {
                return BadRequest("Error in insert patient");
            }
        }

        [HttpPost]
        [Route("InsertPatientHobbies")]
        public IHttpActionResult InsertPatientHobbies([FromBody] HobbiesDTO hobbies)
        {
            try
            {
                tblPatient patientExist = db.tblPatients.Where(x => x.Id == hobbies.patientId).First();
                if (patientExist == null)
                    return BadRequest("Patient does not exist");




                db.SaveChanges();
                return Ok("Patient hobbies added");
            }
            catch (Exception)
            {
                return BadRequest("Error in insert patient hobbies");

            }
        }
    }
}