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
        [Route("GetPayments/{id}")]
        [HttpGet]
        public IHttpActionResult GetPayments(int id)
        {
            try
            {

                var Payments = db.tblPaymentRequests.Where(x => x.userId == id).Select(y => new PaymentsRequestDTO
                {
                    requestId = y.requestId,
                    requestSubject = y.requestSubject,
                    amountToPay = y.amountToPay,
                    requestDate = y.requestDate,
                    requestProofDocument = y.requestProofDocument,
                    requestComment = y.requestComment,
                    requestStatus = y.requestStatus,
                    userId = y.userId,
                    fId = y.tblForeignUser.Id
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
                    fId = y.tblForeignUser.Id
                }).FirstOrDefault();
                return Ok(Payment);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST: api/PaymentRequest
        public void Post([FromBody] string value)
        {
        }

        // PUT: api/PaymentRequest/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/PaymentRequest/5
        public void Delete(int id)
        {
        }
    }
}