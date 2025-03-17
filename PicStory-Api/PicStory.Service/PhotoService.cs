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
    public class PhotoService:IPhotoServices
    {
        private readonly IRepositoryManager _photoRepository;

        public PhotoService(IRepositoryManager photoRepository)
        {
            _photoRepository = photoRepository;
        }

        public async Task<IEnumerable<Photo>> GetAllAsync()
        {
            return await Task.Run(() => _photoRepository.Photos.GetAll());
        }
        public async Task<Photo> GetByIdAsync(int id)
        {
            return await Task.Run(() => _photoRepository.Photos.GetById(id));
        }
        public async Task AddValueAsync(Photo photo)
        {
            _photoRepository.Photos.Add(photo);
            await _photoRepository.SaveAsync();
        }
        public async Task PutValueAsync(Photo photo)
        {
            _photoRepository.Photos.Update(photo);
            await _photoRepository.SaveAsync();
        }
        public async Task DeleteAsync(Photo photo)
        {
            _photoRepository.Photos.Delete(photo);
            await _photoRepository.SaveAsync();
        }

    }
}
