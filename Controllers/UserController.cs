using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApplication1.Data;
using WebApplication1.Entities;
using WebApplication1.Models;
using WebApplication1.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebApplication1.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private IUserService _userService;

        private readonly ApplicationDbContext _context;
        public UserController(IUserService userService, ApplicationDbContext context)
        {
            _userService = userService;
            _context = context;
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody] AuthenticateModel model)
        {
            try
            {
                var user = _userService.Authenticate(model.Username, model.Password);

                if (user == null)
                    return BadRequest(new { message = "Username or password is incorrect" });

                return Ok(user);
            }
            catch (Exception)
            {
                return StatusCode(500);
            }

        }
        [AllowAnonymous]
        // POST api/<UserController>
        [HttpPost("registration")]
        public async Task<IActionResult> Post([FromBody] User user)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest();
                }
                var userFromDb = _context.Users.FirstOrDefault(x => x.Username == user.Username);
                if(userFromDb !=null)
                {
                    return BadRequest("Username already taken");
                }

                user.Role = Role.User;
                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();
                var registeredUser = _userService.Authenticate(user.Username, user.Password);

                if (user == null)
                    return BadRequest(new { message = "Username or password is incorrect" });

                return Ok(user);


            }
            catch (Exception)
            {
                return StatusCode(500);
            }

        }
        [Authorize]
        [HttpPut]
        public async Task<IActionResult> Put([FromBody] User user)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest();
                }

                var userFromDb = _context.Users.AsNoTracking().FirstOrDefault(x => x.Username == user.Username);
                if (userFromDb == null)
                {
                    return NotFound();
                }

                if (await TryUpdateModelAsync(user))
                {
                    user.Role = userFromDb.Role;
                    _context.Users.Update(user);
                    await _context.SaveChangesAsync();

                    var registeredUser = _userService.Authenticate(user.Username, user.Password);

                    if (user == null)
                        return BadRequest(new { message = "Username or password is incorrect" });

                    return Ok(user);
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
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest();
                }

                var user = _context.Users.AsNoTracking().FirstOrDefault(x => x.Id == id);

                if (user == null)
                {
                    return NotFound();
                }

                _context.Users.Remove(user);
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
