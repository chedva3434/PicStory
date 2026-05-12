using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using PicStory.CORE;
using PicStory.CORE.Repositories;
using PicStory.CORE.Services;
using PicStory.DATA;
using PicStory.DATA.Repositories;
using PicStory.SERVICE;
using System.Text;
using System.Text.Json.Serialization;
using Amazon.S3;
using Amazon.Extensions.NETCore.Setup;
using Amazon.Runtime;
using Amazon;
using Microsoft.Extensions.DependencyInjection;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());
builder.Services.AddAWSService<IAmazonS3>();


builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Description = "Bearer Authentication with JWT Token",
        Type = SecuritySchemeType.Http
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Id = "Bearer",
                    Type = ReferenceType.SecurityScheme
                }
            },
            new List<string>()
        }
    });
});
builder.Services.AddSingleton<IAmazonS3>(sp =>
{
    var configuration = sp.GetRequiredService<IConfiguration>();
    var credentials = new BasicAWSCredentials(
        configuration["AWS:AccessKey"],
        configuration["AWS:SecretKey"]
    );
    var clientConfig = new AmazonS3Config
    {
        RegionEndpoint = RegionEndpoint.GetBySystemName(configuration["AWS:Region"])
    };
    return new AmazonS3Client(credentials, clientConfig);
});

//builder.Services.AddCors(opt => opt.AddPolicy("MyPolicy", policy =>
//{
//    policy.SetIsOriginAllowed(_ => true)
//.AllowAnyMethod().AllowAnyHeader().AllowCredentials();
//}));

//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowFrontend",
//        policy =>
//        {
//            policy.WithOrigins(
//                "https://picstory1.onrender.com",
//                "https://picstory.onrender.com"
//            )
//            .AllowAnyHeader()
//            .AllowAnyMethod();
//        });
//});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .SetIsOriginAllowed(_ => true)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JWT:Issuer"],
        ValidAudience = builder.Configuration["JWT:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"]))
    };
});

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAlbumService, AlbumService>();
builder.Services.AddScoped<IPhotoServices, PhotoService>();
builder.Services.AddScoped<ISharedAlbumServices, SharedAlbumService>();
builder.Services.AddScoped<IUserServices, UserService>();

builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IAlbumRepository, AlbumRepository>();
builder.Services.AddScoped<IPhotoRepository, PhotoRepository>();
builder.Services.AddScoped<ISharedAlbumRepository, SharedAlbumRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRepositoryManager, RepositoryManager>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<DataContext>(options =>
    
options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddAutoMapper(typeof(MappingProfile));

var app = builder.Build();

//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}
app.UseSwagger();
app.UseSwaggerUI();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<DataContext>();

    SeedData.Seed(context);
}
//app.UseHttpsRedirection();

//app.UseCors("MyPolicy");
app.UseRouting();
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
