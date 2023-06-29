using DATA;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.DTO
{
    public class ActualTaskDTO
    {
        public int actualId { get; set; }
        public int taskId { get; set; }
        public System.TimeSpan TimeInDay { get; set; }
        public System.DateTime taskDate { get; set; }
        public string taskStatus { get; set; }
        public string taskName { get; set; }
        public string frequency { get; set; }
        public string taskComment { get; set; }
        public string patientId { get; set; }
        public int workerId { get; set; }
        public int userId { get; set; }
        public int listId { get; set; }
        public Nullable<bool> type { get; set; }
        public List<ProductListDTO> prodList { get; set; } //will be relevant only if the type will be prodact list (type=false)
        public DrugForPatientDTO drug { get; set; } //will be relevant only if the type will be drug (type=true)
        public string timesInDayArray { get; set; }
    }
}