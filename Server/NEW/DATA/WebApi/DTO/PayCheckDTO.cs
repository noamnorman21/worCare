using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.DTO
{
    public class PayCheckDTO
    {
        public int payCheckNum { get; set; }
        public System.DateTime paycheckDate { get; set; }
        public string paycheckSummary { get; set; }
        public string paycheckComment { get; set; }
        public int UserId { get; set; }

        public string payCheckProofDocument { get; set; }
    }
}