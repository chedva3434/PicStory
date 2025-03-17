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
        public IRepository<PhotoMetadata> PhotoMetadatas { get; }
        public IRepository<Photo> Photos { get; }
        public IRepository<SharedAlbum> SharedAlbums { get; }
        public IRepository<Tag> Tags { get; }
        public IRepository<User> Users { get; }

        public IAlbumRepository Album { get; }
        public IPhotoMetadataRepository PhotoMetadata { get; }
        public IPhotoRepository Photo { get; }
        public ISharedAlbumRepository SharedAlbum { get; }
        public ITagRepository Tag { get; }
        public IUserRepository User { get; }

        public RepositoryManager(DataContext context, IRepository<Album> albums, IRepository<PhotoMetadata> photoMetadatas, 
            IRepository<Photo> photos, IRepository<SharedAlbum> sharedAlbums, IRepository<Tag> tags, 
            IRepository<User> users, IAlbumRepository album, IPhotoMetadataRepository photoMetadata, 
            IPhotoRepository photo, ISharedAlbumRepository sharedAlbum, ITagRepository tag, IUserRepository user)
        {
            _context = context;
            Albums = albums;
            PhotoMetadatas = photoMetadatas;
            Photos = photos;
            SharedAlbums = sharedAlbums;
            Tags = tags;
            Users = users;
            Album = album;
            PhotoMetadata = photoMetadata;
            Photo = photo;
            SharedAlbum = sharedAlbum;
            Tag = tag;
            User = user;
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
