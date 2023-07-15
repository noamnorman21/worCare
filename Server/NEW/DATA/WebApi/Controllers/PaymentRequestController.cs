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
        igroup194DB db = new igroup194DB();

        [HttpPost]
        [Route("GetPending")]
        public IHttpActionResult GetPending([FromBody] UserDTO user)
        {
            try
            {
                int id;
                if (user.userType == "User")
                {
                    id = user.workerId;
                    var Pendings = db.tblPaymentRequest.Where(x => x.userId == id && x.requestStatus == "P").Select(y => new PaymentsRequestDTO
                    {
                        requestId = y.requestId,
                        requestSubject = y.requestSubjectHeb,
                        amountToPay = y.amountToPay,
                        requestDate = y.requestDate,
                        requestProofDocument = y.requestProofDocument,
                        requestComment = y.requestCommentHeb,
                        requestStatus = y.requestStatus,
                        userId = y.userId,
                        requestEndDate = y.requestEndDate,
                    }).ToList();
                    return Ok(Pendings);
                }
                else
                {
                    id = user.userId;
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
                        requestEndDate = y.requestEndDate,
                    }).ToList();
                    return Ok(Pendings);
                }           
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("GetHistory")]
        public IHttpActionResult GetHistory([FromBody] UserDTO user)
        {
            try
            {
                int id;
                if (user.userType == "User")
                {
                    string patient = user.patientId;
                    id = user.workerId;
                }
                else
                    id = user.userId;
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
                    requestEndDate = y.requestEndDate,
                }).ToList();
                return Ok(Payments);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("NewRequest")]
        public IHttpActionResult NewRequest([FromBody] PaymentsRequestDTO req)
        {
            try
            {
                DateTime endDate = req.requestDate.AddDays(14); // requestEndDate should be requestDate + 14 days
                db.NewPaymentRequest(req.requestSubject, req.amountToPay, req.requestDate, req.requestProofDocument, req.requestComment, req.requestStatus, req.userId, endDate, req.requestCommentHeb,req.requestSubjectHeb);
                int requestId = db.tblPaymentRequest.Max(x => x.requestId);
                var user = from u in db.tblUser
                             where u.pushToken == req.pushToken2
                             select u;
                int userId = user.FirstOrDefault().userId;
                db.InsertScheduledNotification(req.pushToken2, "Reminder: Payment Request", "You have a pending payment request", endDate, null, null, requestId,null, userId);
                db.SaveChanges();
                return Ok("Request added successfully!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("UpdateRequest")]
        public IHttpActionResult UpdateRequest([FromBody] PaymentsRequestDTO req)
        {
            try
            {
                var p = db.tblPaymentRequest.Where(x => x.requestId == req.requestId).FirstOrDefault();
                if (p != null)
                {
                    p.requestCommentHeb = req.requestCommentHeb;
                    p.requestSubjectHeb = req.requestSubjectHeb;               
                    p.requestSubject = req.requestSubject;              
                    p.amountToPay = req.amountToPay;
                    p.requestDate = req.requestDate;
                    DateTime endDate = req.requestDate.AddDays(14); // requestEndDate should be requestDate + 14 days
                    p.requestProofDocument = req.requestProofDocument;
                    p.requestComment = req.requestComment;
                    p.requestStatus = req.requestStatus;
                    p.userId = req.userId;
                    db.SaveChanges();
                    return Ok("Request Updated successfully!");
                }
                return NotFound();
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
                return NotFound();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("DeletePayment")]
        public IHttpActionResult DeletePayment([FromBody] PaymentsRequestDTO payment)
        {
            try
            {
                var request = db.tblPaymentRequest.Where(x => x.requestId == payment.requestId).FirstOrDefault();
                if (request == null)
                {
                    return NotFound();
                }
                request.requestStatus = payment.requestStatus;
                db.SaveChanges();
                return Ok("Payment Request Changed Successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}