using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace PicStory.CORE.Models
{
    public class User
    {
        public int Id { get; set; }    
        public string Name { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        public List<Photo> Photos { get; set; } 
        public List<Album> Albums { get; set; } 
        public List<SharedAlbum> SharedAlbums { get; set; }
    }
}

