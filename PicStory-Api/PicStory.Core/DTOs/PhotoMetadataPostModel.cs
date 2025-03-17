namespace PicStory_Api.Models
{
    public class PhotoMetadataPostModel
    {
        public int PhotoId { get; set; } 
        public string Metadata { get; set; } 
        public string FaceRecognitionData { get; set; } 
        public DateTime CreatedAt { get; set; } 
        public DateTime UpdatedAt { get; set; }
    }
}
