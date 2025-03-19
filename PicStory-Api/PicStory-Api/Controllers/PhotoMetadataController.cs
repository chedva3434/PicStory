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
    public class PhotoMetadataController : ControllerBase
    {
        private readonly IPhotoMetadataServices _photoMetadataServices;
        private readonly IMapper _mapper;

        public PhotoMetadataController(IPhotoMetadataServices photoMetadataServices, IMapper mapper)
        {
            _photoMetadataServices = photoMetadataServices;
            _mapper = mapper;
        }

        // GET: api/<AlbumController>
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var list = await _photoMetadataServices.GetAllAsync();
            var listDto = _mapper.Map<IEnumerable<PhotoMetadataDTO>>(list);
            return Ok(listDto);
        }

        // GET api/<AlbumController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var photoMetadata = await _photoMetadataServices.GetByIdAsync(id);
            var photoDto = _mapper.Map<PhotoDTO>(photoMetadata);
            return Ok(photoDto);
        }

        // POST api/<AlbumController>
        [HttpPost]
        public async Task Post([FromBody] PhotoMetadataPostModel photoMetadata)
        {
            var photoMetadataToAdd = _mapper.Map<PhotoMetadata>(photoMetadata);
            await _photoMetadataServices.AddValueAsync(photoMetadataToAdd);
        }

        // PUT api/<AlbumController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] UpdatePhotoMetadataModel photoMetadataModel)
        {
            var existingPhotoMetadataModel = await _photoMetadataServices.GetByIdAsync(id);
            if (existingPhotoMetadataModel != null)
            {
                existingPhotoMetadataModel.Metadata = photoMetadataModel.Metadata;
                existingPhotoMetadataModel.FaceRecognitionData = photoMetadataModel.FaceRecognitionData;

                await _photoMetadataServices.PutValueAsync(existingPhotoMetadataModel);  // כאן אנחנו פשוט מעדכנים
                return Ok(existingPhotoMetadataModel);
            }

            return NoContent();  // 204 No Content

        }

        // DELETE api/<AlbumController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var album = await _photoMetadataServices.GetByIdAsync(id);
            if (album == null)
            {
                return NotFound();
            }

            await _photoMetadataServices.DeleteAsync(album);
            return NoContent(); // 204 - הצלחה ללא תוכן
        }

    }
}
