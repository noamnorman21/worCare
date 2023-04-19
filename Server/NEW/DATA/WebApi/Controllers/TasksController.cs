﻿using System;
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
            try
            {
                //Update the task and save the changes
                tblPrivateTask tblPrivate = db.tblPrivateTask.Where(x => x.taskName == taskDTO.taskName).First();
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
        [HttpPost]
        [Route("GetAllTasks")] //GET ALL TASKS BY PATIENT ID
        public IHttpActionResult GetAllTasks([FromBody] PatientDTO patient)
        {
            List<PatientTaskDTO> tasks = new List<PatientTaskDTO>();
            try
            {
                var task = from t in db.tblPatientTask
                           where t.patientId == patient.patientId
                           select t;
                foreach (var item in task)
                {
                    PatientTaskDTO taskDTO = new PatientTaskDTO();
                    taskDTO.taskId = item.taskId;
                    taskDTO.taskName = item.taskName;
                    taskDTO.taskFromDate = item.taskFromDate;
                    taskDTO.taskToDate = item.taskToDate;
                    taskDTO.taskComment = item.taskComment;
                    taskDTO.patientId = item.patientId;
                    taskDTO.workerId = item.workerId;
                    taskDTO.userId = item.userId;
                    taskDTO.listId = item.listId;
                    tasks.Add(taskDTO);
                }
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("InsertActualList")]
        public IHttpActionResult InsertActualList([FromBody] dynamic list)
        {
            //dynamic becouse the list can be drug or product list
            Nullable<bool> isDrug = null;// default  will be regular patient task

            string taskName;
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
                    TimeSpan[] timesInDayArray = new TimeSpan[1];
                    foreach (var item in list.timesInDayArr)
                    {
                        TimeSpan time;
                        if (!item is TimeSpan)
                            time = TimeSpan.Parse(item);
                        else
                            time = item;

                        if (timesInDayArray[0] == null)//for the first item
                            timesInDayArray[0] = time;
                        else
                        {
                            TimeSpan[] tempArr = new TimeSpan[timesInDayArray.Length];
                            Array.Copy(timesInDayArray, tempArr, timesInDayArray.Length);
                            tempArr[tempArr.Length - 1] = time;
                            timesInDayArray = tempArr;
                        }

                    }
                    DrugForPatientDTO drugFor = new DrugForPatientDTO();
                    drugFor.fromDate = list.fromDate;
                    drugFor.toDate = list.toDate;
                    drugFor.patientId = list.patientId;
                    drugFor.dosage = list.dosage;
                    drugFor.drugId = list.drugId;
                    drugFor.qtyInBox = list.qtyInBox;
                    drugFor.minQuantity = list.minQuantity;
                    drugFor.patientId = list.patientId;
                    drugFor.listId = actualListId;
                    drugFor.timesInDayArray = timesInDayArray;//will not send to the db
                    int resInsertDrugForPatient = db.InsertDrugForPatient(actualListId, drugFor.fromDate, drugFor.toDate, drugFor.dosage, drugFor.qtyInBox, drugFor.minQuantity, drugFor.drugId, drugFor.patientId);
                    if (resInsertDrugForPatient != 1)
                        return BadRequest("error in insert drug for patient");
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
                    if (resInsertPatientTask!=1)
                    {
                        return BadRequest("error in insert Patient Task");

                    }

                }
                else
                {
                    //here will be the code for add product list
                }
                //next step will be to create a PatientTask and than actualTask










                ///למחוק את השורה למטה!!, זה רק כדי שזה לא יכעס
                return Ok("just for now!!!!");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }


    }
}