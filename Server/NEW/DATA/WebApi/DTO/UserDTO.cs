using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.DTO
{
    public class UserDTO
    {
        public int userId { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string gender { get; set; }
        public string phoneNum { get; set; }
        public string userUri { get; set; }
        public int[] Calendars { get; set; }

        public string userType { get; set; }
    }
}