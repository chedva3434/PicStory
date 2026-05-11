namespace PicStory_Api.Models
{
    public class PhotoPostModel
    {
        public int UserId { get; set; }
        public int AlbumId { get; set; }
        public string FileUrl { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
       
    }
}
