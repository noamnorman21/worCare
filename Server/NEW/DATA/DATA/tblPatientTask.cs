
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
    
public partial class tblPatientTask
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
