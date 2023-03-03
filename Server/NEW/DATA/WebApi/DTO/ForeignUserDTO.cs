using DATA;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.DTO
{
    public class ForeignUserDTO
    {
        public int Id { get; set; }
        public System.DateTime DateOfBirth { get; set; }
        public Nullable<System.DateTime> VisaExpirationDate { get; set; }
        public string LanguageName_En { get; set; }
        public string CountryName_En { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tblCaresForPatient> tblCaresForPatients { get; set; }
        public virtual tblCountry tblCountry { get; set; }
        public virtual tblLanguage tblLanguage { get; set; }
        public virtual tblUser tblUser { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tblPatientTask> tblPatientTasks { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tblPaymentRequest> tblPaymentRequests { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tblPrivateTask> tblPrivateTasks { get; set; }
    }
}