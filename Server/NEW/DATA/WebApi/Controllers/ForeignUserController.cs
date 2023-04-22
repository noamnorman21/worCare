using DATA;
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
        igroup194Db db = new igroup194Db();

        [HttpPost]
        [Route("InsertForeignUser")]
        public IHttpActionResult InsertForeignUser([FromBody] ForeignUserDTO user)
        {
            try
            {
                tblUser userExist = db.tblUser.Where(x => x.userId == user.Id).First();
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

        [HttpPost]
        [Route("InsertCaresForPatient")] //function to link Caregiver with patient
        public IHttpActionResult InsertCaresForPatient([FromBody] CaresForPatientDTO CaresForPatientDTO)
        {
            try
            {
                foreach (tblCaresForPatient item in db.tblCaresForPatient)
                {
                    if (CaresForPatientDTO.workerId == item.workerId && CaresForPatientDTO.patientId == item.patientId && item.status == "A")
                        return BadRequest("This worker already cares for this patient");
                }
                //P is status pending, we will use triger to change it to A after the user will approve 
                db.InsertCaresForPatient(CaresForPatientDTO.patientId, CaresForPatientDTO.workerId, "P", CaresForPatientDTO.linkTo);
                db.SaveChanges();
                return Ok("linked succesfuly");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}