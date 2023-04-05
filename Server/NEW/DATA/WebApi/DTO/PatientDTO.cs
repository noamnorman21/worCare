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
        public int userId { get; set; }
        public string LanguageName_En { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tblCaresForPatient> tblCaresForPatient { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tblContacts> tblContacts { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tblDrugForPatient> tblDrugForPatient { get; set; }
        public virtual tblHobbies tblHobbies { get; set; }
        public virtual tblLanguage tblLanguage { get; set; }
        public virtual tblLimitations tblLimitations { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tblPatientTask> tblPatientTask { get; set; }
        public virtual tblUser tblUser { get; set; }
    }
}