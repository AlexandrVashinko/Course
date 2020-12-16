using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication1.Entities
{
    public class Ticket
    {
        public int Id { get; set; }
        public int NumberOfTicket { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        [NotMapped]
        public int Interval { get; set; }
        public int DoctorId { get; set; }
        public Doctor Doctor { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
