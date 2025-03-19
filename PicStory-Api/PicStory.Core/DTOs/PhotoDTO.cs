using PicStory.CORE.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace PicStory.CORE.DTOs
{
    public class PhotoDTO
    {
        public int Id { get; set; }
        public string FileUrl { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        public PhotoMetadataDTO photoMetadata { get; set; } // מידע על התמונה
        public List<TagDTO> Tags { get; set; } // תיוגים קשורים
    }
}
