using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication1.Data;
using WebApplication1.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using WebApplication1.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DoctorController(ApplicationDbContext context)
        {
            _context = context;
        }
        // GET: api/<DoctorController>
        [HttpGet]
        public async Task<IActionResult> GetAsync()
        {
            try
            {
                var doctors = await _context.Doctors.Include(x => x.Specialization).AsNoTracking().ToListAsync();
                return Ok(doctors);
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }

        // GET api/<DoctorController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest();
                }

                var doctor = await _context.Doctors.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);

                if(doctor == null)
                {
                    return NotFound();
                }

                return Ok(doctor);
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }

        [HttpPost("search")]
        public async Task<IActionResult> Search([FromBody] DoctorSearchModel model)
        {
            try
            {
                var doctors = from m in _context.Doctors
                             select m;

                if (!string.IsNullOrEmpty(model.LastName))
                {
                    doctors = doctors.Where(x => EF.Functions.Like(x.LastName, $"%{model.LastName}%"));
                }

                if (!string.IsNullOrEmpty(model.FirstName))
                {
                    doctors = doctors.Where(x => EF.Functions.Like(x.FirstName, $"%{model.FirstName}%"));
                }

                if (!string.IsNullOrEmpty(model.MiddleName))
                {
                    doctors = doctors.Where(x => EF.Functions.Like(x.MiddleName, $"%{model.MiddleName}%"));
                }

                if (model.SpecializationId > 0)
                {
                    doctors = doctors.Where(x => x.SpecializationId == model.SpecializationId);
                }

                return Ok(await doctors.Include(x => x.Specialization).ToListAsync());
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }

        // POST api/<DoctorController>
        [Authorize(Roles = Role.Admin)]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Doctor doctor)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest();
                }
                await _context.Doctors.AddAsync(doctor);
                await _context.SaveChangesAsync();

                return Ok(await _context.Doctors.Include(x => x.Specialization).AsNoTracking().ToListAsync());
            }
            catch (Exception)
            {
                return StatusCode(500);
            }
        }

        // PUT api/<DoctorController>/5
        [Authorize(Roles = Role.Admin)]
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Doctor doctor)
        {
            try
            {
                if (id <= 0 || !ModelState.IsValid)
                {
                    return BadRequest();
                }

                var doctorFromDb = _context.Doctors.AsNoTracking().FirstOrDefault(x=> x.Id == id);
                if(doctorFromDb == null)
                {
                    return NotFound();
                }

                if (await TryUpdateModelAsync(doctor))
                {
                    _context.Doctors.Update(doctor);
                    await _context.SaveChangesAsync();
                    return Ok(await _context.Doctors.Include(x => x.Specialization).AsNoTracking().ToListAsync());
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

        // DELETE api/<DoctorController>/5
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

                var doctor = _context.Doctors.AsNoTracking().FirstOrDefault(x => x.Id == id);

                if(doctor == null)
                {
                    return NotFound();
                }

                _context.Doctors.Remove(doctor);
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
