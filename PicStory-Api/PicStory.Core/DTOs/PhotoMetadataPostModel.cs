namespace PicStory_Api.Models
{
    public class PhotoMetadataPostModel
    {
        public int PhotoId { get; set; } 
        public string Metadata { get; set; } 
        public string FaceRecognitionData { get; set; } 

    }
}
