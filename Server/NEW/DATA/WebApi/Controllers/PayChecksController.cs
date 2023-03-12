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
    [RoutePrefix("api/PayChecks")]
    public class PayChecksController : ApiController
    {
        igroup194DB db = new igroup194DB();

        // GET: api/PayChecks
        [HttpGet]
        [Route("GetPaychecks/{id}")]
        public IHttpActionResult GetPaychecks(int id)
        {          

            try
            {
                var Contacts = db.tblPaychecks.Where(x => x.UserId == id).Select(y => new PayCheckDTO
                {                    
                    payCheckNum = y.payCheckNum,                   
                    paycheckDate= y.paycheckDate,
                    paycheckSummary= y.paycheckSummary,
                    paycheckComment = y.paycheckComment,
                    UserId = y.UserId,
                }).ToList();
                return Ok(Contacts);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetSpecificPayCheck/{num}")]
        public IHttpActionResult GetSpecificPayCheck(int num)
        {
            try
            {
                var Contacts = db.tblPaychecks.Where(x => x.payCheckNum == num).Select(y => new PayCheckDTO
                {
                    payCheckNum = y.payCheckNum,
                    paycheckDate = y.paycheckDate,
                    paycheckSummary = y.paycheckSummary,
                    paycheckComment = y.paycheckComment,
                    UserId = y.UserId,
                }).FirstOrDefault();
                return Ok(Contacts);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // POST: api/PayChecks
        [HttpPost]
        [Route("NewPayCheck")]
        public IHttpActionResult NewPayCheck([FromBody] PayCheckDTO pay)
        {
            try
            {
                int id = db.tblPaymentRequests.Max(x => x.requestId) + 1;
                int num = db.tblPaychecks.Max(x => x.payCheckNum) +1 ;
                db.NewPaycheck(num, pay.paycheckDate, pay.paycheckSummary, pay.paycheckComment, pay.UserId);
                db.SaveChanges();
                return Ok("Paycheck added successfully!");

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        // PUT: api/PayChecks/UpdatePayCheck
        [HttpPut]
        [Route("UpdatePayCheck")]
        public IHttpActionResult UpdatePayCheck([FromBody] PayCheckDTO pay)
        {
            try
            {
                tblPaycheck p = db.tblPaychecks.Where(x => x.payCheckNum == pay.payCheckNum).FirstOrDefault();
                if (p != null)
                {
                    p.payCheckNum = pay.payCheckNum;
                    p.paycheckDate = pay.paycheckDate;
                    p.paycheckSummary = pay.paycheckSummary;
                    p.paycheckComment = pay.paycheckComment;
                    p.UserId = pay.UserId;                    
                    db.SaveChanges();
                    return Ok("Request added successfully!");
                }
                else
                {
                    return BadRequest("Paycheck not found");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
                throw;
            }
        }


        // DELETE: api/PayChecks/5
        [HttpDelete]
        [Route("DeletePaycheck/{num}")]
        public IHttpActionResult DeletePaycheck(int num)
        {
            try
            {
                var p = db.tblPaychecks.Where(x => x.payCheckNum == num).FirstOrDefault();
                if (p == null)
                {
                    return NotFound();
                }
                else
                {
                    db.tblPaychecks.Remove(p);
                    db.SaveChanges();
                    return Ok("Paycheck Deleted Successfully");
                }               
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
    }
}
