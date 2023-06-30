using DATA;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.DTO
{
    public class PatientDTO
    {
        public string patientId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public System.DateTime DateOfBirth { get; set; }

        public int workerId { get; set; }
        public int userId { get; set; }
        public string LanguageName_En { get; set; }
        public virtual ICollection<tblCaresForPatient> tblCaresForPatient { get; set; }
        public virtual ICollection<tblContacts> tblContacts { get; set; }
        public virtual ICollection<tblDrugForPatient> tblDrugForPatient { get; set; }
        public virtual tblLanguage tblLanguage { get; set; }
        public virtual ICollection<HobbiesAndLimitationsDTO> hobbiesAndLimitationsDTO { get; set; }
        public virtual ICollection<tblPatientTask> tblPatientTask { get; set; }
        public virtual tblUser tblUser { get; set; }
    }
}