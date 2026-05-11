using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PicStory.CORE.DTOs;
using PicStory.CORE.Models;
using PicStory.DATA;

namespace PicStory_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class DashboardController : ControllerBase
    {
        private readonly DataContext _context;

        public DashboardController(DataContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<ActionResult> GetStats()
        {
            var usersCount = await _context.Users.CountAsync();

            var albumsCount = await _context.Albums.CountAsync();

            var photosCount = await _context.Photos.CountAsync();

            var result = new DashboardStatsDto
            {
                Users = usersCount,
                Albums = albumsCount,
                Photos = photosCount
            };

            return Ok(result);
        }
    }
}