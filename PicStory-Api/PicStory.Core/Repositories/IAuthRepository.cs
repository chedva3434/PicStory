using PicStory.CORE.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PicStory.CORE.Repositories
{
    public interface IAuthRepository
    {
        Task<User?> GetUserByNameAsync(string name);
        Task<User> CreateUserAsync(User user);
    }
}
