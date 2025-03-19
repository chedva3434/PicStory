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
    public class AlbumService : IAlbumService
    {
        private readonly IRepositoryManager _albumRepository;

        public AlbumService(IRepositoryManager albumRepository)
        {
            _albumRepository = albumRepository;
        }

        public async Task<IEnumerable<Album>> GetAllAsync()
        {
            return await Task.Run(() => _albumRepository.Albums.GetAll());
        }

        public async Task<Album> GetByIdAsync(int id)
        {
            return await Task.Run(() => _albumRepository.Albums.GetById(id));
        }

        public async Task AddValueAsync(Album album)
        {
            _albumRepository.Albums.Add(album);
            await _albumRepository.SaveAsync();
        }

        public async Task PutValueAsync(Album album)
        {
            _albumRepository.Albums.Update(album);
            await _albumRepository.SaveAsync();
        }

        public async Task DeleteAsync(Album a)
        {
            _albumRepository.Albums.Delete(a);
            await _albumRepository.SaveAsync();
        }
       
    }
}
