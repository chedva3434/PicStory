using PicStory.CORE.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PicStory.DATA.Repositories
{
    public class PhotoMetadataRepository : Repository<PhotoMetadataRepository>, IPhotoMetadataRepository
    {
        public PhotoMetadataRepository(DataContext context) : base(context)
        {

        }


    }
}
