//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace DATA
{
    using System;
    using System.Collections.Generic;
    
    public partial class tblUser
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public tblUser()
        {
            this.tblCalendarForUser = new HashSet<tblCalendarForUser>();
            this.tblPatient = new HashSet<tblPatient>();
            this.tblPatientTask = new HashSet<tblPatientTask>();
            this.tblPaycheck = new HashSet<tblPaycheck>();
        }
    
        public int userId { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string gender { get; set; }
        public string phoneNum { get; set; }
        public string userUri { get; set; }
        public string pushToken { get; set; }
        public Nullable<bool> financeNotifications { get; set; }
        public Nullable<bool> chatNotifications { get; set; }
        public Nullable<bool> medNotifications { get; set; }
        public Nullable<bool> tasksNotifications { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tblCalendarForUser> tblCalendarForUser { get; set; }
        public virtual tblForeignUser tblForeignUser { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tblPatient> tblPatient { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tblPatientTask> tblPatientTask { get; set; }
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<tblPaycheck> tblPaycheck { get; set; }
    }
}
