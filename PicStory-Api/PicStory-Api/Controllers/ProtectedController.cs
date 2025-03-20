using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace PicStory_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProtectedController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetSecret()
        {
            return Ok("רק משתמשים מחוברים יכולים לראות את זה!");
        }
    }
}
