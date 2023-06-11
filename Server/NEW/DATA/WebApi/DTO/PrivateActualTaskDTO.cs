using DATA;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.DTO
{
    public class PrivateActualTaskDTO
    {
        public int actualId { get; set; }
        public int taskId { get; set; }
        public System.TimeSpan TimeInDay { get; set; }
        public System.DateTime taskDate { get; set; }
        public string taskStatus { get; set; }

        public string taskName { get; set; }
        public string frequency { get; set; }
        public string taskComment { get; set; }
        public int workerId { get; set; }


        public virtual tblPrivateTask tblPrivateTask { get; set; }
    }
}