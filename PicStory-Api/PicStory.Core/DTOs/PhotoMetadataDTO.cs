using PicStory.CORE.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PicStory.CORE.DTOs
{
    public class PhotoMetadataDTO
    {
        public int Id { get; set; } 
        public int PhotoId { get; set; } 
        public string Metadata { get; set; } 
        public string FaceRecognitionData { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        //public Photo Photo { get; set; } // הקשר לתמונה

    }
}
