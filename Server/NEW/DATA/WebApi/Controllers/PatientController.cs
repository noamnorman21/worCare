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
        igroup194Db db = new igroup194Db();

        [HttpGet]
        [Route("GetPatient/{id}")] // Just for testing
        public IHttpActionResult GetPatient(string id)
        {
            try
            {
                var patient = db.tblPatient.Where(x => x.patientId == id).FirstOrDefault();
                return Ok(patient.FirstName + " " + patient.LastName);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
        [HttpPost]
        [Route("IsPatientExist")]
        public IHttpActionResult IsPatientExist([FromBody] PatientDTO patient)
        {
            try
            {
                var patientExist = db.tblPatient.Where(x => x.patientId == patient.patientId).FirstOrDefault();
                if (patientExist == null)
                {
                    return Ok("patient not exist");
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }


        }


        [HttpPost]
        [Route("GetAllPatients")]
        public IHttpActionResult GetAllPatients([FromBody] UserDTO user)
        {
            try
            {
                if (user.userType == "User")
                {
                    var patients = db.tblPatient.Where(x => x.userId == user.userId).Select(x => new PatientDTO
                    {
                        patientId = x.patientId,
                        FirstName = x.FirstName,
                        LastName = x.LastName,
                        userId= x.userId,
                        workerId = db.tblCaresForPatient.Where(y => y.patientId == x.patientId).Select(y => y.workerId).FirstOrDefault()
                    }).ToList();
                    if (patients != null)
                    {
                        return Ok(patients);
                    }
                    else
                        return BadRequest("No Patients Found");
                }
                else
                {
                    var patientIds = db.tblCaresForPatient.Where(x => x.workerId == user.userId).Select(x => x.patientId).ToList();
                    List<dynamic> patientList = new List<dynamic>();
                    foreach (var item in patientIds)
                    {
                        var temp = db.tblPatient.Where(x => x.patientId == item).Select(x => new PatientDTO
                        {
                            patientId = x.patientId,
                            FirstName = x.FirstName,
                            LastName = x.LastName,
                            workerId = db.tblCaresForPatient.Where(y => y.patientId == x.patientId).Select(y => y.workerId).FirstOrDefault(),
                            userId= x.userId
                        }).FirstOrDefault();
                        patientList.Add(temp);
                    }
                    return Ok(patientList);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("GetPatientData")]
        public IHttpActionResult GetPatientData([FromBody] string patientId)
        {
            try
            {
                // Get patient data from DB and Hobbies and Limitations from DTO                
                var patient = db.tblPatient.Where(x => x.patientId == patientId).FirstOrDefault();
                // Get patient's hobbies
                PatientDTO patientDTO = new PatientDTO();
                patientDTO.FirstName = patient.FirstName;
                patientDTO.LastName = patient.LastName;
                patientDTO.DateOfBirth = patient.DateOfBirth;
                patientDTO.patientId = patientId;
                patientDTO.LanguageName_En = patient.tblLanguage.LanguageName_En;
                return Ok(patientDTO);
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
                var patientExist = db.tblPatient.Where(x => x.patientId == patient.patientId).FirstOrDefault();
                if (patientExist == null)
                {
                    db.InsertPatient(patient.patientId, patient.FirstName, patient.LastName, patient.DateOfBirth, patient.userId, patient.LanguageName_En);
                    db.SaveChanges();
                    return Ok("Patient added successfully");
                }
                else
                {
                    return Ok("Patient already exist");
                }
            }
            catch (Exception ex)
            {
                return BadRequest("Error in insert patient= " + ex.Message);
            }
        }

        [HttpPost]
        [Route("InsertPatientHobbiesAndLimitations")]
        public IHttpActionResult InsertPatientHobbiesAndLimitations([FromBody] HobbiesAndLimitationsDTO patient)
        {
            try
            {
                tblPatient patientExist = db.tblPatient.Where(x => x.patientId == patient.patientId).First();
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
                db.InsertPatientHobbies(patientId, books, music, TVShow, radioChannel, food, drink, movie, specialHabits, afternoonNap, nightSleep, other);
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