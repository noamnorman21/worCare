﻿using DATA;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace WebApi.Controllers
{
    [RoutePrefix("api/Drug")]
    public class DrugController : ApiController
    {
        igroup194Db db = new igroup194Db();
        //get all drugs for show in search 
        [HttpGet]
        [Route("GetAllDrugs")]
        public IHttpActionResult GetAllDrugs()
        {
            try
            {
                var drugs = from d in db.tblDrug
                            select new
                            {
                                drugId = d.drugId,
                                drugName = d.drugName,
                                drugUrl = d.drugUrl,
                                modifyDate = d.modifyDate,
                                Type = d.Type,
                            };
                return Ok(drugs);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}