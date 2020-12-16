using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication1.Entities
{
    public class Specialization
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<Doctor> Doctors { get; set; }
    }
}
