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
    public class AlbumRepository :Repository<Album>, IAlbumRepository
    {
        private readonly DataContext _context;

        public AlbumRepository(DataContext context):base(context)
        {
            _context = context;
        }

        public IEnumerable<Album> GetAllWithRelations()
        {
            return _context.Albums
                .Include(a => a.Photos) // טוען את התמונות
                .Include(a => a.SharedAlbums) // טוען את השיתופים
                .ToList();
        }
    }
}
