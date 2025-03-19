using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PicStory.CORE.Models
{
    public class SharedAlbum
    {
        public int Id { get; set; }
        public int AlbumId { get; set; }
        public int UserId { get; set; }
        public string Permissions { get; set; }  // לדוגמה: "view", "edit"
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        // קשרים
        public Album Album { get; set; }
        public User User { get; set; }
    }
}
