using Microsoft.EntityFrameworkCore;
using PicStory.CORE.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text;
using System.Threading.Tasks;


namespace PicStory.DATA
{
    public class DataContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Album> Albums { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<PhotoMetadata> PhotoMetadata { get; set; }
        public DbSet<SharedAlbum> SharedAlbums { get; set; }
        public DbSet<Tag> Tags { get; set; }

        public DataContext(DbContextOptions<DataContext> options)
        : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            
        }
    }
}
