using Microsoft.EntityFrameworkCore;
using PicStory.CORE.Models;
using PicStory.CORE.Repositories;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PicStory.DATA.Repositories
{
    public class SharedAlbumRepository : Repository<SharedAlbum>, ISharedAlbumRepository
    {
        private readonly DataContext _context;

        public SharedAlbumRepository(DataContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<SharedAlbum>> GetAllAsync()
        {
            return await _context.SharedAlbums
                .Include(sa => sa.User)         // אם יש קשרים שתלויים בזהות המשתמש
                .Include(sa => sa.Album)        // אם יש קשר לאלבום
                .ToListAsync();
        }

        // פה אפשר להוסיף עוד מתודות מיוחדות ל-SharedAlbum
    }
}
