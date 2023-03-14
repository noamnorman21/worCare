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
    using System.Data.Entity.Core.Objects;
    using System.Linq;
    
    public partial class igroup194DB : DbContext
    {
        public igroup194DB()
            : base("name=igroup194DB")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<tblActualList> tblActualLists { get; set; }
        public virtual DbSet<tblCalendarForUser> tblCalendarForUsers { get; set; }
        public virtual DbSet<tblCalendarsType> tblCalendarsTypes { get; set; }
        public virtual DbSet<tblCaresForPatient> tblCaresForPatients { get; set; }
        public virtual DbSet<tblContact> tblContacts { get; set; }
        public virtual DbSet<tblCountry> tblCountries { get; set; }
        public virtual DbSet<tblDrug> tblDrugs { get; set; }
        public virtual DbSet<tblDrugForPatient> tblDrugForPatients { get; set; }
        public virtual DbSet<tblForeignUser> tblForeignUsers { get; set; }
        public virtual DbSet<tblHobbies> tblHobbies1 { get; set; }
        public virtual DbSet<tblLanguage> tblLanguages { get; set; }
        public virtual DbSet<tblLimitations> tblLimitations1 { get; set; }
        public virtual DbSet<tblList> tblLists { get; set; }
        public virtual DbSet<tblPatient> tblPatients { get; set; }
        public virtual DbSet<tblPatientTask> tblPatientTasks { get; set; }
        public virtual DbSet<tblPaycheck> tblPaychecks { get; set; }
        public virtual DbSet<tblPaymentRequest> tblPaymentRequests { get; set; }
        public virtual DbSet<tblPrivateTask> tblPrivateTasks { get; set; }
        public virtual DbSet<tblProduct> tblProducts { get; set; }
        public virtual DbSet<tblProductList> tblProductLists { get; set; }
        public virtual DbSet<tblUser> tblUsers { get; set; }
    
        public virtual int InsertForeignUser(Nullable<int> id, Nullable<System.DateTime> dateOfBirth, Nullable<System.DateTime> visaExpirationDate, string languageName_En, string countryName_En)
        {
            var idParameter = id.HasValue ?
                new ObjectParameter("Id", id) :
                new ObjectParameter("Id", typeof(int));
    
            var dateOfBirthParameter = dateOfBirth.HasValue ?
                new ObjectParameter("DateOfBirth", dateOfBirth) :
                new ObjectParameter("DateOfBirth", typeof(System.DateTime));
    
            var visaExpirationDateParameter = visaExpirationDate.HasValue ?
                new ObjectParameter("VisaExpirationDate", visaExpirationDate) :
                new ObjectParameter("VisaExpirationDate", typeof(System.DateTime));
    
            var languageName_EnParameter = languageName_En != null ?
                new ObjectParameter("LanguageName_En", languageName_En) :
                new ObjectParameter("LanguageName_En", typeof(string));
    
            var countryName_EnParameter = countryName_En != null ?
                new ObjectParameter("CountryName_En", countryName_En) :
                new ObjectParameter("CountryName_En", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("InsertForeignUser", idParameter, dateOfBirthParameter, visaExpirationDateParameter, languageName_EnParameter, countryName_EnParameter);
        }
    
        public virtual int InsertUser(string email, string password, string firstName, string lastName, string gender, string phoneNum, string userUri)
        {
            var emailParameter = email != null ?
                new ObjectParameter("Email", email) :
                new ObjectParameter("Email", typeof(string));
    
            var passwordParameter = password != null ?
                new ObjectParameter("Password", password) :
                new ObjectParameter("Password", typeof(string));
    
            var firstNameParameter = firstName != null ?
                new ObjectParameter("FirstName", firstName) :
                new ObjectParameter("FirstName", typeof(string));
    
            var lastNameParameter = lastName != null ?
                new ObjectParameter("LastName", lastName) :
                new ObjectParameter("LastName", typeof(string));
    
            var genderParameter = gender != null ?
                new ObjectParameter("Gender", gender) :
                new ObjectParameter("Gender", typeof(string));
    
            var phoneNumParameter = phoneNum != null ?
                new ObjectParameter("PhoneNum", phoneNum) :
                new ObjectParameter("PhoneNum", typeof(string));
    
            var userUriParameter = userUri != null ?
                new ObjectParameter("UserUri", userUri) :
                new ObjectParameter("UserUri", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("InsertUser", emailParameter, passwordParameter, firstNameParameter, lastNameParameter, genderParameter, phoneNumParameter, userUriParameter);
        }
    
        public virtual int sp_alterdiagram(string diagramname, Nullable<int> owner_id, Nullable<int> version, byte[] definition)
        {
            var diagramnameParameter = diagramname != null ?
                new ObjectParameter("diagramname", diagramname) :
                new ObjectParameter("diagramname", typeof(string));
    
            var owner_idParameter = owner_id.HasValue ?
                new ObjectParameter("owner_id", owner_id) :
                new ObjectParameter("owner_id", typeof(int));
    
            var versionParameter = version.HasValue ?
                new ObjectParameter("version", version) :
                new ObjectParameter("version", typeof(int));
    
            var definitionParameter = definition != null ?
                new ObjectParameter("definition", definition) :
                new ObjectParameter("definition", typeof(byte[]));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("sp_alterdiagram", diagramnameParameter, owner_idParameter, versionParameter, definitionParameter);
        }
    
        public virtual int sp_creatediagram(string diagramname, Nullable<int> owner_id, Nullable<int> version, byte[] definition)
        {
            var diagramnameParameter = diagramname != null ?
                new ObjectParameter("diagramname", diagramname) :
                new ObjectParameter("diagramname", typeof(string));
    
            var owner_idParameter = owner_id.HasValue ?
                new ObjectParameter("owner_id", owner_id) :
                new ObjectParameter("owner_id", typeof(int));
    
            var versionParameter = version.HasValue ?
                new ObjectParameter("version", version) :
                new ObjectParameter("version", typeof(int));
    
            var definitionParameter = definition != null ?
                new ObjectParameter("definition", definition) :
                new ObjectParameter("definition", typeof(byte[]));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("sp_creatediagram", diagramnameParameter, owner_idParameter, versionParameter, definitionParameter);
        }
    
        public virtual int sp_dropdiagram(string diagramname, Nullable<int> owner_id)
        {
            var diagramnameParameter = diagramname != null ?
                new ObjectParameter("diagramname", diagramname) :
                new ObjectParameter("diagramname", typeof(string));
    
            var owner_idParameter = owner_id.HasValue ?
                new ObjectParameter("owner_id", owner_id) :
                new ObjectParameter("owner_id", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("sp_dropdiagram", diagramnameParameter, owner_idParameter);
        }
    
        public virtual ObjectResult<sp_helpdiagramdefinition_Result> sp_helpdiagramdefinition(string diagramname, Nullable<int> owner_id)
        {
            var diagramnameParameter = diagramname != null ?
                new ObjectParameter("diagramname", diagramname) :
                new ObjectParameter("diagramname", typeof(string));
    
            var owner_idParameter = owner_id.HasValue ?
                new ObjectParameter("owner_id", owner_id) :
                new ObjectParameter("owner_id", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_helpdiagramdefinition_Result>("sp_helpdiagramdefinition", diagramnameParameter, owner_idParameter);
        }
    
        public virtual ObjectResult<sp_helpdiagrams_Result> sp_helpdiagrams(string diagramname, Nullable<int> owner_id)
        {
            var diagramnameParameter = diagramname != null ?
                new ObjectParameter("diagramname", diagramname) :
                new ObjectParameter("diagramname", typeof(string));
    
            var owner_idParameter = owner_id.HasValue ?
                new ObjectParameter("owner_id", owner_id) :
                new ObjectParameter("owner_id", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_helpdiagrams_Result>("sp_helpdiagrams", diagramnameParameter, owner_idParameter);
        }
    
        public virtual int sp_renamediagram(string diagramname, Nullable<int> owner_id, string new_diagramname)
        {
            var diagramnameParameter = diagramname != null ?
                new ObjectParameter("diagramname", diagramname) :
                new ObjectParameter("diagramname", typeof(string));
    
            var owner_idParameter = owner_id.HasValue ?
                new ObjectParameter("owner_id", owner_id) :
                new ObjectParameter("owner_id", typeof(int));
    
            var new_diagramnameParameter = new_diagramname != null ?
                new ObjectParameter("new_diagramname", new_diagramname) :
                new ObjectParameter("new_diagramname", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("sp_renamediagram", diagramnameParameter, owner_idParameter, new_diagramnameParameter);
        }
    
        public virtual int sp_upgraddiagrams()
        {
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("sp_upgraddiagrams");
        }
    
        public virtual int InsertCalendarForUser(Nullable<int> calendarNum, Nullable<int> id, Nullable<bool> isPrimary)
        {
            var calendarNumParameter = calendarNum.HasValue ?
                new ObjectParameter("calendarNum", calendarNum) :
                new ObjectParameter("calendarNum", typeof(int));
    
            var idParameter = id.HasValue ?
                new ObjectParameter("id", id) :
                new ObjectParameter("id", typeof(int));
    
            var isPrimaryParameter = isPrimary.HasValue ?
                new ObjectParameter("isPrimary", isPrimary) :
                new ObjectParameter("isPrimary", typeof(bool));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("InsertCalendarForUser", calendarNumParameter, idParameter, isPrimaryParameter);
        }
    
        public virtual int NewContact(string contactName, string phoneNo, string mobileNo, string email, string role, string contactComment, string patientId)
        {
            var contactNameParameter = contactName != null ?
                new ObjectParameter("contactName", contactName) :
                new ObjectParameter("contactName", typeof(string));
    
            var phoneNoParameter = phoneNo != null ?
                new ObjectParameter("phoneNo", phoneNo) :
                new ObjectParameter("phoneNo", typeof(string));
    
            var mobileNoParameter = mobileNo != null ?
                new ObjectParameter("mobileNo", mobileNo) :
                new ObjectParameter("mobileNo", typeof(string));
    
            var emailParameter = email != null ?
                new ObjectParameter("email", email) :
                new ObjectParameter("email", typeof(string));
    
            var roleParameter = role != null ?
                new ObjectParameter("role", role) :
                new ObjectParameter("role", typeof(string));
    
            var contactCommentParameter = contactComment != null ?
                new ObjectParameter("contactComment", contactComment) :
                new ObjectParameter("contactComment", typeof(string));
    
            var patientIdParameter = patientId != null ?
                new ObjectParameter("patientId", patientId) :
                new ObjectParameter("patientId", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("NewContact", contactNameParameter, phoneNoParameter, mobileNoParameter, emailParameter, roleParameter, contactCommentParameter, patientIdParameter);
        }
    
        public virtual int InsertPatient(string id, string firstName, string lastName, Nullable<System.DateTime> dateOfBirth, Nullable<int> userId, string languageName_En)
        {
            var idParameter = id != null ?
                new ObjectParameter("Id", id) :
                new ObjectParameter("Id", typeof(string));
    
            var firstNameParameter = firstName != null ?
                new ObjectParameter("FirstName", firstName) :
                new ObjectParameter("FirstName", typeof(string));
    
            var lastNameParameter = lastName != null ?
                new ObjectParameter("LastName", lastName) :
                new ObjectParameter("LastName", typeof(string));
    
            var dateOfBirthParameter = dateOfBirth.HasValue ?
                new ObjectParameter("DateOfBirth", dateOfBirth) :
                new ObjectParameter("DateOfBirth", typeof(System.DateTime));
    
            var userIdParameter = userId.HasValue ?
                new ObjectParameter("userId", userId) :
                new ObjectParameter("userId", typeof(int));
    
            var languageName_EnParameter = languageName_En != null ?
                new ObjectParameter("LanguageName_En", languageName_En) :
                new ObjectParameter("LanguageName_En", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("InsertPatient", idParameter, firstNameParameter, lastNameParameter, dateOfBirthParameter, userIdParameter, languageName_EnParameter);
        }
    
        public virtual int InsertPatientHobbies(string patientId, string books, string music, string tVShow, string radioChannel, string food, string drink, string movie, string specialHabits, string afternoonNap, string nightSleep, string other)
        {
            var patientIdParameter = patientId != null ?
                new ObjectParameter("patientId", patientId) :
                new ObjectParameter("patientId", typeof(string));
    
            var booksParameter = books != null ?
                new ObjectParameter("books", books) :
                new ObjectParameter("books", typeof(string));
    
            var musicParameter = music != null ?
                new ObjectParameter("music", music) :
                new ObjectParameter("music", typeof(string));
    
            var tVShowParameter = tVShow != null ?
                new ObjectParameter("TVShow", tVShow) :
                new ObjectParameter("TVShow", typeof(string));
    
            var radioChannelParameter = radioChannel != null ?
                new ObjectParameter("radioChannel", radioChannel) :
                new ObjectParameter("radioChannel", typeof(string));
    
            var foodParameter = food != null ?
                new ObjectParameter("food", food) :
                new ObjectParameter("food", typeof(string));
    
            var drinkParameter = drink != null ?
                new ObjectParameter("drink", drink) :
                new ObjectParameter("drink", typeof(string));
    
            var movieParameter = movie != null ?
                new ObjectParameter("movie", movie) :
                new ObjectParameter("movie", typeof(string));
    
            var specialHabitsParameter = specialHabits != null ?
                new ObjectParameter("specialHabits", specialHabits) :
                new ObjectParameter("specialHabits", typeof(string));
    
            var afternoonNapParameter = afternoonNap != null ?
                new ObjectParameter("afternoonNap", afternoonNap) :
                new ObjectParameter("afternoonNap", typeof(string));
    
            var nightSleepParameter = nightSleep != null ?
                new ObjectParameter("nightSleep", nightSleep) :
                new ObjectParameter("nightSleep", typeof(string));
    
            var otherParameter = other != null ?
                new ObjectParameter("other", other) :
                new ObjectParameter("other", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("InsertPatientHobbies", patientIdParameter, booksParameter, musicParameter, tVShowParameter, radioChannelParameter, foodParameter, drinkParameter, movieParameter, specialHabitsParameter, afternoonNapParameter, nightSleepParameter, otherParameter);
        }
    
        public virtual int InsertPatientLimitations(string patientId, string allergies, string sensitivities, string physicalAbilities, string bathRoutine, string sensitivityToNoise, string other)
        {
            var patientIdParameter = patientId != null ?
                new ObjectParameter("patientId", patientId) :
                new ObjectParameter("patientId", typeof(string));
    
            var allergiesParameter = allergies != null ?
                new ObjectParameter("allergies", allergies) :
                new ObjectParameter("allergies", typeof(string));
    
            var sensitivitiesParameter = sensitivities != null ?
                new ObjectParameter("sensitivities", sensitivities) :
                new ObjectParameter("sensitivities", typeof(string));
    
            var physicalAbilitiesParameter = physicalAbilities != null ?
                new ObjectParameter("physicalAbilities", physicalAbilities) :
                new ObjectParameter("physicalAbilities", typeof(string));
    
            var bathRoutineParameter = bathRoutine != null ?
                new ObjectParameter("bathRoutine", bathRoutine) :
                new ObjectParameter("bathRoutine", typeof(string));
    
            var sensitivityToNoiseParameter = sensitivityToNoise != null ?
                new ObjectParameter("sensitivityToNoise", sensitivityToNoise) :
                new ObjectParameter("sensitivityToNoise", typeof(string));
    
            var otherParameter = other != null ?
                new ObjectParameter("other", other) :
                new ObjectParameter("other", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("InsertPatientLimitations", patientIdParameter, allergiesParameter, sensitivitiesParameter, physicalAbilitiesParameter, bathRoutineParameter, sensitivityToNoiseParameter, otherParameter);
        }
    
        public virtual int NewPaycheck(Nullable<int> payCheckNum, Nullable<System.DateTime> paycheckDate, string paycheckSummary, string paycheckComment, Nullable<int> userId)
        {
            var payCheckNumParameter = payCheckNum.HasValue ?
                new ObjectParameter("payCheckNum", payCheckNum) :
                new ObjectParameter("payCheckNum", typeof(int));
    
            var paycheckDateParameter = paycheckDate.HasValue ?
                new ObjectParameter("paycheckDate", paycheckDate) :
                new ObjectParameter("paycheckDate", typeof(System.DateTime));
    
            var paycheckSummaryParameter = paycheckSummary != null ?
                new ObjectParameter("paycheckSummary", paycheckSummary) :
                new ObjectParameter("paycheckSummary", typeof(string));
    
            var paycheckCommentParameter = paycheckComment != null ?
                new ObjectParameter("paycheckComment", paycheckComment) :
                new ObjectParameter("paycheckComment", typeof(string));
    
            var userIdParameter = userId.HasValue ?
                new ObjectParameter("UserId", userId) :
                new ObjectParameter("UserId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("NewPaycheck", payCheckNumParameter, paycheckDateParameter, paycheckSummaryParameter, paycheckCommentParameter, userIdParameter);
        }
    
        public virtual int NewPaymentRequest(Nullable<int> requestId, string requestSubject, Nullable<double> amountToPay, Nullable<System.DateTime> requestDate, string requestProofDocument, string requestComment, string requestStatus, Nullable<int> userId)
        {
            var requestIdParameter = requestId.HasValue ?
                new ObjectParameter("requestId", requestId) :
                new ObjectParameter("requestId", typeof(int));
    
            var requestSubjectParameter = requestSubject != null ?
                new ObjectParameter("requestSubject", requestSubject) :
                new ObjectParameter("requestSubject", typeof(string));
    
            var amountToPayParameter = amountToPay.HasValue ?
                new ObjectParameter("amountToPay", amountToPay) :
                new ObjectParameter("amountToPay", typeof(double));
    
            var requestDateParameter = requestDate.HasValue ?
                new ObjectParameter("requestDate", requestDate) :
                new ObjectParameter("requestDate", typeof(System.DateTime));
    
            var requestProofDocumentParameter = requestProofDocument != null ?
                new ObjectParameter("requestProofDocument", requestProofDocument) :
                new ObjectParameter("requestProofDocument", typeof(string));
    
            var requestCommentParameter = requestComment != null ?
                new ObjectParameter("requestComment", requestComment) :
                new ObjectParameter("requestComment", typeof(string));
    
            var requestStatusParameter = requestStatus != null ?
                new ObjectParameter("requestStatus", requestStatus) :
                new ObjectParameter("requestStatus", typeof(string));
    
            var userIdParameter = userId.HasValue ?
                new ObjectParameter("userId", userId) :
                new ObjectParameter("userId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("NewPaymentRequest", requestIdParameter, requestSubjectParameter, amountToPayParameter, requestDateParameter, requestProofDocumentParameter, requestCommentParameter, requestStatusParameter, userIdParameter);
        }
    }
}
