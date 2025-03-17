using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using PicStory.CORE.DTOs;
using PicStory.CORE.Models;
using PicStory.CORE.Services;
using PicStory_Api.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace PicStory_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TagController : ControllerBase
    {
        private readonly ITagServices _tagServices;
        private readonly IMapper _mapper;

        public TagController(ITagServices tagServices, IMapper mapper)
        {
            _tagServices = tagServices;
            _mapper = mapper;
        }

        // GET: api/<AlbumController>
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var list = await _tagServices.GetAllAsync();
            var listDto = _mapper.Map<IEnumerable<TagDTO>>(list);
            return Ok(listDto);
        }

        // GET api/<AlbumController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            var tag = await _tagServices.GetByIdAsync(id);
            var tagDto = _mapper.Map<TagDTO>(tag);
            return Ok(tagDto);
        }

        // POST api/<AlbumController>
        [HttpPost]
        public async Task Post([FromBody] TagPostModel tag)
        {
            var tagToAdd = _mapper.Map<Tag>(tag);
            await _tagServices.AddValueAsync(tagToAdd);
        }

        // PUT api/<AlbumController>/5
        [HttpPut("{id}")]
        public async Task Put(int id, [FromBody] Tag tag)
        {
            var dto = _mapper.Map<Tag>(tag);
            await _tagServices.PutValueAsync(dto);
        }

        // DELETE api/<AlbumController>/5
        [HttpDelete("{id}")]
        public async Task Delete(Tag tag)
        {
            var dto = _mapper.Map<Tag>(tag);
            await _tagServices.DeleteAsync(dto);
        }
    }
}
