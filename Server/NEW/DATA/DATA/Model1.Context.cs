﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class igroup194_Model : DbContext
    {
        public igroup194_Model()
            : base("name=igroup194_Model")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<sysdiagrams> sysdiagrams { get; set; }
        public virtual DbSet<tblActualList> tblActualList { get; set; }
        public virtual DbSet<tblCalendarForUser> tblCalendarForUser { get; set; }
        public virtual DbSet<tblCalendarsType> tblCalendarsType { get; set; }
        public virtual DbSet<tblCaresForPatient> tblCaresForPatient { get; set; }
        public virtual DbSet<tblContacts> tblContacts { get; set; }
        public virtual DbSet<tblCountry> tblCountry { get; set; }
        public virtual DbSet<tblDrug> tblDrug { get; set; }
        public virtual DbSet<tblDrugForPatient> tblDrugForPatient { get; set; }
        public virtual DbSet<tblForeignUser> tblForeignUser { get; set; }
        public virtual DbSet<tblHobbies> tblHobbies { get; set; }
        public virtual DbSet<tblLanguage> tblLanguage { get; set; }
        public virtual DbSet<tblLimitations> tblLimitations { get; set; }
        public virtual DbSet<tblList> tblList { get; set; }
        public virtual DbSet<tblPatient> tblPatient { get; set; }
        public virtual DbSet<tblPatientTask> tblPatientTask { get; set; }
        public virtual DbSet<tblPaycheck> tblPaycheck { get; set; }
        public virtual DbSet<tblPaymentRequest> tblPaymentRequest { get; set; }
        public virtual DbSet<tblPrivateTask> tblPrivateTask { get; set; }
        public virtual DbSet<tblProduct> tblProduct { get; set; }
        public virtual DbSet<tblProductList> tblProductList { get; set; }
        public virtual DbSet<tblUser> tblUser { get; set; }
    }
}