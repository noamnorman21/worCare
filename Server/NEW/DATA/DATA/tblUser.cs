
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

        this.tblCalendarForUsers = new HashSet<tblCalendarForUser>();

        this.tblPatientTasks = new HashSet<tblPatientTask>();

        this.tblPaychecks = new HashSet<tblPaycheck>();

    }


    public int Id { get; set; }

    public string Email { get; set; }

    public string Password { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }

    public string gender { get; set; }

    public string phoneNum { get; set; }

    public string userUri { get; set; }



    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]

    public virtual ICollection<tblCalendarForUser> tblCalendarForUsers { get; set; }

    public virtual tblForeignUser tblForeignUser { get; set; }

    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]

    public virtual ICollection<tblPatientTask> tblPatientTasks { get; set; }

    [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]

    public virtual ICollection<tblPaycheck> tblPaychecks { get; set; }

}

}
