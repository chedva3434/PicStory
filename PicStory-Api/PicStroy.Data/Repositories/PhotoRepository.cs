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
    public class PhotoRepository : Repository<Photo>, IPhotoRepository
    {
        private readonly DataContext _context;

        public PhotoRepository(DataContext context) : base(context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Photo>> GetPhotosByAlbumIdAsync(int albumId)
        {
            return await _context.Photos
                .Where(p => p.AlbumId == albumId)
                .Include(p => p.User)
                .ToListAsync();
        }
    }



}

