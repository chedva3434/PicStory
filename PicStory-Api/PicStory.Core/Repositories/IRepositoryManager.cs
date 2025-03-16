using PicStory.CORE.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PicStory.CORE.Repositories
{
    public interface IRepositoryManager
    {
        public IRepository<Album> Albums { get; }
        public IRepository<PhotoMetadata> PhotoMetadatas { get; }
        public IRepository<Photo> Photos { get; }
        public IRepository<SharedAlbum> SharedAlbums { get; }
        public IRepository<Tag> Tags { get; }
        public IRepository<User> Users { get; }

        public IAlbumRepository Album { get; }
        public IPhotoMetadataRepository PhotoMetadata { get; }
        public IPhotoRepository Photo {  get; }
        public ISharedAlbumRepository SharedAlbum { get; }
        public ITagRepository Tag { get; }
        public IUserRepository User { get; }
    }
}
