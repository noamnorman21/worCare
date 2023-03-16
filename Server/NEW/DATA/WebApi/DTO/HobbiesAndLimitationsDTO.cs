using DATA;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApi.DTO
{
    public class HobbiesAndLimitationsDTO
    {
        // Patient hobbies DTO
        public string patientId { get; set; }
        public string books { get; set; }
        public string music { get; set; }
        public string TVShow { get; set; }
        public string radioChannel { get; set; }
        public string food { get; set; }
        public string drink { get; set; }
        public string movie { get; set; }
        public string specialHabits { get; set; }
        public string afternoonNap { get; set; }
        public string nightSleep { get; set; }
        public string otherH { get; set; } // other hobbies

        // Patient limitations DTO
        public string allergies { get; set; }
        public string sensitivities { get; set; }
        public string physicalAbilities { get; set; }
        public string bathRoutine { get; set; }
        public string sensitivityToNoise { get; set; }
        public string otherL { get; set; } // other limitations
    }
}