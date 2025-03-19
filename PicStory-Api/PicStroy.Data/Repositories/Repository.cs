using Microsoft.EntityFrameworkCore;
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
        private readonly DataContext _context;
        private readonly DbSet<T> _dbSet;

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
            .Include(a => a.User) // טוען את המשתמש של האלבום
            .Include(a => a.SharedAlbums) // טוען את האלבומים המשותפים
            .Include(a => a.Photos) // טוען את התמונות של האלבום
            .ToListAsync();

            // await _context.Photos.Include(a => a.User).ToListAsync();
            // await _context.Photos.Include(a => a.Tags).ToListAsync();
            // await _context.Photos.Include(a => a.PhotoMetadata).ToListAsync();

            // var users = await _context.Users
            //.Include(u => u.Albums)  // טוען את האלבומים של המשתמש
            //.Include(u => u.Photos)  // טוען את התמונות של המשתמש
            //.Include(u => u.SharedAlbums) // טוען את האלבומים המשותפים
            //.ToListAsync();

            var photos = await _context.Photos
            .Include(p => p.User) // מביא את המשתמש שהעלה את התמונה
            .Include(p => p.Album) // מביא את האלבום שבו התמונה נמצאת
            .Include(p => p.Tags) // מביא את התגיות של התמונה
            .Include(p => p.PhotoMetadata) // מביא את המידע הנוסף (EXIF, זיהוי פנים וכו')
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
    }
}
