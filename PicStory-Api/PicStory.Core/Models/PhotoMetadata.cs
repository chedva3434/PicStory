using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PicStory.CORE.Models
{
    public class PhotoMetadata
    {
        public int Id { get; set; } // מזהה ייחודי
        public int PhotoId { get; set; } // מזהה התמונה אליה שייך המידע
        public string Metadata { get; set; } // המידע EXIF, יכול להיות JSON או פורמט אחר
        public string FaceRecognitionData { get; set; } // מידע על זיהוי פנים אם יש
        public DateTime CreatedAt { get; set; } // תאריך יצירת המידע
        public DateTime UpdatedAt { get; set; } // תאריך עדכון המידע

        // קשרים
        public Photo Photo { get; set; } // הקשר לתמונה
    }
}
