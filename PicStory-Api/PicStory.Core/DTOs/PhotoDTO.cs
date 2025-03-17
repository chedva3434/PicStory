﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PicStory.CORE.DTOs
{
    public class PhotoDTO
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int AlbumId { get; set; }
        public string FileUrl { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime UploadDate { get; set; }
    }
}
