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
                        userId = x.userId,
                        workerId = db.tblCaresForPatient.Where(y => y.patientId == x.patientId).Select(y => y.workerId).FirstOrDefault()
                    }).ToList();
                    if (patients != null)
                    {
                        foreach (PatientDTO patientDTO in patients)
                        {
                            var hobbies = from h in db.tblHobbies
                                          where h.patientId == patientDTO.patientId
                                          select h;
                            var limitations = from l in db.tblLimitations
                                              where l.patientId == patientDTO.patientId
                                              select l;
                            patientDTO.hobbiesAndLimitationsDTO = new List<HobbiesAndLimitationsDTO>();
                            HobbiesAndLimitationsDTO hlDTO = new HobbiesAndLimitationsDTO();
                            foreach (var item in hobbies)
                            {
                                hlDTO.food = item.food;
                                hlDTO.music = item.music;
                                hlDTO.movie = item.movie;
                                hlDTO.books = item.books;
                                hlDTO.drink = item.drink;
                                hlDTO.radioChannel = item.radioChannel;
                                hlDTO.TVShow = item.TVShow;
                                hlDTO.specialHabits = item.specialHabits;
                                hlDTO.afternoonNap = item.afternoonNap;
                                hlDTO.nightSleep = item.nightSleep;
                                hlDTO.otherH = item.other;
                            }
                            foreach (var item in limitations)
                            {
                                hlDTO.allergies = item.allergies;
                                hlDTO.sensitivities = item.sensitivities;
                                hlDTO.physicalAbilities = item.physicalAbilities;
                                hlDTO.bathRoutine = item.bathRoutine;
                                hlDTO.sensitivityToNoise = item.sensitivityToNoise;
                                hlDTO.otherL = item.other;
                            }
                            patientDTO.hobbiesAndLimitationsDTO.Add(hlDTO);
                        }
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
                        var patientDTO = db.tblPatient.Where(x => x.patientId == item).Select(x => new PatientDTO
                        {
                            patientId = x.patientId,
                            FirstName = x.FirstName,
                            LastName = x.LastName,
                            workerId = user.userId,
                            userId = x.userId,
                            DateOfBirth = x.DateOfBirth,
                            LanguageName_En = x.LanguageName_En,

                        }).FirstOrDefault();
                        var hobbies = from h in db.tblHobbies
                                      where h.patientId == patientDTO.patientId
                                      select h;
                        var limitations = from l in db.tblLimitations
                                          where l.patientId == patientDTO.patientId
                                          select l;
                        patientDTO.hobbiesAndLimitationsDTO = new List<HobbiesAndLimitationsDTO>();
                        HobbiesAndLimitationsDTO hlDTO = new HobbiesAndLimitationsDTO();
                        foreach (var item1 in hobbies)
                        {
                            hlDTO.food = item1.food;
                            hlDTO.music = item1.music;
                            hlDTO.movie = item1.movie;
                            hlDTO.books = item1.books;
                            hlDTO.drink = item1.drink;
                            hlDTO.radioChannel = item1.radioChannel;
                            hlDTO.TVShow = item1.TVShow;
                            hlDTO.specialHabits = item1.specialHabits;
                            hlDTO.afternoonNap = item1.afternoonNap;
                            hlDTO.nightSleep = item1.nightSleep;
                            hlDTO.otherH = item1.other;
                        }
                        foreach (var item2 in limitations)
                        {
                            hlDTO.allergies = item2.allergies;
                            hlDTO.sensitivities = item2.sensitivities;
                            hlDTO.physicalAbilities = item2.physicalAbilities;
                            hlDTO.bathRoutine = item2.bathRoutine;
                            hlDTO.sensitivityToNoise = item2.sensitivityToNoise;
                            hlDTO.otherL = item2.other;
                        }
                        patientDTO.hobbiesAndLimitationsDTO.Add(hlDTO);
                        patientList.Add(patientDTO);
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


        [HttpPut]
        [Route("UnpairPatient")]
        public IHttpActionResult UnpairPatient([FromBody] UserDTO user)
        {
            try
            {
                var patientTasks = db.tblPatientTask.Where(x => x.workerId == user.workerId).ToList();
                foreach (var task in patientTasks)
                {
                    var actuall = db.tblActualTask.Where(y => y.taskId == task.taskId).ToList();
                    foreach (var act in actuall)
                    {
                        var noti = db.tblScheduledNotifications.Where(y => y.actualTaskId == act.actualId).FirstOrDefault();
                        var request = db.tblPaymentRequest.Where(x => x.userId == task.workerId).ToList();
                        if (noti != null)
                        {
                            db.tblScheduledNotifications.Remove(noti);
                        }
                        foreach (var item in request)
                        {
                            var noti1 = db.tblScheduledNotifications.Where(y => y.paymentId == item.requestId).ToList();
                            foreach (var item1 in noti1)
                            {
                                db.tblScheduledNotifications.Remove(item1);
                            }
                        }
                        db.tblActualTask.Remove(act);
                    }
                    task.workerId = null;
                }

                //remove cares for patient
                var cForp = db.tblCaresForPatient.Where(x => x.patientId == user.patientId && x.workerId == user.workerId).FirstOrDefault();
                if (cForp != null)
                {
                    db.tblCaresForPatient.Remove(cForp);
                }
                db.SaveChanges();
                return Ok("Pairing sucssesfully removed");

            }
            catch (Exception ex)
            {
                return BadRequest("Pairing: " + ex.Message);
            }
        }
    }
}