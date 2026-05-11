using Amazon.S3;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;


namespace PicStory_Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadFileController : ControllerBase
    {
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName;

        public UploadFileController(IAmazonS3 s3Client, IConfiguration configuration)
        {
            _s3Client = s3Client;
            _bucketName = configuration["AWS:BucketName"]!;
        }


        [HttpGet("presigned-url")]
        public IActionResult GetPresignedUploadUrl([FromQuery] string fileName)
        {
            try
            {
                string contentType = GetContentType(Path.GetExtension(fileName));

                var request = new GetPreSignedUrlRequest
                {
                    BucketName = _bucketName,
                    Key = fileName,
                    Verb = HttpVerb.PUT,
                    Expires = DateTime.UtcNow.AddMinutes(10),
                    ContentType = contentType
                };

                var presignedUrl = _s3Client.GetPreSignedURL(request);
                return Ok(new { url = presignedUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "שגיאה ביצירת Presigned URL", error = ex.Message });
            }
        }


        [HttpGet("view-url")]
        public IActionResult GetPresignedViewUrl([FromQuery] string fileName)
        {
            try
            {
                string contentType = GetContentType(Path.GetExtension(fileName));

                var request = new GetPreSignedUrlRequest
                {
                    BucketName = _bucketName,
                    Key = fileName,
                    Verb = HttpVerb.GET,
                    Expires = DateTime.UtcNow.AddMinutes(5),
                    ResponseHeaderOverrides = new ResponseHeaderOverrides
                    {
                        ContentType = contentType
                    }
                };

                var presignedUrl = _s3Client.GetPreSignedURL(request);
                return Ok(new { url = presignedUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "שגיאה ביצירת כתובת צפייה", error = ex.Message });
            }
        }

        [HttpPost("collage")]
        public async Task<IActionResult> CreateAiCollage([FromBody] List<string> imageUrls)
        {
            try
            {
                if (imageUrls == null || !imageUrls.Any())
                    return BadRequest("לא נשלחו URLs");

               
                int width = 800, height = 600;
                using var collage = new Image<Rgba32>(width, height);
                int columns = (int)Math.Ceiling(Math.Sqrt(imageUrls.Count));
                int rows = (int)Math.Ceiling(imageUrls.Count / (double)columns);
                int cellWidth = width / columns;
                int cellHeight = height / rows;

                for (int i = 0; i < imageUrls.Count; i++)
                {
                    using var http = new HttpClient();
                    var bytes = await http.GetByteArrayAsync(imageUrls[i]);
                    using var img = Image.Load<Rgba32>(bytes);
                    img.Mutate(x => x.Resize(cellWidth, cellHeight));
                    collage.Mutate(x => x.DrawImage(img, new Point((i % columns) * cellWidth, (i / columns) * cellHeight), 1f));
                }

                using var ms = new MemoryStream();
                collage.SaveAsPng(ms);
                ms.Position = 0;

                return File(ms.ToArray(), "image/png");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "שגיאה ביצירת AI Collage", error = ex.Message });
            }
        }


        /// <summary>
        /// פונקציה פשוטה להמרת סיומות לתוכן MIME
        /// </summary>
        private static string GetContentType(string extension)
        {
            return extension.ToLower() switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                ".webp" => "image/webp",     
                ".pdf" => "application/pdf",
                ".txt" => "text/plain",
                ".doc" or ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                _ => "application/octet-stream"
            };
        }
    }
}
