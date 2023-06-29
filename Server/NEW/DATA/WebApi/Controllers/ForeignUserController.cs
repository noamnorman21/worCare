using DATA;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApi.DTO;
using System.Web.Http.Cors;
using Expo.Server.Client;
using Expo.Server.Models;
using Newtonsoft.Json;
using System.Text;
using System.Web.Script.Serialization;

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
                tblUser userExist = db.tblUser.Where(x => x.userId == user.Id).FirstOrDefault();
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
                int involvedId = db.tblPatient.Where(x => x.patientId == CaresForPatientDTO.patientId).Select(x => x.userId).FirstOrDefault();
                string userToken = db.tblUser.Where(x => x.userId == involvedId).Select(x => x.pushToken).FirstOrDefault();
                string foreignName = db.tblUser.Where(x => x.userId == CaresForPatientDTO.workerId).Select(x => x.FirstName).FirstOrDefault();
                if (userToken != null)
                {
                    var objectToSend = new
                    {
                        to = userToken,
                        title = "Pairing Confirmation",
                        body = foreignName + " And You Are Now Paired",
                        //data = item.data
                    };
                    string postData = JsonConvert.SerializeObject(objectToSend);
                    var content = new StringContent(postData, Encoding.UTF8, "application/json");
                    SendPushNotification(content);
                    
                    
                }
                return Ok("linked succesfuly");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Send Push async function
        private static HttpClient client = new HttpClient();
        public async void SendPushNotification(StringContent content)
        {
            HttpResponseMessage response = await client.PostAsync("https://exp.host/--/api/v2/push/send", content);
            return;

        }
    }
}