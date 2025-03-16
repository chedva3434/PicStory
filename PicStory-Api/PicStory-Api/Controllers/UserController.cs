using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PicStory.CORE.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace PicStory_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private static List<User> users = new List<User>();
        [HttpGet]
        public IEnumerable<User> Get()
        {
            return users;
        }

        // GET api/<UserController>/5
        [HttpGet("{id}")]
        public ActionResult Get(int id)
        {
            var user = users.Find(u=>u.Id==id);
            if (user == null) 
            {
                return NotFound();
            }
            return Ok(user);
        }

        // POST api/<UserController>
        [HttpPost]
        public void Post([FromBody] User newUser)
        {
            users.Add(new User { Id = newUser.Id,Name=newUser.Name,Email=newUser.Email,PasswordHash=newUser.PasswordHash});

        }

        // PUT api/<UserController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {

        }

        // DELETE api/<UserController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            var user = users.Find(u => u.Id == id);
            if (user == null)
            {
                 NotFound();
            }
            users.Remove(user);
        }
    }
}
