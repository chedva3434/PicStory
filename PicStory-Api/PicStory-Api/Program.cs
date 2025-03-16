using Microsoft.EntityFrameworkCore;
using PicStory.CORE.Repositories;
using PicStory.DATA;
using PicStory.DATA.Repositories;
using PicStory.SERVICE;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<IAlbumRepository, AlbumRepository>();
builder.Services.AddScoped<IPhotoMetadataRepository,PhotoMetadataRepository>();
builder.Services.AddScoped<IPhotoRepository,PhotoRepository>();
builder.Services.AddScoped<ISharedAlbumRepository, SharedAlbumRepository>();
builder.Services.AddScoped<ITagRepository, TagRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddDbContext<DataContext>(options =>
    options.UseNpgsql("Host=127.0.0.1;Database=PicStoryDb;Username=postgres;Password=chedva3434"));

//builder.Services.AddSingleton<DataContext>();

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
