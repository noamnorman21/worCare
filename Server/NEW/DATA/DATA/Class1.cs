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
        igroup194DB db = new igroup194DB();

        public int InsertCalendar(int id, int[] calendarsTypeArr)
        {
            try
            {
                tblUser userExist = db.tblUsers.Where(x => x.Id == id).First();
                if (userExist == null)
                    return -1;
                db.InsertCalendarForUser(24, userExist.Id, true);
                foreach (int item in calendarsTypeArr)
                {
                    //here we will add all the calendars that the user choose 
                    if (item != 24)
                        db.InsertCalendarForUser(item, userExist.Id, false);
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