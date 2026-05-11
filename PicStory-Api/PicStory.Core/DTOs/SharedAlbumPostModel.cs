namespace PicStory_Api.Models
{
    public class SharedAlbumPostModel
    {
        public int AlbumId { get; set; }
        public int UserId { get; set; }
        public string Permissions { get; set; }
    }
}
