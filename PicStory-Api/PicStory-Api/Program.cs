using Microsoft.EntityFrameworkCore;
using PicStory.CORE;
using PicStory.CORE.Repositories;
using PicStory.CORE.Services;
using PicStory.DATA;
using PicStory.DATA.Repositories;
using PicStory.SERVICE;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
});

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});


builder.Services.AddScoped<IAlbumService, AlbumService>();
builder.Services.AddScoped<IPhotoServices, PhotoService>();
builder.Services.AddScoped<IPhotoMetadataServices, PhotoMetadataService>();
builder.Services.AddScoped<ISharedAlbumServices, SharedAlbumService>();
builder.Services.AddScoped<ITagServices, TagService>();
builder.Services.AddScoped<IUserServices, UserService>();

builder.Services.AddScoped<IAlbumRepository, AlbumRepository>();
builder.Services.AddScoped<IPhotoMetadataRepository,PhotoMetadataRepository>();
builder.Services.AddScoped<IPhotoRepository,PhotoRepository>();
builder.Services.AddScoped<ISharedAlbumRepository, SharedAlbumRepository>();
builder.Services.AddScoped<ITagRepository, TagRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRepositoryManager, RepositoryManager>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<DataContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

//builder.Services.AddSingleton<DataContext>();
builder.Services.AddAutoMapper(typeof(MappingProfile));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
