using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Data;
using WebApplication1.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CoursePr.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScheduleController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ScheduleController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/<ScheduleController>
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAsync()
        {
            try
            {
                var schedules = await _context.Schedules.AsNoTracking().ToListAsync();
                return Ok(schedules);
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }

        [Authorize]
        // GET api/<ScheduleController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest();
                }

                var schedule = await _context.Schedules.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);

                if (schedule == null)
                {
                    return NotFound();
                }

                var interval = schedule.Interval;
                var date = schedule.Date;
                var startTime = schedule.StartTime;
                var endTime = schedule.EndTime;
                var doctorId = schedule.DoctorId;
                var range = endTime - startTime;
                // .Range(0, 1440 / IntervalParameter) - see Zohar Peled's comment -  
                // is brief, but less readable
                List<string> query = Enumerable
                  .Range(0, (int)(range.TotalMinutes / interval))
                  .Select(i => new DateTime(date.Year, date.Month, date.Day, startTime.Hours, startTime.Minutes, startTime.Seconds)
                     .AddMinutes(i * (double)interval) // AddHours is redundant
                     .ToString("HH:mm")) // Let's provide HH:mm format
                     .ToList();

                var timeSpanList = new List<TimeSpan>();
                foreach (var q in query)
                {
                    timeSpanList.Add(TimeSpan.Parse(q));
                }

                var usedTimes = await _context.Tickets.Where(x => x.Date == schedule.Date && x.DoctorId == schedule.DoctorId)
                    .AsNoTracking().Select(x => x.StartTime).ToListAsync();

                var resultTimes = timeSpanList.Except(usedTimes).ToList();

                var response = new ScheduleByIdModel
                {
                    DoctorId = doctorId,
                    Date = date,
                    Times = resultTimes,
                    ScheduleId = id,
                    Interval = interval
                };

                return Ok(response);
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }
        [Authorize]
        [HttpGet("getSchedulesByDoctorId/{id}")]
        public async Task<IActionResult> GetSchedulesByDoctorId(int id)
        {
            try
            {
                var schedules = await _context.Schedules.Where(x => x.DoctorId == id).AsNoTracking().ToListAsync();
                return Ok(schedules);
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }

        // POST api/<ScheduleController>
        [Authorize(Roles = Role.Admin)]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Schedule schedule)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest();
                }

                if(schedule.StartTime >= schedule.EndTime)
                {
                    return BadRequest();
                }

                if (schedule.Date >= DateTime.Now)
                {
                    var scheduleFromDb = await _context.Schedules.Where(x => x.DoctorId == schedule.DoctorId && x.Date == schedule.Date).AsNoTracking().ToListAsync();
                    if(scheduleFromDb.Count != 0)
                    {
                        return BadRequest("Already exist");
                    }

                    await _context.Schedules.AddAsync(schedule);
                    await _context.SaveChangesAsync();
                    return Ok();

                }
                else
                {
                    return BadRequest();
                }

            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }

        // PUT api/<ScheduleController>/5
        [Authorize(Roles = Role.Admin)]
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Schedule schedule)
        {
            try
            {
                if (id <= 0 || !ModelState.IsValid)
                {
                    return BadRequest();
                }

                var scheduleFromDb = _context.Schedules.AsNoTracking().FirstOrDefault(x => x.Id == id);
                if (scheduleFromDb == null)
                {
                    return NotFound();
                }

                if (await TryUpdateModelAsync(schedule))
                {
                    if (schedule.Date >= DateTime.Now)
                    {
                        _context.Schedules.Update(schedule);
                        await _context.SaveChangesAsync();
                        return Ok();
                    }
                    else
                    {
                        return BadRequest();
                    }
                }
                else
                {
                    throw new DbUpdateException();
                }
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }

        // DELETE api/<ScheduleController>/5
        [Authorize(Roles = Role.Admin)]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest();
                }

                var schedule = _context.Schedules.AsNoTracking().FirstOrDefault(x => x.Id == id);

                if (schedule == null)
                {
                    return NotFound();
                }

                _context.Schedules.Remove(schedule);

                var tickets = await _context.Tickets.Where(x => x.Date == schedule.Date && x.DoctorId == schedule.DoctorId)
                    .AsNoTracking().ToListAsync();
                _context.Tickets.RemoveRange(tickets);
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }
    }
}
