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
    public class SpecializationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SpecializationController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/<SpecializationController>
        [HttpGet]
        public async Task<IActionResult> GetAsync()
        {
            try
            {
                var specialization = await _context.Specializations.AsNoTracking().ToListAsync();
                return Ok(specialization);
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }

        // GET api/<SpecializationController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest();
                }

                var specialization = await _context.Specializations.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);

                if (specialization == null)
                {
                    return NotFound();
                }

                return Ok(specialization);
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }

        [Authorize(Roles = Role.Admin)]
        // POST api/<SpecializationController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Specialization specialization)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest();
                }
                await _context.Specializations.AddAsync(specialization);
                await _context.SaveChangesAsync();

                return Ok(await _context.Specializations.AsNoTracking().ToListAsync());
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }

        [Authorize(Roles = Role.Admin)]
        // PUT api/<SpecializationController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Specialization specialization)
        {
            try
            {
                if (id <= 0 || !ModelState.IsValid)
                {
                    return BadRequest();
                }

                var specializationFromDb = _context.Specializations.AsNoTracking().FirstOrDefault(x => x.Id == id);
                if (specializationFromDb == null)
                {
                    return NotFound();
                }

                if (await TryUpdateModelAsync(specialization))
                {
                    _context.Specializations.Update(specialization);
                    await _context.SaveChangesAsync();
                    return Ok(await _context.Specializations.AsNoTracking().ToListAsync());
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

        [Authorize(Roles = Role.Admin)]
        // DELETE api/<SpecializationController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest();
                }

                var specialization = _context.Specializations.AsNoTracking().FirstOrDefault(x => x.Id == id);

                if (specialization == null)
                {
                    return NotFound();
                }

                _context.Specializations.Remove(specialization);
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
