using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using DATA;
using WebApi.DTO;
using System.Web.Http.Cors;
using System.IO;
using System.Text;
using System.Web.Script.Serialization;
using Expo.Server.Client;
using Expo.Server.Models;
using Newtonsoft.Json;

namespace WebApi.DTO
{
    public static class TimerServices
    {
        private static HttpClient client = new HttpClient();

        public static async void CheckPush()
        {
            using (igroup194Db db = new igroup194Db())
            {
                DateTime now = DateTime.Now;
                DateTime nowWithoutSeconds = new DateTime(now.Year, now.Month, now.Day, now.Hour, now.Minute, 0);

                var pushN = db.tblScheduledNotifications.ToList();
                var actualTask = db.tblActualTask.Where(x => x.taskStatus == "P").ToList();
                var paymentRequest = db.tblPaymentRequest.Where(x => x.requestStatus == "P").ToList();

                foreach (var item in pushN)
                {
                    DateTime scheduledTime = item.scheduledTime.AddMinutes(-30);
                    DateTime scheduledTimeWithoutSeconds = new DateTime(scheduledTime.Year, scheduledTime.Month, scheduledTime.Day, scheduledTime.Hour, scheduledTime.Minute, 0);
                    DateTime pushRequestTime = new DateTime(item.scheduledTime.Year, item.scheduledTime.Month, item.scheduledTime.Day, 9, 0, 0);
                    if (nowWithoutSeconds == scheduledTimeWithoutSeconds)
                    {
                        if (item.actualTaskId != null && actualTask.Any(x => x.actualId == item.actualTaskId))
                        {
                            var objectToSend = new
                            {
                                to = item.pushToken,
                                title = item.title,
                                body = item.pushMessage,
                                //data = item.data
                            };
                            string postData = JsonConvert.SerializeObject(objectToSend);
                            var content = new StringContent(postData, Encoding.UTF8, "application/json");

                            HttpResponseMessage response = await client.PostAsync("https://exp.host/--/api/v2/push/send", content);
                            if (response.IsSuccessStatusCode)
                            {
                                db.tblScheduledNotifications.Remove(item);
                                await db.SaveChangesAsync();
                            }
                            else
                            {
                                var responseBody = await response.Content.ReadAsStringAsync();
                                Console.WriteLine(responseBody);
                            }
                        }
                    }
                    else if (nowWithoutSeconds == pushRequestTime)
                    {
                        if (item.paymentId != null && paymentRequest.Any(x => x.requestId == item.paymentId))
                        {
                            var objectToSend = new
                            {
                                to = item.pushToken,
                                title = item.title,
                                body = item.pushMessage,
                                //data = item.data
                            };
                            string postData = JsonConvert.SerializeObject(objectToSend);
                            var content = new StringContent(postData, Encoding.UTF8, "application/json");

                            HttpResponseMessage response = await client.PostAsync("https://exp.host/--/api/v2/push/send", content);
                            if (response.IsSuccessStatusCode)
                            {
                                db.tblScheduledNotifications.Remove(item);
                                await db.SaveChangesAsync();
                            }
                            else
                            {
                                var responseBody = await response.Content.ReadAsStringAsync();
                                Console.WriteLine(responseBody);
                            }
                        }
                    }
                }
            }
        }
    }
}