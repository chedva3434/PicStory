using Microsoft.EntityFrameworkCore;
using PicStory.CORE.Models;
using PicStory.CORE.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PicStory.DATA.Repositories
{
    public class AuthRepository:IAuthRepository
    {
        private readonly DataContext _context;

        public AuthRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<User?> GetUserByNameAsync(string name)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Name == name );
        }
        public async Task<User> CreateUserAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }
    }
}
