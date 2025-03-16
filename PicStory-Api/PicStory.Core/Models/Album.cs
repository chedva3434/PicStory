using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PicStory.CORE.Models
{
    public class Album
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }



        // קשר עם משתמשים לשיתוף
        public User User { get; set; }
        public List<Photo> Photos { get; set; }
        public List<SharedAlbum> SharedAlbums { get; set; }
    }
}

