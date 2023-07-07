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
        public IHttpActionResult UpdateNotificationStatus([FromBody] int notificationIDs)
        {
            var notification = db.tblNotifictions.FirstOrDefault(x => x.notificationID == notificationIDs);
            if (notification != null)
            {
                notification.status = "S";
                db.SaveChanges();
                return Ok("Notification status updated");
            }
            else
            {
                return BadRequest("Bibi the king");
            }

        }
        [HttpPost]
        [Route("GetNotificationsThatSent")]
        public IHttpActionResult GetNotificationsThatSent([FromBody] int userID)            
        {
            //list of NotificationsThatSentDTO          
            var notifications = db.tblNotifictions.Where(x => x.userId == userID ).Select(x => new NotificationsThatSentDTO
            {
                notificationID = x.notificationID,
                title = x.title,
                pushMessage = x.pushMessage,
                time = x.time,
                userId = x.userId,
                status = x.status
            }).ToList();
            return Ok(notifications);
        }
    }
}