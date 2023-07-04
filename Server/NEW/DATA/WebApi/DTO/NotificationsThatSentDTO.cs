using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.DTO
{
    public class NotificationsThatSentDTO
    {
        public int notificationID { get; set; }
        public string title { get; set; }
        public string pushMessage { get; set; }
        public System.DateTime time { get; set; }
        public int userId { get; set; }
        public string status { get; set; }
    }
}