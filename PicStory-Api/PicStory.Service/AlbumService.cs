using PicStory.CORE.Models;
using PicStory.CORE.Repositories;
using PicStory.CORE.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PicStory.SERVICE
{
    public class AlbumService : IRepositoryService
    {
        private readonly IRepositoryManager _albumRepository;

        public AlbumService(IRepositoryManager albumRepository)
        {
            _albumRepository = albumRepository;
        }

        public List<Album> GetAll() 
        {
            return _albumRepository.GetList();
        }
    }
}
