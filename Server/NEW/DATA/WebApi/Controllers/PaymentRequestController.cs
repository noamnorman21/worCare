using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DATA;
using WebApi.DTO;

namespace WebApi.Controllers
{
    [RoutePrefix("api/Payments")]
    public class PaymentRequestController : ApiController
    {
        igroup194Db db = new igroup194Db();

        // GET: api/PaymentRequest
        [Route("GetPending")]
        [HttpPost]
        public IHttpActionResult GetPending([FromBody] UserDTO user)
        {
            try
            {
                int id;
                if (user.userType == "User")
                {
                    string patient = db.tblPatient.Where(x => x.userId == user.userId).Select(y=> y.patientId).FirstOrDefault();
                    id = db.tblCaresForPatient.Where(x => x.patientId == patient).Select(y=>y.workerId).FirstOrDefault();
                }
                else
                {
                    id = user.userId;
                }
                    var Pendings = db.tblPaymentRequest.Where(x => x.userId == id && x.requestStatus == "P").Select(y => new PaymentsRequestDTO
                    {
                        requestId = y.requestId,
                        requestSubject = y.requestSubject,
                        amountToPay = y.amountToPay,
                        requestDate = y.requestDate,
                        requestProofDocument = y.requestProofDocument,
                        requestComment = y.requestComment,
                        requestStatus = y.requestStatus,
                        userId = y.userId,
                    }).ToList();
                    return Ok(Pendings);                
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("GetHistory/")]
        [HttpPost]
        public IHttpActionResult GetHistory([FromBody] UserDTO user)
        {
            try
            {
                int id;
                if (user.userType == "User")
                {
                    string patient = db.tblPatient.Where(x => x.userId == user.userId).Select(y => y.patientId).FirstOrDefault();
                    id = db.tblCaresForPatient.Where(x => x.patientId == patient).Select(y => y.workerId).FirstOrDefault();
                }
                else
                {
                    id = user.userId;
                }
               
                    var Payments = db.tblPaymentRequest.Where(x => x.userId == id && x.requestStatus != "P").Select(y => new PaymentsRequestDTO
                    {
                        requestId = y.requestId,
                        requestSubject = y.requestSubject,
                        amountToPay = y.amountToPay,
                        requestDate = y.requestDate,
                        requestProofDocument = y.requestProofDocument,
                        requestComment = y.requestComment,
                        requestStatus = y.requestStatus,
                        userId = y.userId,
                    }).ToList();
                    return Ok(Payments);
                
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST: api/PaymentRequest
        [HttpPost]
        [Route("NewRequest")]
        public IHttpActionResult NewRequest([FromBody] PaymentsRequestDTO req)
        {
            try
            {                
                db.NewPaymentRequest(req.requestSubject, req.amountToPay, req.requestDate, req.requestProofDocument, req.requestComment, req.requestStatus, req.userId);
                db.SaveChanges();
                return Ok("Request added successfully!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/PaymentRequest/5
        [HttpPut]
        [Route("UpdateRequest")]
        public IHttpActionResult UpdateRequest([FromBody] PaymentsRequestDTO req)
        {
            try
            {
                var p = db.tblPaymentRequest.Where(x => x.requestId == req.requestId).FirstOrDefault();
                if (p != null)
                {
                    p.requestSubject = req.requestSubject;
                    p.amountToPay = req.amountToPay;
                    p.requestDate = req.requestDate;
                    p.requestProofDocument = req.requestProofDocument;
                    p.requestComment = req.requestComment;
                    p.requestStatus = req.requestStatus;
                    p.userId = req.userId;
                    db.SaveChanges();
                    return Ok("Request Updated successfully!");
                }
                else
                {
                    return BadRequest("requset not found");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("UpdateStatus")]
        public IHttpActionResult UpdateStatus([FromBody] int requestId)
        {
            try
            {
                var p = db.tblPaymentRequest.Where(x => x.requestId == requestId).FirstOrDefault();
                if (p != null)
                {
                    p.requestStatus = "F";
                    db.SaveChanges();
                    return Ok("Status Updated successfully!");
                }
                else
                {
                    return BadRequest("requset not found");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        [Route("DeletePayment/{id}")]
        public IHttpActionResult DeletePayment(int id)
        {
            try
            {
                var request = db.tblPaymentRequest.Where(x => x.requestId == id).FirstOrDefault();
                if (request == null)
                {
                    return NotFound();
                }
                db.tblPaymentRequest.Remove(request);
                db.SaveChanges();
                return Ok("Payment Request Deleted Successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}