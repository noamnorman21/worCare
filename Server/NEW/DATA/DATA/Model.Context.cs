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
    
    public partial class igroup194Db : DbContext
    {
        public igroup194Db()
            : base("name=igroup194Db")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<sysdiagrams> sysdiagrams { get; set; }
        public virtual DbSet<tblActualList> tblActualList { get; set; }
        public virtual DbSet<tblActualTask> tblActualTask { get; set; }
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
    
        public virtual int InsertCalendarForUser(Nullable<int> calendarNum, Nullable<int> userId, Nullable<bool> isPrimary)
        {
            var calendarNumParameter = calendarNum.HasValue ?
                new ObjectParameter("calendarNum", calendarNum) :
                new ObjectParameter("calendarNum", typeof(int));
    
            var userIdParameter = userId.HasValue ?
                new ObjectParameter("userId", userId) :
                new ObjectParameter("userId", typeof(int));
    
            var isPrimaryParameter = isPrimary.HasValue ?
                new ObjectParameter("isPrimary", isPrimary) :
                new ObjectParameter("isPrimary", typeof(bool));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("InsertCalendarForUser", calendarNumParameter, userIdParameter, isPrimaryParameter);
        }
    
        public virtual int InsertCaresForPatient(string patientId, Nullable<int> workerId, string status, string linkTo)
        {
            var patientIdParameter = patientId != null ?
                new ObjectParameter("patientId", patientId) :
                new ObjectParameter("patientId", typeof(string));
    
            var workerIdParameter = workerId.HasValue ?
                new ObjectParameter("workerId", workerId) :
                new ObjectParameter("workerId", typeof(int));
    
            var statusParameter = status != null ?
                new ObjectParameter("status", status) :
                new ObjectParameter("status", typeof(string));
    
            var linkToParameter = linkTo != null ?
                new ObjectParameter("linkTo", linkTo) :
                new ObjectParameter("linkTo", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("InsertCaresForPatient", patientIdParameter, workerIdParameter, statusParameter, linkToParameter);
        }
    
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
    
        public virtual int InsertList(string listName, Nullable<int> listId)
        {
            var listNameParameter = listName != null ?
                new ObjectParameter("listName", listName) :
                new ObjectParameter("listName", typeof(string));
    
            var listIdParameter = listId.HasValue ?
                new ObjectParameter("listId", listId) :
                new ObjectParameter("listId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("InsertList", listNameParameter, listIdParameter);
        }
    
        public virtual int InsertPatient(string patientId, string firstName, string lastName, Nullable<System.DateTime> dateOfBirth, Nullable<int> userId, string languageName_En)
        {
            var patientIdParameter = patientId != null ?
                new ObjectParameter("patientId", patientId) :
                new ObjectParameter("patientId", typeof(string));
    
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
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("InsertPatient", patientIdParameter, firstNameParameter, lastNameParameter, dateOfBirthParameter, userIdParameter, languageName_EnParameter);
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
    
        public virtual int InsertPatientTask(string taskName, Nullable<System.DateTime> taskFromDate, Nullable<System.DateTime> taskToDate, string taskComment, string patientId, Nullable<int> workerId, Nullable<int> userId, Nullable<int> listId, string frequency)
        {
            var taskNameParameter = taskName != null ?
                new ObjectParameter("taskName", taskName) :
                new ObjectParameter("taskName", typeof(string));
    
            var taskFromDateParameter = taskFromDate.HasValue ?
                new ObjectParameter("taskFromDate", taskFromDate) :
                new ObjectParameter("taskFromDate", typeof(System.DateTime));
    
            var taskToDateParameter = taskToDate.HasValue ?
                new ObjectParameter("taskToDate", taskToDate) :
                new ObjectParameter("taskToDate", typeof(System.DateTime));
    
            var taskCommentParameter = taskComment != null ?
                new ObjectParameter("taskComment", taskComment) :
                new ObjectParameter("taskComment", typeof(string));
    
            var patientIdParameter = patientId != null ?
                new ObjectParameter("patientId", patientId) :
                new ObjectParameter("patientId", typeof(string));
    
            var workerIdParameter = workerId.HasValue ?
                new ObjectParameter("workerId", workerId) :
                new ObjectParameter("workerId", typeof(int));
    
            var userIdParameter = userId.HasValue ?
                new ObjectParameter("userId", userId) :
                new ObjectParameter("userId", typeof(int));
    
            var listIdParameter = listId.HasValue ?
                new ObjectParameter("listId", listId) :
                new ObjectParameter("listId", typeof(int));
    
            var frequencyParameter = frequency != null ?
                new ObjectParameter("frequency", frequency) :
                new ObjectParameter("frequency", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("InsertPatientTask", taskNameParameter, taskFromDateParameter, taskToDateParameter, taskCommentParameter, patientIdParameter, workerIdParameter, userIdParameter, listIdParameter, frequencyParameter);
        }
    
        public virtual int InsertPrivateTask(string taskName, Nullable<System.DateTime> taskFromDate, Nullable<System.DateTime> taskToDate, string taskComment, string status, Nullable<int> workerId, Nullable<System.TimeSpan> timeInDay, string frequency)
        {
            var taskNameParameter = taskName != null ?
                new ObjectParameter("taskName", taskName) :
                new ObjectParameter("taskName", typeof(string));
    
            var taskFromDateParameter = taskFromDate.HasValue ?
                new ObjectParameter("taskFromDate", taskFromDate) :
                new ObjectParameter("taskFromDate", typeof(System.DateTime));
    
            var taskToDateParameter = taskToDate.HasValue ?
                new ObjectParameter("taskToDate", taskToDate) :
                new ObjectParameter("taskToDate", typeof(System.DateTime));
    
            var taskCommentParameter = taskComment != null ?
                new ObjectParameter("taskComment", taskComment) :
                new ObjectParameter("taskComment", typeof(string));
    
            var statusParameter = status != null ?
                new ObjectParameter("status", status) :
                new ObjectParameter("status", typeof(string));
    
            var workerIdParameter = workerId.HasValue ?
                new ObjectParameter("workerId", workerId) :
                new ObjectParameter("workerId", typeof(int));
    
            var timeInDayParameter = timeInDay.HasValue ?
                new ObjectParameter("TimeInDay", timeInDay) :
                new ObjectParameter("TimeInDay", typeof(System.TimeSpan));
    
            var frequencyParameter = frequency != null ?
                new ObjectParameter("frequency", frequency) :
                new ObjectParameter("frequency", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("InsertPrivateTask", taskNameParameter, taskFromDateParameter, taskToDateParameter, taskCommentParameter, statusParameter, workerIdParameter, timeInDayParameter, frequencyParameter);
        }
    
        public virtual int InsertProduct(string productName)
        {
            var productNameParameter = productName != null ?
                new ObjectParameter("productName", productName) :
                new ObjectParameter("productName", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("InsertProduct", productNameParameter);
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
    
        public virtual int NewPaycheck(Nullable<System.DateTime> paycheckDate, string paycheckSummary, string paycheckComment, Nullable<int> userId, string payCheckProofDocument)
        {
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
    
            var payCheckProofDocumentParameter = payCheckProofDocument != null ?
                new ObjectParameter("payCheckProofDocument", payCheckProofDocument) :
                new ObjectParameter("payCheckProofDocument", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("NewPaycheck", paycheckDateParameter, paycheckSummaryParameter, paycheckCommentParameter, userIdParameter, payCheckProofDocumentParameter);
        }
    
        public virtual int NewPaymentRequest(string requestSubject, Nullable<double> amountToPay, Nullable<System.DateTime> requestDate, string requestProofDocument, string requestComment, string requestStatus, Nullable<int> userId)
        {
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
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("NewPaymentRequest", requestSubjectParameter, amountToPayParameter, requestDateParameter, requestProofDocumentParameter, requestCommentParameter, requestStatusParameter, userIdParameter);
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
    
        public virtual int updateStatusCaresForPatient(string patientId, Nullable<int> workerId, string status)
        {
            var patientIdParameter = patientId != null ?
                new ObjectParameter("patientId", patientId) :
                new ObjectParameter("patientId", typeof(string));
    
            var workerIdParameter = workerId.HasValue ?
                new ObjectParameter("workerId", workerId) :
                new ObjectParameter("workerId", typeof(int));
    
            var statusParameter = status != null ?
                new ObjectParameter("status", status) :
                new ObjectParameter("status", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("updateStatusCaresForPatient", patientIdParameter, workerIdParameter, statusParameter);
        }
    
        public virtual int InsertActualList(Nullable<bool> type)
        {
            var typeParameter = type.HasValue ?
                new ObjectParameter("type", type) :
                new ObjectParameter("type", typeof(bool));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("InsertActualList", typeParameter);
        }
    
        public virtual int InsertDrugForPatient(Nullable<int> listId, Nullable<System.DateTime> fromDate, Nullable<System.DateTime> toDate, Nullable<byte> dosage, Nullable<int> qtyInBox, Nullable<byte> minQuantity, Nullable<int> drugId, string patientId)
        {
            var listIdParameter = listId.HasValue ?
                new ObjectParameter("listId", listId) :
                new ObjectParameter("listId", typeof(int));
    
            var fromDateParameter = fromDate.HasValue ?
                new ObjectParameter("fromDate", fromDate) :
                new ObjectParameter("fromDate", typeof(System.DateTime));
    
            var toDateParameter = toDate.HasValue ?
                new ObjectParameter("toDate", toDate) :
                new ObjectParameter("toDate", typeof(System.DateTime));
    
            var dosageParameter = dosage.HasValue ?
                new ObjectParameter("dosage", dosage) :
                new ObjectParameter("dosage", typeof(byte));
    
            var qtyInBoxParameter = qtyInBox.HasValue ?
                new ObjectParameter("qtyInBox", qtyInBox) :
                new ObjectParameter("qtyInBox", typeof(int));
    
            var minQuantityParameter = minQuantity.HasValue ?
                new ObjectParameter("minQuantity", minQuantity) :
                new ObjectParameter("minQuantity", typeof(byte));
    
            var drugIdParameter = drugId.HasValue ?
                new ObjectParameter("drugId", drugId) :
                new ObjectParameter("drugId", typeof(int));
    
            var patientIdParameter = patientId != null ?
                new ObjectParameter("patientId", patientId) :
                new ObjectParameter("patientId", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("InsertDrugForPatient", listIdParameter, fromDateParameter, toDateParameter, dosageParameter, qtyInBoxParameter, minQuantityParameter, drugIdParameter, patientIdParameter);
        }
    
        public virtual int ActualTask(Nullable<int> taskId, Nullable<System.DateTime> taskDate, Nullable<System.TimeSpan> timeInDay, string taskStatus)
        {
            var taskIdParameter = taskId.HasValue ?
                new ObjectParameter("taskId", taskId) :
                new ObjectParameter("taskId", typeof(int));
    
            var taskDateParameter = taskDate.HasValue ?
                new ObjectParameter("taskDate", taskDate) :
                new ObjectParameter("taskDate", typeof(System.DateTime));
    
            var timeInDayParameter = timeInDay.HasValue ?
                new ObjectParameter("TimeInDay", timeInDay) :
                new ObjectParameter("TimeInDay", typeof(System.TimeSpan));
    
            var taskStatusParameter = taskStatus != null ?
                new ObjectParameter("taskStatus", taskStatus) :
                new ObjectParameter("taskStatus", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("ActualTask", taskIdParameter, taskDateParameter, timeInDayParameter, taskStatusParameter);
        }
    
        public virtual int InsertActualTask(Nullable<int> taskId, Nullable<System.DateTime> taskDate, Nullable<System.TimeSpan> timeInDay, string taskStatus)
        {
            var taskIdParameter = taskId.HasValue ?
                new ObjectParameter("taskId", taskId) :
                new ObjectParameter("taskId", typeof(int));
    
            var taskDateParameter = taskDate.HasValue ?
                new ObjectParameter("taskDate", taskDate) :
                new ObjectParameter("taskDate", typeof(System.DateTime));
    
            var timeInDayParameter = timeInDay.HasValue ?
                new ObjectParameter("TimeInDay", timeInDay) :
                new ObjectParameter("TimeInDay", typeof(System.TimeSpan));
    
            var taskStatusParameter = taskStatus != null ?
                new ObjectParameter("taskStatus", taskStatus) :
                new ObjectParameter("taskStatus", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("InsertActualTask", taskIdParameter, taskDateParameter, timeInDayParameter, taskStatusParameter);
        }
    
        public virtual int InsertProductList(Nullable<int> productId, Nullable<int> listId, string productStatus, Nullable<int> productQuantity)
        {
            var productIdParameter = productId.HasValue ?
                new ObjectParameter("productId", productId) :
                new ObjectParameter("productId", typeof(int));
    
            var listIdParameter = listId.HasValue ?
                new ObjectParameter("listId", listId) :
                new ObjectParameter("listId", typeof(int));
    
            var productStatusParameter = productStatus != null ?
                new ObjectParameter("productStatus", productStatus) :
                new ObjectParameter("productStatus", typeof(string));
    
            var productQuantityParameter = productQuantity.HasValue ?
                new ObjectParameter("productQuantity", productQuantity) :
                new ObjectParameter("productQuantity", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction("InsertProductList", productIdParameter, listIdParameter, productStatusParameter, productQuantityParameter);
        }
    }
}
