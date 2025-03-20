using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using PicStory.CORE.DTOs;
using PicStory.CORE.Models;
using PicStory.CORE.Repositories;
using PicStory.CORE.Services;
using PicStory_Api.Models;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using BCrypt.Net;

namespace PicStory.SERVICE
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly IConfiguration _configuration;

        public AuthService(IAuthRepository authRepository, IConfiguration configuration)
        {
            _authRepository = authRepository;
            _configuration = configuration;
        }


        public async Task<string> AuthenticateUserAsync(string name, string password)
        {
            // חיפוש המשתמש על פי שם המשתמש
            var user = await _authRepository.GetUserByNameAsync(name);
            if (user == null)
            {
                return null; // אם לא נמצא משתמש עם השם הזה
            }

            // Hashing הסיסמה שהוזנה והשוואתה עם הסיסמה המוחזרת מהמסד נתונים
            string hashedPassword = HashPassword(password);
            if (hashedPassword != user.PasswordHash)
            {
                return null; // אם הסיסמה לא תואמת, מחזיר null
            }

            // יצירת Claims עבור ה-JWT Token
            var claims = new List<Claim>
    {
        new Claim(ClaimTypes.Name, user.Name),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Role, user.Role)
    };

            // יצירת טוקן JWT
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Key"]));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var tokenOptions = new JwtSecurityToken(
                issuer: _configuration["JWT:Issuer"],
                audience: _configuration["JWT:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: signinCredentials
            );

            // מחזיר את הטוקן שנוצר
            return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
        }


        public async Task<string> RegisterUserAsync(UserPostModel registerUserDto)
        {
            // בדיקה אם המשתמש כבר קיים
            var existingUser = await _authRepository.GetUserByNameAsync(registerUserDto.Name);
            if (existingUser != null)
            {
                throw new Exception("Email already in use");
            }

            // הצפנת הסיסמה
            string hashedPassword = HashPassword(registerUserDto.PasswordHash);

            // יצירת אובייקט משתמש חדש
            var newUser = new User
            {
                Email = registerUserDto.Email,
                PasswordHash = hashedPassword,
                Name = registerUserDto.Name,
                Role = "User",
                CreatedAt = DateTime.UtcNow
            };

            await _authRepository.CreateUserAsync(newUser);

            // יצירת טוקן והחזרתו
            return GenerateJwtToken(newUser);
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hashBytes = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hashBytes);
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Key"]));
            var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

            var tokenOptions = new JwtSecurityToken(
                issuer: _configuration["JWT:Issuer"],
                audience: _configuration["JWT:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: signinCredentials
            );

            return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
        }
    }
}
