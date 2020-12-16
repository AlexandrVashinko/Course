using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication1.Entities
{
    public class ScheduleByIdModel
    {
        public List<TimeSpan> Times { get; set; }
        public DateTime Date { get; set; }
        public int DoctorId { get; set; }
        public int ScheduleId { get; set; }
        public int Interval { get; set; }
    }
}
