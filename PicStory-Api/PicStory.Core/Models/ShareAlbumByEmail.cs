using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PicStory.CORE.Models
{
    public class ShareAlbumByEmail
    {
        public int AlbumId { get; set; }
        public string Email { get; set; }
        public string Permissions { get; set; } 
    }
}
