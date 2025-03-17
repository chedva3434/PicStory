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
    public class TagService:ITagServices
    {
        private readonly IRepositoryManager _tagRepository;

        public TagService(IRepositoryManager tagRepository)
        {
            _tagRepository = tagRepository;
        }

        public async Task<IEnumerable<Tag>> GetAllAsync()
        {
            return await Task.Run(() => _tagRepository.Tags.GetAll());
        }
        public async Task<Tag> GetByIdAsync(int id)
        {
            return await Task.Run(() => _tagRepository.Tags.GetById(id));
        }
        public async Task AddValueAsync(Tag tag)
        {
            _tagRepository.Tags.Add(tag);
            await _tagRepository.SaveAsync();
        }
        public async Task PutValueAsync(Tag tag)
        {
            _tagRepository.Tags.Update(tag);
            await _tagRepository.SaveAsync();
        }
        public async Task DeleteAsync(Tag tag)
        {
            _tagRepository.Tags.Delete(tag);
            await _tagRepository.SaveAsync();
        }

    }
}
