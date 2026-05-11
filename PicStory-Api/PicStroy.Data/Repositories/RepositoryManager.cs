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
    public class RepositoryManager:IRepositoryManager
    {
        private readonly DataContext _context;
        private IAlbumRepository _albumRepository;

        public IRepository<Album> Albums { get; }
        public IRepository<Photo> Photos { get; }
        public IRepository<SharedAlbum> SharedAlbums { get; }
        public IRepository<User> Users { get; }

        public IAlbumRepository Album { get; }
        public IPhotoRepository Photo { get; }
        public ISharedAlbumRepository SharedAlbum { get; }
        public IUserRepository User { get; }

        public RepositoryManager(DataContext context, IRepository<Album> albums, 
            IRepository<Photo> photos, IRepository<SharedAlbum> sharedAlbums,
            IRepository<User> users, IAlbumRepository album, 
            IPhotoRepository photo, ISharedAlbumRepository sharedAlbum,IUserRepository user)
        {
            _context = context;
            Albums = albums;
            Photos = photos;
            SharedAlbums = sharedAlbums;
            Users = users;
            Album = album;
            Photo = photo;
            SharedAlbum = sharedAlbum;
            User = user;
        }

        public async Task<IEnumerable<Album>> GetAlbumsByUserIdAsync(int userId)
        {
            var albums = await _context.Albums
                .Where(a => a.UserId == userId)
                .ToListAsync();

            return albums; 
        }


        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
