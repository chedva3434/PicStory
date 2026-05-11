using PicStory.CORE.Models;
using PicStory.DATA;
using System;

public class SeedData
{
    public static void Seed(DataContext context)
    {
        if (!context.Users.Any(u => u.Role == "Admin"))
        {
            var password = "admin";

            var hashedPassword = Convert.ToBase64String(
                System.Security.Cryptography.SHA256.Create()
                .ComputeHash(System.Text.Encoding.UTF8.GetBytes(password))
            );

            context.Users.Add(new User
            {
                Name = "Admin",             
                Email = "admin@gmail.com",
                PasswordHash = hashedPassword,
                Role = "Admin"
            });

            context.SaveChanges();
        }
    }
}