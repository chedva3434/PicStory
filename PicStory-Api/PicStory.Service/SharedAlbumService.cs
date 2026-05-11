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
    public class SharedAlbumService : ISharedAlbumServices
    {
        private readonly IRepositoryManager _repositoryManager;

        public SharedAlbumService(IRepositoryManager repositoryManager)
        {
            _repositoryManager = repositoryManager;
        }

        public async Task<IEnumerable<SharedAlbum>> GetAllAsync()
        {
            return await Task.Run(() => _repositoryManager.SharedAlbums.GetAll());
        }

        public async Task<SharedAlbum> GetByIdAsync(int id)
        {
            return await Task.Run(() => _repositoryManager.SharedAlbums.GetById(id));
        }

        public async Task AddValueAsync(SharedAlbum sharedAlbum)
        {
            _repositoryManager.SharedAlbums.Add(sharedAlbum);
            await _repositoryManager.SaveAsync();
        }

        public async Task PutValueAsync(SharedAlbum sharedAlbum)
        {
            _repositoryManager.SharedAlbums.Update(sharedAlbum);
            await _repositoryManager.SaveAsync();
        }

        public async Task DeleteAsync(SharedAlbum sharedAlbum)
        {
            _repositoryManager.SharedAlbums.Delete(sharedAlbum);
            await _repositoryManager.SaveAsync();
        }

        // פונקציות חדשות לשיתוף אלבומים
        public async Task<IEnumerable<SharedAlbum>> GetSharedAlbumsForUserAsync(int userId)
        {
            var allAlbums = await _repositoryManager.SharedAlbums.GetAllAsync();
            return allAlbums
                .Where(sa => sa.UserId == userId)
                .OrderByDescending(sa => sa.CreatedAt);
        }

        public async Task<IEnumerable<SharedAlbum>> GetAlbumSharesAsync(int albumId)
        {
            var allAlbums = await _repositoryManager.SharedAlbums.GetAllAsync();
            return allAlbums
                .Where(sa => sa.AlbumId == albumId)
                .OrderByDescending(sa => sa.CreatedAt);
        }

        public async Task<SharedAlbum?> GetExistingShareAsync(int albumId, int userId)
        {
            var allAlbums = await _repositoryManager.SharedAlbums.GetAllAsync();
            return allAlbums
                .FirstOrDefault(sa => sa.AlbumId == albumId && sa.UserId == userId);
        }

        public async Task<SharedAlbum> ShareAlbumByEmailAsync(int albumId, string email, string permissions)
        {
            // 1. חיפוש משתמש לפי אימייל
            var allUsers = await _repositoryManager.Users.GetAllAsync(); // אם יש לך Repository של Users
            var user = allUsers.FirstOrDefault(u => u.Email == email);
            if (user == null)
                throw new Exception("User with this email does not exist");

            // 2. בדיקה אם השיתוף כבר קיים
            var existing = await GetExistingShareAsync(albumId, user.Id);
            if (existing != null)
                throw new Exception("Album already shared with this user");

            // 3. יצירת SharedAlbum
            var sharedAlbum = new SharedAlbum
            {
                AlbumId = albumId,
                UserId = user.Id,
                Permissions = permissions,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            // 4. הוספה ושמירה
            _repositoryManager.SharedAlbums.Add(sharedAlbum);  // משתמשים ב-Add הסינכרוני
            await _repositoryManager.SaveAsync();

            return sharedAlbum;
        }


    }

}

