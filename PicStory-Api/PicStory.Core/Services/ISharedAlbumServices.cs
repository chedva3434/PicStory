using PicStory.CORE.Models;

namespace PicStory.CORE.Services
{
    public interface ISharedAlbumServices : IRepositoryService<SharedAlbum>
    {
        Task<IEnumerable<SharedAlbum>> GetSharedAlbumsForUserAsync(int userId);
        Task<IEnumerable<SharedAlbum>> GetAlbumSharesAsync(int albumId);
        Task<SharedAlbum?> GetExistingShareAsync(int albumId, int userId);
        Task<SharedAlbum> ShareAlbumByEmailAsync(int albumId, string email, string permissions);

    }
}
