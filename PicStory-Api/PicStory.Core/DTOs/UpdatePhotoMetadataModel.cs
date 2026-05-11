using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PicStory.CORE.DTOs
{
    public class UpdatePhotoMetadataModel
    {
        public string Metadata { get; set; }
        public string FaceRecognitionData { get; set; }
    }
}
