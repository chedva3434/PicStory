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
            // קשר בין Album ל-User (אלבום שייך למשתמש)
            modelBuilder.Entity<Album>()
                .HasOne(a => a.User)
                .WithMany(u => u.Folders)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade); // מחיקה Cascade

            // קשר בין Photo ל-User (תמונה שייכת למשתמש)
            modelBuilder.Entity<Photo>()
                .HasOne(p => p.User)
                .WithMany(u => u.Images)
                .HasForeignKey(p => p.UserId);

            // קשר בין Photo ל-Album (תמונה שייכת לאלבום)
            modelBuilder.Entity<Photo>()
                .HasOne(p => p.Album)
                .WithMany(a => a.Photos)
                .HasForeignKey(p => p.AlbumId);

            // קשר בין SharedAlbum ל-Album ול-User (שיתוף אלבומים)
            modelBuilder.Entity<SharedAlbum>()
                .HasOne(sa => sa.Album)
                .WithMany(a => a.SharedAlbums)
                .HasForeignKey(sa => sa.AlbumId);

            modelBuilder.Entity<SharedAlbum>()
                .HasOne(sa => sa.User)
                .WithMany(u => u.SharedAlbums)
                .HasForeignKey(sa => sa.UserId);
        }
    }
}
