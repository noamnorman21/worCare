using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.DTO
{
    public class DrugForPatientDTO
    {
        public int listId { get; set; }
        public System.DateTime fromDate { get; set; }
        public System.DateTime toDate { get; set; }
        public byte dosage { get; set; }
        public Nullable<int> qtyInBox { get; set; }
        public Nullable<byte> minQuantity { get; set; }
        public int drugId { get; set; }
        public string patientId { get; set; }
        public TimeSpan[] timesInDayArray { get; set; } //array of TimeSpan
        public Nullable<System.DateTime> lastTakenDate { get; set; }                                     //

        //will come from tbldrug
        public string drugName { get; set; }
        public string drugUrl { get; set; }
        public string drugType { get; set; }
        public string taskComment { get; set; }
    }
}