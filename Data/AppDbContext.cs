using Microsoft.EntityFrameworkCore;
using Routiva.Models;

namespace Routiva.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<AppUser> Users => Set<AppUser>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<AppUser>(b =>
        {
            b.HasIndex(x => x.UserName).IsUnique();
            b.HasIndex(x => x.Email).IsUnique();
        });
    }
}

