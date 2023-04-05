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
                    List<List<ForeignUserDTO>> careId = new List<List<ForeignUserDTO>>();
                    var PatientId = db.tblPatients.Where(x => x.userId == user.Id).Select(y => y.Id).ToList();
                    foreach (var patient in PatientId)
                    {
                        var Carers = db.tblCaresForPatients.Where(x => x.patientId == patient).Select(y => new ForeignUserDTO
                        {
                            Id = y.workerId,
                        }).ToList();
                        careId.Add(Carers);
                    }
                    var temp = new List<dynamic>();
                    foreach (var carer in careId)
                    {
                        foreach (var item in carer)
                        {
                            temp.Add(db.tblPaymentRequests.Where(x => x.userId == item.Id && x.requestStatus == "P").Select(y => new PaymentsRequestDTO
                            {
                                requestId = y.requestId,
                                requestSubject = y.requestSubject,
                                amountToPay = y.amountToPay,
                                requestDate = y.requestDate,
                                requestProofDocument = y.requestProofDocument,
                                requestComment = y.requestComment,
                                requestStatus = y.requestStatus,
                                userId = y.userId,
                            }));
                        }

                    }
                    var Requests = new List<PaymentsRequestDTO>();
                    foreach (var worker in temp)
                    {
                        foreach (var item in worker)
                        {
                            Requests.Add(item);
                        }
                    }
                    return Ok(Requests);
                }
                else
                {
                    id = user.Id;
                    var Payments = db.tblPaymentRequests.Where(x => x.userId == id && x.requestStatus == "P").Select(y => new PaymentsRequestDTO
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
                    List<List<ForeignUserDTO>> careId = new List<List<ForeignUserDTO>>();
                    var PatientId = db.tblPatients.Where(x => x.userId == user.Id).Select(y => y.Id).ToList();
                    foreach (var patient in PatientId)
                    {
                        var Carers = db.tblCaresForPatients.Where(x => x.patientId == patient).Select(y => new ForeignUserDTO
                        {
                            Id = y.workerId,
                        }).ToList();
                        careId.Add(Carers);
                    }
                    var temp = new List<dynamic>();
                    foreach (var carer in careId)
                    {
                        foreach (var item in carer)
                        {
                            temp.Add(db.tblPaymentRequests.Where(x => x.userId == item.Id && x.requestStatus != "P").Select(y => new PaymentsRequestDTO
                            {
                                requestId = y.requestId,
                                requestSubject = y.requestSubject,
                                amountToPay = y.amountToPay,
                                requestDate = y.requestDate,
                                requestProofDocument = y.requestProofDocument,
                                requestComment = y.requestComment,
                                requestStatus = y.requestStatus,
                                userId = y.userId,
                            }));
                        }

                    }
                    var Requests = new List<PaymentsRequestDTO>();
                    foreach (var worker in temp)
                    {
                        foreach (var item in worker)
                        {
                            Requests.Add(item);
                        }
                    }
                    return Ok(Requests);
                }
                else
                {
                    id = user.Id;
                    var Payments = db.tblPaymentRequests.Where(x => x.userId == id && x.requestStatus != "P").Select(y => new PaymentsRequestDTO
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
                int id = db.tblPaymentRequests.Max(x => x.requestId) + 1;
                db.NewPaymentRequest(id, req.requestSubject, req.amountToPay, req.requestDate, req.requestProofDocument, req.requestComment, req.requestStatus, req.userId);
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
                var p = db.tblPaymentRequests.Where(x => x.requestId == req.requestId).FirstOrDefault();
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
                throw;
            }
        }

        [HttpPut]
        [Route("UpdateStatus")]
        public IHttpActionResult UpdateStatus([FromBody] int requestId)
        {
            try
            {
                var p = db.tblPaymentRequests.Where(x => x.requestId == requestId).FirstOrDefault();
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
                throw;
            }
        }

        [HttpDelete]
        [Route("DeletePayment/{id}")]
        public IHttpActionResult DeletePayment(int id)
        {
            try
            {
                var request = db.tblPaymentRequests.Where(x => x.requestId == id).FirstOrDefault();
                if (request == null)
                {
                    return NotFound();
                }
                db.tblPaymentRequests.Remove(request);
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