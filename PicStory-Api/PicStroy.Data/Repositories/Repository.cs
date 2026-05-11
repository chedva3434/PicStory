using Microsoft.EntityFrameworkCore;
using PicStory.CORE.Models;
using PicStory.CORE.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace PicStory.DATA.Repositories
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected readonly DataContext _context;
        protected readonly DbSet<T> _dbSet;

        public Repository(DataContext context)
        {
            _context = context;
            _dbSet = _context.Set<T>();
        }


        public T Add(T entity)
        {
            _dbSet.Add(entity);
            _context.SaveChanges();
            return entity;
        }

        public void Delete(T entity)
        {
            _dbSet.Remove(entity);
            _context.SaveChanges();
        }

        public async Task<IEnumerable<T>> GetAll()
        {
            var albums = await _context.Albums
            .Include(a => a.User) 
            .Include(a => a.SharedAlbums) 
            .Include(a => a.Photos) 
            .ToListAsync();

            
            var photos = await _context.Photos
            .Include(p => p.User) 
            .Include(p => p.Album) 
            .ToListAsync();


            return _dbSet.ToList();
        }

        public T? GetById(int id)
        {
            return _dbSet.Find(id);
        }


        public T Update(T entity)
        {
            _dbSet.Update(entity);
            _context.SaveChanges();
            return entity;
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

    }
}
