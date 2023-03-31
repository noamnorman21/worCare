using DATA;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.DTO
{
    public class PatientTaskDTO
    {

        public int taskId { get; set; }
        public string taskName { get; set; }
        public System.DateTime taskFromDate { get; set; }
        public Nullable<System.DateTime> taskToDate { get; set; }
        public string taskComment { get; set; }
        public string taskStatus { get; set; }
        public string patientId { get; set; }
        public int workerId { get; set; }
        public int userId { get; set; }
        public int listId { get; set; }
        public Nullable<System.TimeSpan> TimeInDay { get; set; }
        public string period { get; set; }

        public virtual tblActualList tblActualList { get; set; }
        public virtual tblForeignUser tblForeignUser { get; set; }
        public virtual tblPatient tblPatient { get; set; }
        public virtual tblUser tblUser { get; set; }
    }
}