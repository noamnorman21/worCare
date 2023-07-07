using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.SqlTypes;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Helpers;
using System.Web.Http;
using System.Web.Http.Cors;
using DATA;
using WebApi.DTO;

namespace WebApi.Controllers
{
    [RoutePrefix("api/Notification")]
    public class NotificationController : ApiController
    {
        igroup194DB db = new igroup194DB();

        [HttpPost]
        [Route("InsertNotificationThatSent")]
        public IHttpActionResult InsertNotificationThatSent([FromBody] NotificationsThatSentDTO notification)
        {
            db.InsertNotification(notification.title, notification.pushMessage, notification.time, notification.userId, "P");
            return Ok("Notification saved in the database");
        }
        [HttpPost]
        [Route("UpdateNotificationStatus")]
        public IHttpActionResult UpdateNotificationStatus([FromBody] List<int> notificationIDs)
        {
            //get list of notifications id that the user saw in the client side and update the status to "S" (saw)
            foreach (tblNotifictions item in db.tblNotifictions)
            {
                if (notificationIDs.Contains(item.notificationID))
                    item.status = "S";
            }
            db.SaveChanges();
            return Ok("Notification status updated");
        }
    }
}