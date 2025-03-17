using PicStory.CORE.Models;
using PicStory.CORE.Repositories;
using PicStory.CORE.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PicStory.SERVICE
{
    public class UserService:IUserServices
    {
        private readonly IRepositoryManager _userRepository;

        public UserService(IRepositoryManager userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await Task.Run(() => _userRepository.Users.GetAll());
        }

        public async Task<User> GetByIdAsync(int id)
        {
            return await Task.Run(() => _userRepository.Users.GetById(id));
        }

        public async Task AddValueAsync(User user)
        {
            _userRepository.Users.Add(user);
            await _userRepository.SaveAsync();
        }

        public async Task PutValueAsync(User user)
        {
            _userRepository.Users.Update(user);
            await _userRepository.SaveAsync();
        }

        public async Task DeleteAsync(User user)
        {
            _userRepository.Users.Delete(user);
            await _userRepository.SaveAsync();
        }

    }
}
