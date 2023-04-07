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
        igroup194Db db = new igroup194Db();
<<<<<<< HEAD
        [HttpGet]
        [Route("GetPaychecks/{id}")]
        public IHttpActionResult GetPaychecks(int id)
=======

        // GET: api/PayChecks
        [HttpPost]
        [Route("GetPaychecks")]
        public IHttpActionResult GetPaychecks([FromBody] int id)
>>>>>>> 12d71edbeb8a217a97cfc076f851e81f7fea37eb
        {

            try
            {
                var Contacts = db.tblPaycheck.Where(x => x.UserId == id).Select(y => new PayCheckDTO
                {
                    payCheckNum = y.payCheckNum,
                    paycheckDate = y.paycheckDate,
                    paycheckSummary = y.paycheckSummary,
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
                var Contacts = db.tblPaycheck.Where(x => x.payCheckNum == num).Select(y => new PayCheckDTO
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
<<<<<<< HEAD
                int id = db.tblPaymentRequest.Max(x => x.requestId) + 1;
                int num = db.tblPaycheck.Max(x => x.payCheckNum) + 1;
=======
                int num;
                int rows = db.tblPaycheck.Count();
                if (rows > 0)
                {
                    num = db.tblPaycheck.Max(x => x.payCheckNum) + 1;
                }
                else
                {
                    num = 1;
                }
>>>>>>> 12d71edbeb8a217a97cfc076f851e81f7fea37eb
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
                tblPaycheck p = db.tblPaycheck.Where(x => x.payCheckNum == pay.payCheckNum).FirstOrDefault();
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
                var p = db.tblPaycheck.Where(x => x.payCheckNum == num).FirstOrDefault();
                if (p == null)
                {
                    return NotFound();
                }
                else
                {
                    db.tblPaycheck.Remove(p);
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