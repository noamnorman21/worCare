﻿using System;
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
        [Route("GetPending/{id}")]
        [HttpGet]
        public IHttpActionResult GetPending(int id)
        {       
            try
            {
                
                var Payments = db.tblPaymentRequests.Where(x => x.userId == id && x.requestStatus == "R").Select(y => new PaymentsRequestDTO
                {
                    requestId = y.requestId,
                    requestSubject = y.requestSubject,
                    amountToPay = y.amountToPay,
                    requestDate = y.requestDate,
                    requestProofDocument = y.requestProofDocument,
                    requestComment = y.requestComment,
                    requestStatus = y.requestStatus,
                    userId=y.userId,                    
                }).ToList();
                return Ok(Payments);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Route("GetHistory/{id}")]
        [HttpGet]
        public IHttpActionResult GetHistory(int id)
        {
            try
            {
                var Payments = db.tblPaymentRequests.Where(x => x.userId == id && x.requestStatus == "C").Select(y => new PaymentsRequestDTO
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
        // GET: api/PaymentRequest/5
        [HttpGet]
        [Route("GetSpecificPayments/{id}")]       
        public IHttpActionResult GetSpecificPayments(int id)
        {
            try
            {
                
                var Payment = db.tblPaymentRequests.Where(x => x.requestId == id).Select(y => new PaymentsRequestDTO
                {
                    requestId = y.requestId,
                    requestSubject = y.requestSubject,
                    amountToPay = y.amountToPay,
                    requestDate = y.requestDate,
                    requestProofDocument = y.requestProofDocument,
                    requestComment = y.requestComment,
                    requestStatus = y.requestStatus,
                    userId = y.userId,                    
                }).FirstOrDefault();
                if (Payment != null)
                {
                    return Ok(Payment);
                }
                else
                {
                    return BadRequest("Payment not found!");
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
                tblPaymentRequest p = new tblPaymentRequest();
                p.requestSubject = req.requestSubject;
                p.amountToPay = req.amountToPay;
                p.requestDate = req.requestDate;
                p.requestProofDocument = req.requestProofDocument;
                p.requestComment = req.requestComment;
                p.requestStatus = req.requestStatus;
                p.userId = req.userId;
                db.tblPaymentRequests.Add(p);
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
        public IHttpActionResult UpdateRequest(PaymentsRequestDTO req)
        {
            try
            {
                tblPaymentRequest p = db.tblPaymentRequests.Where(x => x.requestId == req.requestId).FirstOrDefault();
                if (p != null)
                {
                    p.requestSubject = req.requestSubject;
                    p.amountToPay = req.amountToPay;
                    p.requestDate = req.requestDate;
                    p.requestProofDocument = req.requestProofDocument;
                    p.requestComment = req.requestComment;
                    p.requestStatus = req.requestStatus;
                    p.userId = req.userId;
                    db.tblPaymentRequests.Add(p);
                    db.SaveChanges();
                    return Ok("Request added successfully!");                   
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
        [Route("DeletePayment")]
        public IHttpActionResult DeleteContact([FromBody] PaymentsRequestDTO RequestToDelete)
        {
            try
            {
                var request = db.tblPaymentRequests.Where(x => x.requestId == RequestToDelete.requestId).FirstOrDefault();
                if (request == null)
                {
                    return NotFound();
                }
                db.tblPaymentRequests.Remove(request);
                db.SaveChanges();
                return Ok("Contact Deleted Successfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
       
    }
}
