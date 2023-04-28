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
using System.Data.Entity.SqlServer;

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
        [HttpPost]
        [Route("GetAllTasks")] //Get all public tasks
        public IHttpActionResult GetAllTasks([FromBody] string patientId)
        {
            try
            {
                var tasksArr = from t in db.tblPatientTask
                               where t.patientId == patientId && t.taskToDate >= DateTime.Now
                               select t;
                List<ActualTaskDTO> actualTasks = new List<ActualTaskDTO>();
                foreach (var item in tasksArr)
                {
                    var task = from t in db.tblActualTask
                               where t.taskId == item.taskId && 
                               t.taskDate >= DateTime.Now &&
                               t.taskDate <= SqlFunctions.DateAdd("d", 7, DateTime.Now) &&
                               t.taskStatus == "P"
                               select t;
                    foreach (var item2 in task)
                    {
                        ActualTaskDTO actualTask = new ActualTaskDTO();
                        actualTask.taskId = item2.taskId;
                        actualTask.taskDate = item2.taskDate;
                        actualTask.TimeInDay = item2.TimeInDay;
                        actualTask.taskComment = item.taskComment;
                        actualTask.taskStatus = item2.taskStatus;
                        actualTask.workerId = item.workerId;
                        actualTask.patientId = item.patientId;
                        actualTask.taskName = item.taskName;
                        actualTask.frequency = item.frequency;
                        actualTask.listId = item.listId;
                        actualTask.actualId = item2.actualId;
                        actualTasks.Add(actualTask);
                    }
                }
                foreach (var item in actualTasks)
                {
                    // add type of task from tblActualList
                    var taskType = from t in db.tblActualList
                                   where t.listId == item.listId
                                   select t;
                    foreach (var item2 in taskType)
                    {
                        item.type = item2.type;
                    }
                    List<ProductListDTO> productListToSend = new List<ProductListDTO>();
                    if (item.type==false)// mean its prodact list, than we will create the product list and add it to the actual list
                    {
                        var prodArr = from t in db.tblProductList //find all relavent ProductList for this task
                                      where t.listId == item.listId
                                      select t;
                        if (prodArr.Count()>0) //that mean the we already have products in this list 
                        {       
                            foreach (var product in prodArr)
                            {
                                ProductListDTO productList = new ProductListDTO();
                                productList.listId = product.listId;
                                productList.productId = product.productId;
                                var prodName = from t in db.tblProduct //find the name of the Product from tblProduct
                                               where t.productId == product.productId
                                               select t.productName;
                                productList.productName = prodName.First();
                                productList.productStatus = product.productStatus;
                                productList.productQuantity = product.productQuantity;
                                productListToSend.Add(productList);
                            }
                            item.prodtList = productListToSend; //add to the actual task the product list
                        }
                    }          
                }                
                actualTasks.Sort((x, y) => DateTime.Compare(x.taskDate, y.taskDate));               
                return Ok(actualTasks);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("InsertActualList")] //dynamic because the list can be drug or product list
        public IHttpActionResult InsertActualList([FromBody] dynamic list)
        {
            // type = 1 - True -  drug list
            // type = 0 - False - product list
            // type = null - regular task
            
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
                        drugFor.minQuantity = list.qtyInBox * 0.2;//defult will be 20% 
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
                    TimeSpan[] timesInDayArray = new TimeSpan[1];
                    foreach (var item in list.timesInDayArr)
                    {
                        //"15:16" this is how item will look when it will came from the client
                        int hour = int.Parse(item.ToString().Substring(0, 2));
                        int minutes = int.Parse(item.ToString().Substring(3, 2));
                        TimeSpan time = new TimeSpan(hour, minutes, 0);
                        timesInDayArray[0] = time;
                    }
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
                    db.InsertList(task.taskName, task.listId);
                    db.SaveChanges();
                    int resInsertPatientTask = db.InsertPatientTask(task.taskName, task.taskFromDate, task.taskToDate, task.taskComment, task.patientId, task.workerId, task.userId, actualListId, task.frequency);
                    int taskId = db.tblPatientTask.Max(x => x.taskId);
                    db.SaveChanges();
                    //we use here partial class to add the actual tasks to the db                                  
                    if (!actualTask.InsertActualTask(task.frequency, task.timesInDayArr, taskId, task.taskFromDate, task.taskToDate))
                        throw new Exception("error Insert Actual Tasks ");
                    return Ok("Actual Tasks added");
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

        [HttpPost]
        [Route("InsertProductsToList")]
        public IHttpActionResult InsertProductsToList([FromBody] ProductListDTO prodList)
        {
            try
            {
                //find if the product is already in the db, else add it
                var isExsitProduct = from p in db.tblProduct
                                     where p.productName == prodList.productName
                                     select p;
                int productId;
                if (isExsitProduct.Count() == 0)
                {
                    db.InsertProduct(prodList.productName);
                    db.SaveChanges();
                    productId = db.tblProduct.Max(x => x.productId);                  
                }
                else
                    productId = isExsitProduct.First().productId;
                //add the product to the list
                db.InsertProductList(productId, prodList.listId, "P", prodList.productQuantity);
                return Ok("Product added to list");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }


        }
    }
}