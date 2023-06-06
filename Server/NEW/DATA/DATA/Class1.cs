using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity; // for DbContext
using System.Web.Http;
using System.Web.Http.Results;

namespace DATA
{
    public partial class tblCalendarForUser
    {
        igroup194Db db = new igroup194Db();
        public int InsertCalendar(int id, int[] calendarsTypeArr)
        {

            try
            {
                tblUser userExist = db.tblUser.Where(x => x.userId == id).First();
                if (userExist == null)
                    return -1;
                //24 mean the Jewish calendar, its hard coded because all users have the Jewish calendar as primary calendar
                db.InsertCalendarForUser(24, userExist.userId, true);
                foreach (int item in calendarsTypeArr)
                {
                    //here we will add all the calendars that the user choose 
                    if (item != 24)
                        db.InsertCalendarForUser(item, userExist.userId, false);
                }
                return 1;
            }
            catch (Exception)
            {
                return -1;
            }
        }
    }
    public partial class tblActualTask
    {
        igroup194Db db = new igroup194Db();
        public bool InsertActualTask(string frequency, TimeSpan[] timesInDayArr, int taskId, DateTime taskFromDate, DateTime taskToDate, int listId, Nullable<bool> type, string taskName)
        {
            try
            {
                var list = db.tblActualList.Where(x => x.listId == listId).First();
                DateTime tempDate = taskFromDate;
                if (frequency == "Once")
                {
                    if (timesInDayArr.Length > 1)
                    {
                        for (int i = 0; i < timesInDayArr.Length; i++)
                        {
                            //task.taskToDate in this content is the date of the task
                            db.InsertActualTask(taskId, taskToDate, timesInDayArr[i], "P");
                            if (type == false)
                            {
                                int actualId = db.tblActualTask.Max(x => x.actualId);
                                var task = db.tblActualTask.Where(x => x.actualId == actualId).First();
                                db.InsertList(taskName, list.listId, actualId, task.taskId);
                            }
                        }
                    }
                    else
                    {     //task.taskToDate in this content is the date of the task
                        db.InsertActualTask(taskId, taskToDate, timesInDayArr[0], "P");
                        if (type == false)
                        {
                            int actualId = db.tblActualTask.Max(x => x.actualId);
                            var task = db.tblActualTask.Where(x => x.actualId == actualId).First();
                            db.InsertList(taskName, list.listId, actualId, task.taskId);
                        }
                    }
                }
                else if (frequency == "Daily")
                {
                    while (tempDate < taskToDate)
                    {

                        for (int i = 0; i < timesInDayArr.Length; i++)
                        {
                            db.InsertActualTask(taskId, tempDate, timesInDayArr[i], "P");
                            if (type == false)
                            {
                                int actualId = db.tblActualTask.Max(x => x.actualId);
                                var task = db.tblActualTask.Where(x => x.actualId == actualId).First();
                                db.InsertList(taskName, list.listId, actualId, task.taskId);
                            }
                        }
                        tempDate = tempDate.AddDays(1);
                    }
                }
                else if (frequency == "Weekly")
                {
                    while (tempDate.AddDays(7) < taskToDate)
                    {
                       
                        for (int i = 0; i < timesInDayArr.Length; i++)
                        {
                            db.InsertActualTask(taskId, tempDate, timesInDayArr[i], "P");
                            if (type == false)
                            {
                                int actualId = db.tblActualTask.Max(x => x.actualId);
                                var task = db.tblActualTask.Where(x => x.actualId == actualId).First();
                                db.InsertList(taskName, list.listId, actualId, task.taskId);
                            }
                        }
                        tempDate = tempDate.AddDays(7);
                    }
                }
                else     //else: task.frequency == "Monthly"
                {
                    while (tempDate.AddMonths(1) < taskToDate)
                    {
                     
                        for (int i = 0; i < timesInDayArr.Length; i++)
                        {
                            db.InsertActualTask(taskId, tempDate, timesInDayArr[i], "P");
                            if (type == false)
                            {
                                var task = db.tblActualTask.Where(x => x.actualId == actualId).First();
                                db.InsertList(taskName, list.listId, task.actualId, task.taskId);
                            }
                        }
                        tempDate = tempDate.AddMonths(1);
                    }
                }
                
                
                db.SaveChanges();
                return true;
            }
            catch (Exception )
            {
                return false;
            }
        }
    }
}