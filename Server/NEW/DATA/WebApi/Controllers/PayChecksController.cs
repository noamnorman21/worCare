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

        // GET: api/PayChecks -- > לתקן לפי מטופל בודד ומטפל בודד
        //[HttpPost]
        //[Route("GetPaychecks")]
        //public IHttpActionResult GetPaychecks([FromBody] UserDTO user)
        //{
        //    try
        //    {
        //        if (user.userType == "User")
        //        {
        //            var Patients = db.tblCaresForPatient.Where(x => x.workerId == user.userId).Select(y => y.patientId).ToList();
        //            var users = new List<List<UserDTO>>();
                    
        //            var Contacts = db.tblPaycheck.Where(x => x.UserId == user.userId).Select(y => new PayCheckDTO
        //            {
        //                payCheckNum = y.payCheckNum,
        //                paycheckDate = y.paycheckDate,
        //                paycheckSummary = y.paycheckSummary,
        //                paycheckComment = y.paycheckComment,
        //                UserId = y.UserId,
        //            }).ToList();
        //            return Ok(Contacts);
        //        }
        //        else
        //        {
        //            foreach (var patient in Patients)
        //            {
        //                var tempo = db.tblPatient.Where(x => x.patientId == patient).Select(y => new UserDTO{
        //                    userId= y.userId,
        //                    }).ToList();
        //                users.Add(tempo);
        //            }
        //            var temp = new List<dynamic>();
        //            foreach (var item in users)
        //            {
        //                foreach (var item2 in item)
        //                {
        //                    var Paycheks = db.tblPaycheck.Where(x => x.UserId == item2.userId).Select(y => new PayCheckDTO
        //                    {
        //                        payCheckNum = y.payCheckNum,
        //                        paycheckDate = y.paycheckDate,
        //                        paycheckSummary = y.paycheckSummary,
        //                        paycheckComment = y.paycheckComment,
        //                        UserId = y.UserId,
        //                    }).ToList();
        //                    foreach (var paycheck in Paycheks)
        //                    {
        //                        temp.Add(paycheck);
        //                    }
        //                }
        //            }                    
        //            return Ok(temp);
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}

        // POST: api/PayChecks
        
        [HttpPost]
        [Route("NewPayCheck")] // פונקציה להוספת פייקצ'ק חדש
        public IHttpActionResult NewPayCheck([FromBody] PayCheckDTO pay)
        {
            try
            {
                db.NewPaycheck(pay.paycheckDate, pay.paycheckSummary, pay.paycheckComment, pay.UserId);
                db.SaveChanges();
                return Ok("Paycheck added successfully!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
        [HttpPut] // PUT: api/PayChecks/UpdatePayCheck
        [Route("UpdatePayCheck")]
        public IHttpActionResult UpdatePayCheck([FromBody] PayCheckDTO pay)
        {
            try
            {
                tblPaycheck p = db.tblPaycheck.Where(x => x.payCheckNum == pay.payCheckNum).FirstOrDefault();
                if (p != null)
                {
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