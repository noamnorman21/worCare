//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace WebAPI
{
    using System;
    using System.Collections.Generic;
    
    public partial class tblPrivateTask
    {
        public int taskId { get; set; }
        public string taskName { get; set; }
        public System.DateTime taskFromDate { get; set; }
        public Nullable<System.DateTime> taskToDate { get; set; }
        public string taskComment { get; set; }
        public string status { get; set; }
        public int workerId { get; set; }
    
        public virtual tblForeignUser tblForeignUser { get; set; }
    }
}
