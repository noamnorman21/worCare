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
    
}