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
                // {"BirthDate": "01-08-1927", "FirstName": "Sara", "Id": "577042518", "Language": "Arabic", "LastName": "Bibi", "userId": 147}
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
        [Route("InsertPatientHobbiesAndLimitations")]
        public IHttpActionResult InsertPatientHobbiesAndLimitations([FromBody] HobbiesAndLimitationsDTO patient)
        {
            try
            {
                tblPatient patientExist = db.tblPatients.Where(x => x.Id == patient.patientId).First();
                if (patientExist == null)
                    return BadRequest("Patient does not exist");
                string books = patient.books;
                string music = patient.music;
                string TVShow = patient.TVShow;
                string radioChannel = patient.radioChannel;
                string food = patient.food;
                string drink = patient.drink;
                string specialHabits = patient.specialHabits;
                string afternoonNap = patient.afternoonNap;
                string movie = patient.movie;
                string nightSleep = patient.nightSleep;
                string other = patient.otherH;
                string patientId = patient.patientId;
                
                db.InsertPatientHobbies(patientId, books, music, TVShow, radioChannel, food, drink, specialHabits, afternoonNap, movie, nightSleep, other);                
                db.InsertPatientLimitations(patientId, patient.allergies, patient.sensitivities, patient.physicalAbilities, patient.bathRoutine, patient.sensitivityToNoise, patient.otherL);                
                db.SaveChanges();                
                return Ok("Patient Details added");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}