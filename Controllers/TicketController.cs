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
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TicketController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TicketController(ApplicationDbContext context)
        {
            _context = context;
        }
        // GET: api/<TicketController>
        [HttpGet]
        public async Task<IActionResult> GetAsync()
        {
            try
            {
                var tickets = await _context.Tickets.AsNoTracking().ToListAsync();
                return Ok(tickets);
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }

        // GET api/<TicketController>/5
        [HttpGet("userTickets/{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                if (id < 0)
                {
                    return BadRequest();
                }

                var tickets = await _context.Tickets.Include(t => t.Doctor).Where(x => x.UserId == id).AsNoTracking().ToListAsync();

                if (tickets == null)
                {
                    return NotFound();
                }

                return Ok(tickets);
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }

        [HttpGet("doctorTickets/{id}")]
        public async Task<IActionResult> GetByDoctorId(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest();
                }
                
                var tickets = await _context.Tickets.Include(t => t.User).Where(x => x.DoctorId == id).AsNoTracking().ToListAsync();

                if (tickets == null)
                {
                    return NotFound();
                }

                return Ok(tickets);
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }

        // POST api/<TicketController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Ticket ticket)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest();
                }

                ticket.EndTime = ticket.StartTime + TimeSpan.FromMinutes(ticket.Interval); 
                await _context.Tickets.AddAsync(ticket);
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }

        // PUT api/<TicketController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Ticket ticket)
        {
            try
            {
                if (id <= 0 || !ModelState.IsValid)
                {
                    return BadRequest();
                }

                var ticketFromDb = _context.Tickets.AsNoTracking().FirstOrDefault(x => x.Id == id);
                if (ticketFromDb == null)
                {
                    return NotFound();
                }

                if (await TryUpdateModelAsync(ticket))
                {
                    _context.Tickets.Update(ticket);
                    await _context.SaveChangesAsync();
                    return Ok();
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

        // DELETE api/<TicketController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest();
                }

                var ticket = _context.Tickets.AsNoTracking().FirstOrDefault(x => x.Id == id);

                if (ticket == null)
                {
                    return NotFound();
                }

                _context.Tickets.Remove(ticket);
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
