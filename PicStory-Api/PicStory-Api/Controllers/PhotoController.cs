using AutoMapper;
using Microsoft.AspNetCore.Authorization;
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
    [Authorize]
    public class PhotoController : ControllerBase
    {
        private readonly IPhotoServices _photoServices;
        private readonly IMapper _mapper;

        public PhotoController(IPhotoServices photoServices, IMapper mapper)
        {
            _photoServices = photoServices;
            _mapper = mapper;
        }

        // GET: api/<AlbumController>
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var list = await _photoServices.GetAllAsync();
            var listDto = _mapper.Map<IEnumerable<PhotoDTO>>(list);
            return Ok(listDto);
        }

        // GET api/<AlbumController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var photo = await _photoServices.GetByIdAsync(id);
            var photoDto = _mapper.Map<PhotoDTO>(photo);
            return Ok(photoDto);
        }

        // POST api/<AlbumController>
        [HttpPost]
        public async Task Post([FromBody] PhotoPostModel photo)
        {
            var photoToAdd = _mapper.Map<Photo>(photo);
            await _photoServices.AddValueAsync(photoToAdd);
        }

        // PUT api/<AlbumController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] UpdatePhotoModel photoModel)
        {
            var existingPhotoModel = await _photoServices.GetByIdAsync(id);
            if (existingPhotoModel != null)
            {
                existingPhotoModel.FileUrl= photoModel.FileUrl;
                existingPhotoModel.Title = photoModel.Title;
                existingPhotoModel.Description = photoModel.Description;

                await _photoServices.PutValueAsync(existingPhotoModel);  // כאן אנחנו פשוט מעדכנים
                return Ok(existingPhotoModel);
            }

            return NoContent();  // 204 No Content

        }

        // DELETE api/<AlbumController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var album = await _photoServices.GetByIdAsync(id);
            if (album == null)
            {
                return NotFound();
            }

            await _photoServices.DeleteAsync(album);
            return NoContent(); // 204 - הצלחה ללא תוכן
        }
    }
}
