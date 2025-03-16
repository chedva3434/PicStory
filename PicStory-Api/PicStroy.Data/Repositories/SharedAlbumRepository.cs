using PicStory.CORE.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PicStory.DATA.Repositories
{
    public class SharedAlbumRepository : Repository<SharedAlbumRepository>, ISharedAlbumRepository
    {
        public SharedAlbumRepository(DataContext context) : base(context)
        {

        }
    }
}
