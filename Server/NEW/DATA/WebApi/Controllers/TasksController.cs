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
        public IHttpActionResult GetAllTasks([FromBody] PatientDTO patient )
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
            bool isdrug = false;// defaul product list

            if (list.drugId!=null)
            {
                //isdrug mean that is drug list and not product list
                isdrug = true;       
            }
            db.InsertActualList(isdrug);
            db.SaveChanges();
            int actualListId = db.tblActualList.Max(x => x.listId);// find the new id that was created in the db
            if (isdrug)
            {
                db.tblDrugForPatient.InsertDrugForPatient
            }

        }
        
        
    }
}