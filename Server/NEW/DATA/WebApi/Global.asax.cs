using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Timers;

namespace WebApi
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        // Timer for the daily tasks push notifications
        static Timer timer = new Timer();        

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            // Code For timer - per 1 minute
            timer.Interval = 60000;
            timer.Elapsed += tm_Tick;
            timer.Start();
        }
        
        private void tm_Tick(object sender,ElapsedEventArgs e)
        {
            StopTimer();
            WebApi.DTO.TimerServices.CheckPush();
        }
        
        public static void StartTimer()
        {
            timer.Start();
        }

        public static void StopTimer()
        {
            timer.Stop();
        }

        // End of timer code

    }
}
