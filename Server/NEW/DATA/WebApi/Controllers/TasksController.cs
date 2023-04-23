using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DATA;
using WebApi.DTO;
using System.Web.Http.Cors;
using Microsoft.Ajax.Utilities;

namespace WebApi.Controllers
{
    [RoutePrefix("api/Task")]
    public class TasksController : ApiController
    {
        igroup194Db db = new igroup194Db();
        //Private Task section    
        [HttpPost]
        [Route("InsertPrivateTask")] //Insert new private task by foreign user
        public IHttpActionResult InsertPrivateTask([FromBody] PrivateTaskDTO taskDTO)
        {
            try
            {
                db.InsertPrivateTask(taskDTO.taskName, taskDTO.taskFromDate, taskDTO.taskToDate, taskDTO.taskComment, taskDTO.status, taskDTO.workerId, taskDTO.TimeInDay, taskDTO.frequency);
                db.SaveChanges();
                return Ok(taskDTO);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("GetAllPrivateTasks")] //Insert new private task by foreign user
        public IHttpActionResult GetAllPrivateTasks([FromBody] ForeignUserDTO userDTO)
        {
            List<PrivateTaskDTO> privateTasks = new List<PrivateTaskDTO>();
            try
            {
                var tasks = from t in db.tblPrivateTask
                            where t.workerId == userDTO.Id
                            select t;
                foreach (var item in tasks)
                {
                    PrivateTaskDTO taskDTO = new PrivateTaskDTO();
                    taskDTO.taskName = item.taskName;
                    taskDTO.taskFromDate = item.taskFromDate;
                    taskDTO.taskToDate = item.taskToDate;
                    taskDTO.taskComment = item.taskComment;
                    taskDTO.status = item.status;
                    taskDTO.workerId = item.workerId;
                    taskDTO.TimeInDay = item.TimeInDay;
                    taskDTO.frequency = item.frequency;
                    privateTasks.Add(taskDTO);
                }
                return Ok(privateTasks);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("UpdatePrivateTasks")] //Update private task by foreign user
        public IHttpActionResult UpdatePrivateTasks([FromBody] PrivateTaskDTO taskDTO)
        {
            try //Update the task and save the changes
            {
                tblPrivateTask tblPrivate = db.tblPrivateTask.Where(x => x.taskName == taskDTO.taskName).FirstOrDefault();
                tblPrivate.taskName = taskDTO.taskName;
                tblPrivate.taskFromDate = taskDTO.taskFromDate;
                tblPrivate.taskToDate = taskDTO.taskToDate;
                tblPrivate.taskComment = taskDTO.taskComment;
                tblPrivate.status = taskDTO.status;
                tblPrivate.workerId = taskDTO.workerId;
                tblPrivate.TimeInDay = taskDTO.TimeInDay;
                tblPrivate.frequency = taskDTO.frequency;
                db.SaveChanges();
                return Ok(taskDTO);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //Public Task section     
        //[HttpPost]
        //[Route("GetAllTasks")] // POST - Because FromBody - ALL TASKS BY PATIENT ID
        //public IHttpActionResult GetAllTasks([FromBody] PatientDTO patient)
        //{
        //    List<PatientTaskDTO> tasks = new List<PatientTaskDTO>();
        //    try
        //    {
        //        var task = from t in db.tblPatientTask
        //                   where t.patientId == patient.patientId
        //                   select t;
        //        foreach (var item in task)
        //        {
        //            PatientTaskDTO taskDTO = new PatientTaskDTO();
        //            taskDTO.taskId = item.taskId;
        //            taskDTO.taskName = item.taskName;
        //            taskDTO.taskFromDate = item.taskFromDate;
        //            taskDTO.taskToDate = item.taskToDate;
        //            taskDTO.taskComment = item.taskComment;
        //            taskDTO.patientId = item.patientId;
        //            taskDTO.workerId = item.workerId;
        //            taskDTO.userId = item.userId;
        //            taskDTO.listId = item.listId;
        //            tasks.Add(taskDTO);
        //        }
        //        return Ok(tasks);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}

        [HttpPost]
        [Route("InsertActualList")] //dynamic because the list can be drug or product list
        public IHttpActionResult InsertActualList([FromBody] dynamic list)
        {
            Nullable<bool> isDrug = null;// default  will be regular patient task
            string taskName;
            tblActualTask actualTask = new tblActualTask();
            try
            {
                if (list.drugId != null)
                {
                    //isdrug mean that is drug list and not product list
                    isDrug = true;
                    taskName = list.drugName; //the name of the drug
                }
                else if (list.listName != null)
                {
                    // product list
                    isDrug = false;
                    taskName = list.listName; //the name of the product list
                }
                else
                {
                    //regular patient task
                    isDrug = null;
                    taskName = list.taskName; //the name of the task that the user insert
                }
                db.InsertActualList(isDrug);
                db.SaveChanges();
                int actualListId = db.tblActualList.Max(x => x.listId);// find the new id that was created in the db
                if (isDrug == true)
                {
                    try
                    {
                        TimeSpan[] timesInDayArray = new TimeSpan[0];
                        foreach (var item in list.timesInDayArr)
                        {
                            //"15:16" this is how item will look when it will came from the client
                            int hour = int.Parse(item.ToString().Substring(0, 2));
                            int minutes = int.Parse(item.ToString().Substring(3, 2));
                            TimeSpan time = new TimeSpan(hour, minutes, 0);
                            TimeSpan[] tempArr = new TimeSpan[timesInDayArray.Length + 1];
                            Array.Copy(timesInDayArray, tempArr, timesInDayArray.Length);
                            tempArr[tempArr.Length - 1] = time;
                            timesInDayArray = tempArr;
                        }
                        Array.Sort(timesInDayArray);
                        DrugForPatientDTO drugFor = new DrugForPatientDTO();
                        drugFor.fromDate = DateTime.Now;
                        drugFor.toDate = list.toDate;
                        drugFor.patientId = list.patientId;
                        drugFor.dosage = list.dosage;
                        drugFor.drugId = list.drugId;
                        drugFor.qtyInBox = list.qtyInBox;
                        drugFor.minQuantity = list.qtyInBox*0.2;//defult will be 20% 
                        drugFor.patientId = list.patientId;
                        drugFor.listId = actualListId;
                        drugFor.timesInDayArray = timesInDayArray; //will not send to the db just a temp field
                        int resInsertDrugForPatient = db.InsertDrugForPatient(actualListId, drugFor.fromDate, drugFor.toDate, drugFor.dosage, drugFor.qtyInBox, drugFor.minQuantity, drugFor.drugId, drugFor.patientId);
                        db.SaveChanges();
                        PatientTaskDTO task = new PatientTaskDTO();
                        task.taskName = taskName;
                        task.taskFromDate = drugFor.fromDate;
                        task.taskToDate = list.toDate;
                        task.taskComment = list.taskComment;
                        task.patientId = list.patientId;
                        task.workerId = list.workerId;
                        task.frequency = list.frequency;
                        task.userId = list.userId;
                        task.listId = actualListId;
                        task.timesInDayArr = timesInDayArray;
                        int resInsertPatientTask = db.InsertPatientTask(task.taskName, task.taskFromDate, task.taskToDate, task.taskComment, task.patientId, task.workerId, task.userId, actualListId, task.frequency);
                        db.SaveChanges();       
                        int taskId = db.tblPatientTask.Max(x => x.taskId);
                        DateTime tempDate = task.taskFromDate;
                        //we use here partial class to add the actual tasks to the db                                  
                        if (!actualTask.InsertActualTask(task.frequency, task.timesInDayArr, taskId, task.taskFromDate, task.taskToDate))
                            throw new Exception("error Insert Actual Tasks ");
                        return Ok("Actual Tasks added");
                    }
                    catch (Exception ex)
                    {
                        return BadRequest(ex.Message);
                    }
                }
                else if (isDrug == false) // Product List
                {


                    
                    return Ok("sss");//רק לעכשיו, להעיף אחרי זה את הקוד
                }
                else // Regular Tasks  List
                {
                    try
                    {
                        TimeSpan[] timesInDayArray = new TimeSpan[0];
                        foreach (var item in list.timesInDayArr)
                        {
                            //"15:16" this is how item will look when it will came from the client
                            int hour = int.Parse(item.ToString().Substring(0, 2));
                            int minutes = int.Parse(item.ToString().Substring(3, 2));
                            TimeSpan time = new TimeSpan(hour, minutes, 0);
                            TimeSpan[] tempArr = new TimeSpan[timesInDayArray.Length + 1];
                            Array.Copy(timesInDayArray, tempArr, timesInDayArray.Length);
                            tempArr[tempArr.Length - 1] = time;
                            timesInDayArray = tempArr;
                        }
                        Array.Sort(timesInDayArray);
                        PatientTaskDTO task = new PatientTaskDTO();
                        task.taskName = taskName;
                        task.taskFromDate = list.fromDate;
                        task.taskToDate = list.toDate;
                        task.taskComment = list.taskComment;
                        task.patientId = list.patientId;
                        task.workerId = list.workerId;
                        task.frequency = list.frequency;
                        task.userId = list.userId;
                        task.listId = actualListId;
                        task.timesInDayArr = timesInDayArray;
                        int resInsertPatientTask = db.InsertPatientTask(task.taskName, task.taskFromDate, task.taskToDate, task.taskComment, task.patientId, task.workerId, task.userId, actualListId, task.frequency);
                        db.SaveChanges();
                        int taskId = db.tblPatientTask.Max(x => x.taskId);
                        DateTime tempDate = task.taskFromDate;
                        //we use here partial class to add the actual tasks to the db
                        if (!actualTask.InsertActualTask(task.frequency, task.timesInDayArr, taskId, task.taskFromDate, task.taskToDate))
                            throw new Exception("error Insert Actual Tasks ");
                        return Ok("Actual Tasks added");
                    }
                    catch (Exception ex)
                    {
                        return BadRequest(ex.Message);
                    }

                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}