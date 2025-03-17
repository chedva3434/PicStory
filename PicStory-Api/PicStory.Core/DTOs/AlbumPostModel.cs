namespace PicStory_Api.Models
{
    public class AlbumPostModel
    {
        public required int UserId { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required DateTime CreatedAt { get; set; }
    }
}
