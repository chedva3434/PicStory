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
            // במקום להשתמש ב- GetAll, עכשיו אתה משתמש ב- GetAllWithIncludes
            var albums = _albumRepository.Albums.GetAllWithIncludes(
                a => a.User, // קשר עם המשתמש
                a => a.Photos, // קשר עם התמונות
                a => a.SharedAlbums // קשר עם האלבומים המשותפים
            );

            return await Task.FromResult(albums); // מחזיר את התוצאה
        }
        public async Task<Album> GetByIdAsync(int id)
        {
            return await Task.Run(() => _albumRepository.Albums.GetById(id));
        }
        public async Task AddValueAsync(Album advertiser)
        {
            _albumRepository.Albums.Add(advertiser);
            await _albumRepository.SaveAsync();
        }
        public async Task PutValueAsync(Album advertiser)
        {
            _albumRepository.Albums.Update(advertiser);
            await _albumRepository.SaveAsync();
        }
        public async Task DeleteAsync(Album a)
        {
            _albumRepository.Albums.Delete(a);
            await _albumRepository.SaveAsync();
        }
       
    }
}
