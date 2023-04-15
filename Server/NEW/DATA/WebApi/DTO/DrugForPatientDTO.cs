﻿using System;
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

    }
}