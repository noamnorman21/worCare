using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.DTO
{
    public class ContactDTO    {

        public int contactId { get; set; }

        public string contactName { get; set; }

        public string phoneNo { get; set; }

        public string mobileNo { get; set; }

        public string email { get; set; }

        public string role { get; set; }

        public string contactComment { get; set; }

        public string patientId { get; set; }
    }
}