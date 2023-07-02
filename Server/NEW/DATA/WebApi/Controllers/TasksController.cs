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
using System.Data.Entity.SqlServer;
using Newtonsoft.Json;
using System.Text;
using System.Globalization;

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
                TimeSpan[] timesInDayArray = new TimeSpan[0];
                foreach (var item in taskDTO.timesInDayArr)
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


                db.InsertPrivateTask(taskDTO.taskName, taskDTO.taskFromDate, taskDTO.taskToDate, taskDTO.frequency, taskDTO.taskComment, taskDTO.workerId);
                //find the task id of the new task it will be the max
                int taskId = db.tblPrivateTask.Max(t => t.taskId);
                DateTime tempDate = taskDTO.taskFromDate;
                if (taskDTO.frequency == "Once")
                {
                    if (timesInDayArray.Length > 1)
                    {
                        for (int i = 0; i < timesInDayArray.Length; i++)
                        {
                            db.InsertPrivateActualTask(taskId, taskDTO.taskToDate, timesInDayArray[i], "P");
                        }
                    }
                    else
                        db.InsertPrivateActualTask(taskId, taskDTO.taskToDate, timesInDayArray[0], "P");
                }
                else if (taskDTO.frequency == "Daily")
                {
                    while (tempDate < taskDTO.taskToDate)
                    {
                        for (int i = 0; i < timesInDayArray.Length; i++)
                        {
                            db.InsertPrivateActualTask(taskId, tempDate, timesInDayArray[i], "P");
                        }
                        tempDate = tempDate.AddDays(1);
                    }
                }
                else if (taskDTO.frequency == "Weekly")
                {
                    while (tempDate < taskDTO.taskToDate)
                    {
                        for (int i = 0; i < timesInDayArray.Length; i++)
                        {
                            db.InsertPrivateActualTask(taskId, tempDate, timesInDayArray[i], "P");
                        }
                        tempDate = tempDate.AddDays(7);
                    }
                }
                else if (taskDTO.frequency == "Monthly")
                {
                    while (tempDate < taskDTO.taskToDate)
                    {
                        for (int i = 0; i < timesInDayArray.Length; i++)
                        {
                            db.InsertPrivateActualTask(taskId, tempDate, timesInDayArray[i], "P");
                        }
                        tempDate = tempDate.AddMonths(1);
                    }
                }
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
            List<PrivateActualTaskDTO> tasks = new List<PrivateActualTaskDTO>();

            try
            {
                TimeSpan dateTime = DateTime.Now.TimeOfDay;
                var tasksArr = from t in db.tblPrivateTask
                               where t.workerId == userDTO.Id && t.taskToDate >= DateTime.Now
                               select t;
                foreach (var item in tasksArr)
                {
                    var task = from ta in db.tblPrivateActualTask
                               where ta.taskId == item.taskId && ta.taskDate >= DateTime.Today && ta.TimeInDay >= dateTime && ta.taskStatus == "P" && ta.taskDate <= SqlFunctions.DateAdd("d", 7, DateTime.Now)
                               select ta;
                    foreach (var item2 in task)
                    {
                        PrivateActualTaskDTO taskDTO = new PrivateActualTaskDTO();
                        taskDTO.taskId = item2.taskId;
                        taskDTO.actualId = item2.actualId;
                        taskDTO.taskComment = item.taskComment;
                        taskDTO.taskName = item.taskName;
                        taskDTO.taskDate = item2.taskDate;
                        taskDTO.TimeInDay = item2.TimeInDay;
                        taskDTO.taskStatus = item2.taskStatus;
                        tasks.Add(taskDTO);

                    }
                }
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("UpdateActualPrivateTask")] //Update private task by foreign user
        public IHttpActionResult UpdateActualPrivateTask([FromBody] PrivateActualTaskDTO taskDTO)
        {
            try
            {
                tblPrivateActualTask tblPrivateActualTask = db.tblPrivateActualTask.FirstOrDefault(t => t.actualId == taskDTO.actualId);
                tblPrivateActualTask.taskStatus = taskDTO.taskStatus;
                db.SaveChanges();
                return Ok("Private Actual Task updated");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // ----------------------- Public Tasks Section --------------------------//

        [HttpPost]
        [Route("GetAllTasks")] //Get all public tasks
        public IHttpActionResult GetAllTasks([FromBody] string patientId)
        {
            try
            {
                var tasksArr = from t in db.tblPatientTask
                               where t.patientId == patientId && t.taskToDate >= DateTime.Today
                               select t;
                List<ActualTaskDTO> actualTasks = new List<ActualTaskDTO>();
                TimeSpan dateTime = DateTime.Now.TimeOfDay; //will save in temp the current time to use in the query
                foreach (var item in tasksArr)
                {
                    var task = from t in db.tblActualTask
                               where t.taskId == item.taskId &&
                               t.taskDate >= DateTime.Today &&
                               t.taskDate <= SqlFunctions.DateAdd("d", 3, DateTime.Now) &&
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
                        actualTask.timesInDayArray = item.timesInDayArray;
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
                    if (item.type == false)// we will create the product list and add it to the actual list
                    {
                        var prodArr = from t in db.tblProductList //find all relavent ProductList for this task
                                      where t.taskId == item.taskId && t.actualId == item.actualId
                                      select t;
                        if (prodArr.Count() > 0) //that mean the we already have products in this list 
                        {
                            foreach (var product in prodArr)
                            {
                                ProductListDTO productList = new ProductListDTO();
                                productList.taskId = item.taskId;
                                productList.actualId = item.actualId;
                                productList.productId = product.productId;
                                var prodName = from t in db.tblProduct //find the name of the Product from tblProduct
                                               where t.productId == product.productId
                                               select t.productName;
                                productList.productName = prodName.First();
                                productList.productStatus = product.productStatus;
                                productList.productQuantity = product.productQuantity;
                                productList.commentForProduct = product.commentForProduct;
                                productListToSend.Add(productList);
                            }
                            item.prodList = productListToSend; //add to the actual task the product list
                        }
                    }

                    if (item.type == true)// we will create drug for Patient 
                    {
                        var drugForArr = from t in db.tblDrugForPatient //find all relavent DrugList for this task
                                         where t.listId == item.listId
                                         select t;
                        DrugForPatientDTO drugForPatientDTO = new DrugForPatientDTO();
                        drugForPatientDTO.qtyInBox = drugForArr.First().qtyInBox;
                        drugForPatientDTO.dosage = drugForArr.First().dosage;
                        drugForPatientDTO.drugId = drugForArr.First().drugId;
                        drugForPatientDTO.fromDate = drugForArr.First().fromDate;
                        drugForPatientDTO.toDate = drugForArr.First().toDate;
                        drugForPatientDTO.lastTakenDate = drugForArr.First().lastTakenDate;
                        var drugName = from t in db.tblDrug
                                       where t.drugId == drugForPatientDTO.drugId
                                       select t;
                        drugForPatientDTO.drugName = drugName.First().drugName;
                        drugForPatientDTO.drugNameEn = drugName.First().drugNameEn;
                        drugForPatientDTO.drugUrlEn = drugName.First().drugUrlEn;
                        drugForPatientDTO.drugType = drugName.First().Type;
                        drugForPatientDTO.drugUrl = drugName.First().drugUrl;
                        drugForPatientDTO.minQuantity = drugForArr.First().minQuantity;
                        drugForPatientDTO.dosage = drugForArr.First().dosage;
                        item.drug = drugForPatientDTO;
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
            //this section is for update a drugForPatient
            if (list.taskForDelete.taskId != null)
            {

                int listId = list.taskForDelete.listId;
                int taskId = list.taskForDelete.taskId;

                //first we will remove from the db all actacul tasks that from this taskId and also remove the push notification using the actaculId 
                var actualTasks = from a in db.tblActualTask
                                  where a.taskId == taskId
                                  select a;
                foreach (tblActualTask actualT in actualTasks)
                {
                    db.tblActualTask.Remove(actualT);
                    
                }
                db.SaveChanges();

                //remove the patientTask
                tblPatientTask tblPatientTask = db.tblPatientTask.Where(x => x.taskId == taskId).FirstOrDefault();
                if (tblPatientTask != null)
                {
                    db.tblPatientTask.Remove(tblPatientTask);
                    db.SaveChanges();
                }

                //remove all ScheduledNotification
                var scheduledNotification = from sc in db.tblScheduledNotifications
                                            where sc.taskId == taskId
                                            select sc;
                foreach (tblScheduledNotifications item in scheduledNotification)
                {
                    db.tblScheduledNotifications.Remove(item);
                  

                }
                db.SaveChanges();
                //remove all related DrugForPatient using the listId
                var drugForPatient = from d in db.tblDrugForPatient
                                     where d.listId == listId
                                     select d;
                foreach (tblDrugForPatient drug in drugForPatient)
                {
                    db.tblDrugForPatient.Remove(drug);
                   
                }
                db.SaveChanges();
                //remove all actualList using the listId
                var actualList = from a in db.tblActualList
                                 where a.listId == listId
                                 select a;
                foreach (tblActualList actual in actualList)
                {
                    db.tblActualList.Remove(actual);
             
                }
                db.SaveChanges();
                list = list.newDrugForPatient;

                //"30/07/2023" convert this format to DateTime
                ///this is the formt 2023-05-16
                ///
                
         


            }


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
                    taskName = list.drugNameEn; //the name of the drug
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
                        drugFor.timesInDayArray = timesInDayArray; // will not send to the db just a temp field
                        db.InsertDrugForPatient(actualListId, drugFor.fromDate, drugFor.toDate, drugFor.dosage, drugFor.qtyInBox, drugFor.minQuantity, drugFor.drugId, drugFor.patientId);
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
                        string timesInDayString = string.Join(",", timesInDayArray.Select(ts => ts.ToString()));
                        db.InsertPatientTask(task.taskName, task.taskFromDate, task.taskToDate, task.taskComment, task.patientId, task.workerId, task.userId, actualListId, task.frequency, timesInDayString);
                        db.SaveChanges();
                        int taskId = db.tblPatientTask.Max(x => x.taskId);
                        //we use here partial class to add the actual tasks to the db
                        string pushToken = list.pushToken;
                        if (!actualTask.InsertActualTask(task.frequency, task.timesInDayArr, taskId, task.taskFromDate, task.taskToDate, task.listId, isDrug, task.taskName, pushToken))
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
                    string timesInDayString = string.Join(",", timesInDayArray.Select(ts => ts.ToString()));
                    db.InsertPatientTask(task.taskName, task.taskFromDate, task.taskToDate, task.taskComment, task.patientId, task.workerId, task.userId, actualListId, task.frequency, timesInDayString);
                    int taskId = db.tblPatientTask.Max(x => x.taskId);
                    db.SaveChanges();
                    //we use here partial class to add the actual tasks to the db
                    string pushToken = list.pushToken;
                    if (!actualTask.InsertActualTask(task.frequency, task.timesInDayArr, taskId, task.taskFromDate, task.taskToDate, task.listId, isDrug, task.taskName, pushToken))
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
                        int resInsertPatientTask = db.InsertPatientTask(task.taskName, task.taskFromDate, task.taskToDate, task.taskComment, task.patientId, task.workerId, task.userId, actualListId, task.frequency, timesInDayArray.ToString());
                        db.SaveChanges();
                        int taskId = db.tblPatientTask.Max(x => x.taskId);
                        //we use here partial class to add the actual tasks to the db
                        string pushToken = list.pushToken;
                        if (!actualTask.InsertActualTask(task.frequency, task.timesInDayArr, taskId, task.taskFromDate, task.taskToDate, task.listId, isDrug, task.taskName, pushToken))
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
                db.InsertProductList(productId, prodList.actualId, prodList.taskId, "P", prodList.productQuantity, prodList.commentForProduct);
                db.SaveChanges();
                return Ok("Product added to list");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("UpdateProductsToList")]
        public IHttpActionResult UpdateProductsToList([FromBody] List<ProductListDTO> prodList)
        {
            //Find the list of products that are already in the db and update the productQuantity and productStatus 
            try
            {
                foreach (ProductListDTO product in prodList)
                {
                    tblProductList tblProductList = db.tblProductList.Where(x => x.productId == product.productId && x.actualId == product.actualId).FirstOrDefault();
                    if (tblProductList != null)
                    {
                        tblProductList.productQuantity = product.productQuantity;
                        tblProductList.productStatus = product.productStatus;
                        db.SaveChanges();
                    }
                }
                return Ok("Product updated");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("UpdateActualTask")]
        public IHttpActionResult UpdateActualTask([FromBody] ActualTaskDTO actualTask)
        {
            try
            {
                tblActualTask tblActualTask = db.tblActualTask.Where(x => x.actualId == actualTask.actualId).FirstOrDefault();
                if (tblActualTask != null)
                {
                    //update the actual task status
                    tblActualTask.taskStatus = actualTask.taskStatus;
                    db.SaveChanges();
                }
                if (actualTask.drug != null)
                {
                    //if the actual task is a drug, update the drug quantity in table tblDrugForPatient
                    tblDrugForPatient tblDrugForPatient = db.tblDrugForPatient.Where(x => x.drugId == actualTask.drug.drugId && x.listId == actualTask.listId).FirstOrDefault();
                    if (tblDrugForPatient != null)
                    {
                        // Only If type is Pills we need to update the quantity of pills
                        if (actualTask.drug.drugType == "Pill")
                        {
                            tblDrugForPatient.qtyInBox -= tblDrugForPatient.dosage;
                            if (tblDrugForPatient.minQuantity >= tblDrugForPatient.qtyInBox)
                            {
                                string userToken = db.tblUser.Where(x => x.userId == actualTask.userId).Select(x => x.pushToken).FirstOrDefault();
                                string foreignToken = db.tblUser.Where(x => x.userId == actualTask.workerId).Select(x => x.pushToken).FirstOrDefault();
                                if (userToken != null && foreignToken != null)
                                {
                                    string title = "Drug is Running Low";
                                    string body = actualTask.drug.drugNameEn + " - Running low!";
                                    SendPushNotification(foreignToken, userToken, title, body);
                                }
                            }
                        }
                        tblDrugForPatient.lastTakenDate = DateTime.Now;
                        db.SaveChanges();
                    }
                }
                return Ok("Actual Task updated");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        // Send Push async function
        private static HttpClient client = new HttpClient();
        public async void SendPushNotification(string foreignToken, string userToken, string title, string body)
        {
            var objectToSendUser = new
            {
                to = userToken,
                title = title,
                body = body,
                //data = item.data
            };
            var objectToSendForeign = new
            {
                to = foreignToken,
                title = title,
                body = body,
                //data = item.data
            };
            string postData = JsonConvert.SerializeObject(objectToSendUser);
            string postData1 = JsonConvert.SerializeObject(objectToSendForeign);
            var content = new StringContent(postData, Encoding.UTF8, "application/json");
            var content1 = new StringContent(postData1, Encoding.UTF8, "application/json");
            HttpResponseMessage response = await client.PostAsync("https://exp.host/--/api/v2/push/send", content);
            HttpResponseMessage response1 = await client.PostAsync("https://exp.host/--/api/v2/push/send", content1);
        }

        [HttpPut]
        [Route("UpdateDrugForPatientDTO")]
        public IHttpActionResult UpdateDrugForPatientDTO([FromBody] dynamic list)
        {
            int listId = list.taskForDelete.listId;
            int taskId = list.taskForDelete.taskId;

            //first we will remove from the db all actacul tasks that from this taskId and also remove the push notification using the actaculId 
            var actualTasks = from a in db.tblActualTask
                              where a.taskId == taskId
                              select a;
            foreach (tblActualTask actualTask in actualTasks)
            {
                db.tblActualTask.Remove(actualTask);
                db.SaveChanges();
            }
            //remove the patientTask
            tblPatientTask tblPatientTask = db.tblPatientTask.Where(x => x.taskId == taskId).FirstOrDefault();
            if (tblPatientTask != null)
            {
                db.tblPatientTask.Remove(tblPatientTask);
                db.SaveChanges();
            }
            
            //remove all related DrugForPatient using the listId
            var drugForPatient = from d in db.tblDrugForPatient
                                 where d.listId == listId
                                 select d;
            foreach (tblDrugForPatient drug in drugForPatient)
            {
                db.tblDrugForPatient.Remove(drug);
                db.SaveChanges();
            }
            //remove all actualList using the listId
            var actualList = from a in db.tblActualList
                             where a.listId == listId
                             select a;
            foreach (tblActualList actual in actualList)
            {
                db.tblActualList.Remove(actual);
                db.SaveChanges();
            }





            ///רק לבינתיים....

            return Ok("DrugForPatientDTO updated"); 
        }
    }
}