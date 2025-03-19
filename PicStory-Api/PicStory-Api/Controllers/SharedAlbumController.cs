using AutoMapper;
using Microsoft.AspNetCore.Mvc;
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
    public class SharedAlbumController : ControllerBase
    {
        private readonly ISharedAlbumServices _sharedAlbumServices;
        private readonly IMapper _mapper;

        public SharedAlbumController(ISharedAlbumServices sharedAlbumServices, IMapper mapper)
        {
            _sharedAlbumServices = sharedAlbumServices;
            _mapper = mapper;
        }

        // GET: api/<AlbumController>
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var list = await _sharedAlbumServices.GetAllAsync();
            var listDto = _mapper.Map<IEnumerable<SharedAlbumDTO>>(list);
            return Ok(listDto);
        }

        // GET api/<AlbumController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var sharedAlbum = await _sharedAlbumServices.GetByIdAsync(id);
            var sharedAlbumDto = _mapper.Map<SharedAlbumDTO>(sharedAlbum);
            return Ok(sharedAlbumDto);
        }

        // POST api/<AlbumController>
        [HttpPost]
        public async Task Post([FromBody] SharedAlbumPostModel sharedAlbum)
        {
            var sharedAlbumToAdd = _mapper.Map<SharedAlbum>(sharedAlbum);
            await _sharedAlbumServices.AddValueAsync(sharedAlbumToAdd);
        }

        // PUT api/<AlbumController>/5
        [HttpPut("{id}")]
        public async Task Put(int id, [FromBody] SharedAlbum sharedAlbum)
        {
            var dto = _mapper.Map<SharedAlbum>(sharedAlbum);
            await _sharedAlbumServices.PutValueAsync(dto);
        }

        // DELETE api/<AlbumController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var album = await _sharedAlbumServices.GetByIdAsync(id);
            if (album == null)
            {
                return NotFound();
            }

            await _sharedAlbumServices.DeleteAsync(album);
            return NoContent(); // 204 - הצלחה ללא תוכן
        }
    }
}
