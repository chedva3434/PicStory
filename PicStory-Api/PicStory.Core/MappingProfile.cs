using AutoMapper;
using PicStory.CORE.DTOs;
using PicStory.CORE.Models;
using PicStory_Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PicStory.CORE
{
    public class MappingProfile:Profile
    {
        public MappingProfile()
        {
            CreateMap<Album, AlbumDTO>().ReverseMap();
            CreateMap<Photo, PhotoDTO>().ReverseMap();
            CreateMap<PhotoMetadata, PhotoMetadataDTO>().ReverseMap();
            CreateMap<SharedAlbum, SharedAlbumDTO>().ReverseMap();
            CreateMap<Tag, TagDTO>().ReverseMap();
            CreateMap<User, UserDTO>().ReverseMap();

            CreateMap<AlbumPostModel, Album>();
            CreateMap<PhotoPostModel, Photo>();
            CreateMap<PhotoMetadataPostModel, PhotoMetadata>();
            CreateMap<SharedAlbumPostModel, SharedAlbum>();
            CreateMap<TagPostModel, Tag>();
            CreateMap<UserPostModel, User>();
        }

    }
}
