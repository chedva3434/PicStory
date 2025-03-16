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
        public AlbumRepository(DataContext context) : base(context)
        {
        }

        
    }
}
