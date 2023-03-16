using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.DTO
{
    public class CaresForPatientDTO
    {
        public string patientId { get; set; }
        public int workerId { get; set; }
        public string status { get; set; }
        public string linkTo { get; set; }
    }
}