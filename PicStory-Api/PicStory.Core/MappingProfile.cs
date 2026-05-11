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
            CreateMap<SharedAlbum, SharedAlbumDTO>().ReverseMap();
            CreateMap<User, UserDTO>().ReverseMap();

            CreateMap<AlbumPostModel, Album>().ReverseMap();
            CreateMap<PhotoPostModel, Photo>().ReverseMap();
            CreateMap<SharedAlbumPostModel, SharedAlbum>().ReverseMap();
            CreateMap<UserPostModel, User>().ReverseMap();

        }

    }
}
