using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PicStory.CORE.DTOs;
using PicStory.CORE.Models;
using PicStory.CORE.Services;
using PicStory.SERVICE;
using PicStory_Api.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace PicStory_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserServices _userServices;
        private readonly IMapper _mapper;

        public UserController(IUserServices userServices, IMapper mapper)
        {
            _userServices = userServices;
            _mapper = mapper;
        }

        // GET: api/<AlbumController>
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var list = await _userServices.GetAllAsync();
            var listDto = _mapper.Map<IEnumerable<User>>(list);
            return Ok(listDto);
        }

        // GET api/<AlbumController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var user = await _userServices.GetByIdAsync(id);
            var userDto = _mapper.Map<UserDTO>(user);
            return Ok(user);
        }

        // POST api/<AlbumController>
        [HttpPost]
        public async Task Post([FromBody] UserPostModel user)
        {
            var userToAdd = _mapper.Map<User>(user);
            await _userServices.AddValueAsync(userToAdd);
        }

        // PUT api/<AlbumController>/5
        [HttpPut("{id}")]
        public async Task Put(int id, [FromBody] User user)
        {
            var dto = _mapper.Map<User>(user);
            await _userServices.PutValueAsync(dto);
        }

        // DELETE api/<AlbumController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var album = await _userServices.GetByIdAsync(id);
            if (album == null)
            {
                return NotFound();
            }

            await _userServices.DeleteAsync(album);
            return NoContent(); 
        }
    }
}
