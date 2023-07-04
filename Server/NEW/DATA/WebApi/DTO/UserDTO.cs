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
        public List<string> calendarCode { get; set; }
        public string userType { get; set; }
        public string patientId { get; set; }
        public int workerId { get; set; }
        public int involvedInId { get; set; }
        public string CountryName_En { get; set; }
        public PatientDTO patient { get; set; }
        public string pushToken { get; set; }
        public string lastToken { get; set; }
        public string pushTokenSecoundSide { get; set; }
        public List<NotificationsThatSentDTO> notification { get; set; } //this is 
        public Nullable<bool> financeNotifications { get; set; }
        public Nullable<bool> chatNotifications { get; set; }
        public Nullable<bool> medNotifications { get; set; }
        public Nullable<bool> tasksNotifications { get; set; }
        
    }
}