using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddHttpClient();
builder.Services.AddDbContext<Routiva.Data.AppDbContext>(opt =>
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("Default") ?? "Data Source=routiva.db");
});

builder.Services
    .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(opt =>
    {
        opt.Cookie.Name = "routiva_auth";
        opt.Cookie.HttpOnly = true;
        opt.Cookie.SameSite = SameSiteMode.Lax;
        opt.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
        opt.SlidingExpiration = true;
        opt.ExpireTimeSpan = TimeSpan.FromDays(14);
    });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapStaticAssets();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<Routiva.Data.AppDbContext>();
    // Ensure schema exists / updated (demo). In production, use EF migrations.
    db.Database.EnsureCreated();

    // Lightweight SQLite column adds for dev/demo without migrations.
    // If columns already exist, SQLite will throw and we ignore.
    if (db.Database.IsSqlite())
    {
        try { db.Database.ExecuteSqlRaw("ALTER TABLE Users ADD COLUMN CarrierBaseLat REAL NULL"); } catch { }
        try { db.Database.ExecuteSqlRaw("ALTER TABLE Users ADD COLUMN CarrierBaseLng REAL NULL"); } catch { }
        try { db.Database.ExecuteSqlRaw("ALTER TABLE Users ADD COLUMN CarrierBaseLabel TEXT NULL"); } catch { }
        try { db.Database.ExecuteSqlRaw("ALTER TABLE Users ADD COLUMN CarrierDestLat REAL NULL"); } catch { }
        try { db.Database.ExecuteSqlRaw("ALTER TABLE Users ADD COLUMN CarrierDestLng REAL NULL"); } catch { }
        try { db.Database.ExecuteSqlRaw("ALTER TABLE Users ADD COLUMN CarrierDestLabel TEXT NULL"); } catch { }
        try { db.Database.ExecuteSqlRaw("ALTER TABLE Users ADD COLUMN UpdatedAtUtc TEXT NULL"); } catch { }
        try { db.Database.ExecuteSqlRaw("CREATE UNIQUE INDEX IF NOT EXISTS IX_Users_Email ON Users(Email)"); } catch { }
        try { db.Database.ExecuteSqlRaw("CREATE UNIQUE INDEX IF NOT EXISTS IX_Users_UserName ON Users(UserName)"); } catch { }
    }
}

app.MapControllers();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();


app.Run();
