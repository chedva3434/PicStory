using PicStory.CORE.DTOs;
using PicStory_Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PicStory.CORE.Services
{
    public interface IAuthService
    {
        Task<string> AuthenticateUserAsync(string name, string password);
        Task<string> RegisterUserAsync(UserPostModel UserDto);
    }
}
