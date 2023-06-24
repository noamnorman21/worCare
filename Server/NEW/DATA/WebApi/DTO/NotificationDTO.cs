using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.DTO
{
    public class NotificationDTO
    {
        public int notificationID { get; set; }
        public string pushToken { get; set; }
        public string title { get; set; }
        public string pushMessage { get; set; }
        public System.DateTime scheduledTime { get; set; }
        public string data { get; set; }
        public Nullable<int> actualTaskId { get; set; }
        public Nullable<int> paymentId { get; set; }

    }
}