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
    public class PhotoMetadataService:IPhotoMetadataServices
    {
        private readonly IRepositoryManager _photoMetadataRepository;

        public PhotoMetadataService(IRepositoryManager photoMetadataRepository)
        {
            _photoMetadataRepository = photoMetadataRepository;
        }

        public async Task<IEnumerable<PhotoMetadata>> GetAllAsync()
        {
            return await Task.Run(() => _photoMetadataRepository.PhotoMetadatas.GetAll());
        }
        public async Task<PhotoMetadata> GetByIdAsync(int id)
        {
            return await Task.Run(() => _photoMetadataRepository.PhotoMetadatas.GetById(id));
        }
        public async Task AddValueAsync(PhotoMetadata photoMetadata)
        {
            _photoMetadataRepository.PhotoMetadatas.Add(photoMetadata);
            await _photoMetadataRepository.SaveAsync();
        }
        public async Task PutValueAsync(PhotoMetadata photoMetadata)
        {
            _photoMetadataRepository.PhotoMetadatas.Update(photoMetadata);
            await _photoMetadataRepository.SaveAsync();
        }
        public async Task DeleteAsync(PhotoMetadata photoMetadata)
        {
            _photoMetadataRepository.PhotoMetadatas.Delete(photoMetadata);
            await _photoMetadataRepository.SaveAsync();
        }

    }
}
