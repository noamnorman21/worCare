using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.DTO
{
    public class PaymentsRequestDTO
    {
        public int requestId { get; set; }
        public string requestSubject { get; set; }
        public double amountToPay { get; set; }
        public DateTime requestDate { get; set; }
        public string requestProofDocument { get; set; }
        public string requestComment { get; set; }
        public string requestStatus { get; set; }
        public int userId { get; set; }
        public int fId { get; set; }
        public Nullable<System.DateTime> requestEndDate { get; set; }

    }
}