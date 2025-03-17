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
    public class SharedAlbumService:ISharedAlbumServices
    {
        private readonly IRepositoryManager _sharedAlbumRepository;

        public SharedAlbumService(IRepositoryManager sharedAlbumRepository)
        {
            _sharedAlbumRepository = sharedAlbumRepository;
        }

        public async Task<IEnumerable<SharedAlbum>> GetAllAsync()
        {
            return await Task.Run(() => _sharedAlbumRepository.SharedAlbums.GetAll());
        }
        public async Task<SharedAlbum> GetByIdAsync(int id)
        {
            return await Task.Run(() => _sharedAlbumRepository.SharedAlbums.GetById(id));
        }
        public async Task AddValueAsync(SharedAlbum sharedAlbum)
        {
            _sharedAlbumRepository.SharedAlbums.Add(sharedAlbum);
            await _sharedAlbumRepository.SaveAsync();
        }
        public async Task PutValueAsync(SharedAlbum sharedAlbum)
        {
            _sharedAlbumRepository.SharedAlbums.Update(sharedAlbum);
            await _sharedAlbumRepository.SaveAsync();
        }
        public async Task DeleteAsync(SharedAlbum sharedAlbum)
        {
            _sharedAlbumRepository.SharedAlbums.Delete(sharedAlbum);
            await _sharedAlbumRepository.SaveAsync();
        }

    }
}
