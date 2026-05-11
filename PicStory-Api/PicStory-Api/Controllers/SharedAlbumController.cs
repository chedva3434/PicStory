using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PicStory.CORE.DTOs;
using PicStory.CORE.Models;
using PicStory.CORE.Services;
using PicStory.SERVICE;
using PicStory_Api.Models;

namespace PicStory_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SharedAlbumController : ControllerBase
    {
        private readonly ISharedAlbumServices _sharedAlbumServices;
        private readonly IAlbumService _albumServices;
        private readonly IUserServices _userServices;
        private readonly IMapper _mapper;

        public SharedAlbumController(
            ISharedAlbumServices sharedAlbumServices,
            IAlbumService albumServices,
            IUserServices userServices,
            IMapper mapper)
        {
            _sharedAlbumServices = sharedAlbumServices;
            _albumServices = albumServices;
            _userServices = userServices;
            _mapper = mapper;
        }

        // GET: api/SharedAlbum
        [HttpGet]
        public async Task<ActionResult> Get()
        {
            try
            {
                var list = await _sharedAlbumServices.GetAllAsync();
                var listDto = _mapper.Map<IEnumerable<SharedAlbumDTO>>(list);
                return Ok(listDto);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        // GET: api/SharedAlbum/user/{userId} - אלבומים ששותפו עם משתמש מסוים
        [HttpGet("user/{userId}")]
        public async Task<ActionResult> GetSharedWithUser(int userId)
        {
            try
            {
                var sharedAlbums = await _sharedAlbumServices.GetSharedAlbumsForUserAsync(userId);
                var result = new List<object>();

                foreach (var sharedAlbum in sharedAlbums)
                {
                    var album = await _albumServices.GetByIdAsync(sharedAlbum.AlbumId);
                    if (album != null)
                    {
                        var albumOwner = await _userServices.GetByIdAsync(album.UserId);
                        if (albumOwner != null)
                        {
                            result.Add(new
                            {
                                id = sharedAlbum.Id,
                                albumId = sharedAlbum.AlbumId,
                                userId = sharedAlbum.UserId,
                                permissions = sharedAlbum.Permissions,
                                createdAt = sharedAlbum.CreatedAt,
                                album = new
                                {
                                    id = album.Id,
                                    name = album.Name,
                                    description = album.Description,
                                    userId = album.UserId,
                                    user = new
                                    {
                                        id = albumOwner.Id,
                                        email = albumOwner.Email
                                    }
                                }
                            });
                        }
                    }
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        // GET: api/SharedAlbum/album/{albumId} - משתמשים ששותף אליהם אלבום מסוים
        [HttpGet("album/{albumId}")]
        public async Task<ActionResult> GetAlbumShares(int albumId)
        {
            try
            {
                Console.WriteLine($"Getting album shares for albumId: {albumId}");

                var shares = await _sharedAlbumServices.GetAlbumSharesAsync(albumId);
                Console.WriteLine($"Found {shares.Count()} shares");

                var result = new List<object>();

                foreach (var share in shares)
                {
                    Console.WriteLine($"Processing share: UserId={share.UserId}");
                    var user = await _userServices.GetByIdAsync(share.UserId);
                    if (user != null)
                    {
                        result.Add(new
                        {
                            userId = user.Id,
                            email = user.Email,
                            permissions = share.Permissions,
                            createdAt = share.CreatedAt
                        });
                    }
                    else
                    {
                        Console.WriteLine($"User not found for UserId: {share.UserId}");
                    }
                }

                Console.WriteLine($"Returning {result.Count} results");
                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetAlbumShares: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return BadRequest(new { message = $"Error: {ex.Message}" });
            }
        }

        // GET api/SharedAlbum/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult> Get(int id)
        {
            try
            {
                var sharedAlbum = await _sharedAlbumServices.GetByIdAsync(id);
                if (sharedAlbum == null)
                {
                    return NotFound();
                }
                var sharedAlbumDto = _mapper.Map<SharedAlbumDTO>(sharedAlbum);
                return Ok(sharedAlbumDto);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }


        // POST api/SharedAlbum
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] SharedAlbumPostModel sharedAlbumModel)
        {
            try
            {
                Console.WriteLine($"Received share request: AlbumId={sharedAlbumModel.AlbumId}, UserId={sharedAlbumModel.UserId}");

                var existingShare = await _sharedAlbumServices.GetExistingShareAsync(sharedAlbumModel.AlbumId, sharedAlbumModel.UserId);
                if (existingShare != null)
                {
                    return Conflict(new { message = "Album is already shared with this user" });
                }

                var sharedAlbum = new SharedAlbum
                {
                    AlbumId = sharedAlbumModel.AlbumId,
                    UserId = sharedAlbumModel.UserId,
                    Permissions = sharedAlbumModel.Permissions ?? "view",
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now
                };

                await _sharedAlbumServices.AddValueAsync(sharedAlbum);

                Console.WriteLine("Share created successfully");
                return Ok(new { message = "Album shared successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sharing album: {ex.Message}");
                return BadRequest(new { message = $"Error sharing album: {ex.Message}" });
            }
        }

        [HttpPost("share-by-email")]
        public async Task<IActionResult> ShareByEmail([FromBody] ShareAlbumByEmailDto dto)
        {
            try
            {
                var sharedAlbum = await _sharedAlbumServices.ShareAlbumByEmailAsync(
                    dto.AlbumId,
                    dto.Email,
                    dto.Permissions
                );

                return Ok(sharedAlbum);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        // PUT api/SharedAlbum/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] UpdateSharedAlbumModel sharedAlbumModel)
        {
            try
            {
                var existingSharedAlbumModel = await _sharedAlbumServices.GetByIdAsync(id);
                if (existingSharedAlbumModel != null)
                {
                    existingSharedAlbumModel.Permissions = sharedAlbumModel.Permissions;
                    existingSharedAlbumModel.UpdatedAt = DateTime.Now;
                    await _sharedAlbumServices.PutValueAsync(existingSharedAlbumModel);
                    return Ok(existingSharedAlbumModel);
                }

                return NotFound();
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        // DELETE api/SharedAlbum/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var sharedAlbum = await _sharedAlbumServices.GetByIdAsync(id);
                if (sharedAlbum == null)
                {
                    return NotFound();
                }

                await _sharedAlbumServices.DeleteAsync(sharedAlbum);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        // DELETE api/SharedAlbum/album/{albumId}/user/{userId} - הסרת שיתוף ספציפי
        [HttpDelete("album/{albumId}/user/{userId}")]
        public async Task<ActionResult> DeleteShare(int albumId, int userId)
        {
            try
            {
                var share = await _sharedAlbumServices.GetExistingShareAsync(albumId, userId);
                if (share == null)
                {
                    return NotFound();
                }

                await _sharedAlbumServices.DeleteAsync(share);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }
    }
}
