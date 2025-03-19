using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using PicStory.CORE.DTOs;
using PicStory.CORE.Models;
using PicStory.CORE.Services;
using PicStory.SERVICE;
using PicStory_Api.Models;
using System.Collections.Generic;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace PicStory_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlbumController : ControllerBase
    {
        private readonly IAlbumService _albumService;
        private readonly IMapper _mapper;

        public AlbumController(IAlbumService albumService, IMapper mapper)
        {
            _albumService = albumService;
            _mapper = mapper;
        }

        // GET: api/<AlbumController>
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var list = await _albumService.GetAllAsync();
            var listDto = _mapper.Map<IEnumerable<AlbumDTO>>(list);
            return Ok(listDto);
        }

        // GET api/<AlbumController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var album = await _albumService.GetByIdAsync(id);
            var albumDto = _mapper.Map<AlbumDTO>(album);
            return Ok(albumDto);
        }

        // POST api/<AlbumController>
        [HttpPost]
        public async Task Post([FromBody] AlbumPostModel album)
        {
            var albumToAdd = _mapper.Map<Album>(album);
            await _albumService.AddValueAsync(albumToAdd);
        }

        // PUT api/<AlbumController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] AlbumPostModel album)
        {
            var dto = _mapper.Map<Album>(album);
            await _albumService.PutValueAsync(dto);
            return Ok();
        }

        // DELETE api/<AlbumController>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var album = await _albumService.GetByIdAsync(id);
            if (album == null)
            {
                return NotFound();
            }

            await _albumService.DeleteAsync(album);
            return NoContent(); // 204 - הצלחה ללא תוכן
        }
    }


}
