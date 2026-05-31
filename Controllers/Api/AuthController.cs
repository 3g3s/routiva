using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Routiva.Data;
using Routiva.Models;
using Routiva.Security;

namespace Routiva.Controllers.Api;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ILogger<AuthController> _logger;

    public AuthController(AppDbContext db, ILogger<AuthController> logger)
    {
        _db = db;
        _logger = logger;
    }

    public record RegisterRequest(
        string DisplayName,
        string Email,
        string Password,
        string? Phone,
        string? Role);

    public record LoginRequest(string Email, string Password);

    public record UserDto(int Id, string UserName, string DisplayName, string? Email, string? Phone, string Role);

    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register([FromBody] RegisterRequest req, CancellationToken ct)
    {
        var displayName = (req.DisplayName ?? "").Trim();
        var email = (req.Email ?? "").Trim().ToLowerInvariant();
        var password = req.Password ?? "";
        var role = string.IsNullOrWhiteSpace(req.Role) ? "yukveren" : req.Role.Trim().ToLowerInvariant();

        if (displayName.Length < 2) return BadRequest("Ad soyad en az 2 karakter olmalı.");
        if (email.Length < 5 || !email.Contains('@')) return BadRequest("Geçerli bir e-posta girin.");
        if (password.Length < 4) return BadRequest("Şifre en az 4 karakter olmalı.");
        if (role is not ("yukveren" or "tasiyici")) role = "yukveren";

        var exists = await _db.Users.AnyAsync(x => x.Email != null && x.Email.ToLower() == email, ct);
        if (exists) return Conflict("Bu e-posta zaten kayıtlı.");

        var u = new AppUser
        {
            UserName = email,
            DisplayName = displayName,
            Email = email,
            Phone = string.IsNullOrWhiteSpace(req.Phone) ? null : req.Phone.Trim(),
            Role = role,
            PasswordHash = PasswordHasher.Hash(password),
            CreatedAtUtc = DateTime.UtcNow,
        };

        _db.Users.Add(u);
        await _db.SaveChangesAsync(ct);

        await SignInAsync(u);

        return Ok(ToDto(u));
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login([FromBody] LoginRequest req, CancellationToken ct)
    {
        var email = (req.Email ?? "").Trim().ToLowerInvariant();
        var password = req.Password ?? "";
        if (email.Length == 0 || password.Length == 0) return BadRequest("E-posta ve şifre zorunlu.");

        var u = await _db.Users.FirstOrDefaultAsync(x => x.Email != null && x.Email.ToLower() == email, ct);
        if (u is null) return Unauthorized("Kullanıcı adı veya şifre hatalı.");

        if (!PasswordHasher.Verify(password, u.PasswordHash))
            return Unauthorized("Kullanıcı adı veya şifre hatalı.");

        await SignInAsync(u);
        return Ok(ToDto(u));
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return Ok();
    }

    [HttpGet("me")]
    public async Task<ActionResult<UserDto>> Me(CancellationToken ct)
    {
        var idRaw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(idRaw, out var id)) return Unauthorized();

        var u = await _db.Users.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (u is null) return Unauthorized();

        return Ok(ToDto(u));
    }

    private static UserDto ToDto(AppUser u) => new(u.Id, u.UserName, u.DisplayName, u.Email, u.Phone, u.Role);

    private async Task SignInAsync(AppUser u)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, u.Id.ToString()),
            new(ClaimTypes.Name, u.UserName),
            new("display_name", u.DisplayName),
            new(ClaimTypes.Role, u.Role),
        };

        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        var principal = new ClaimsPrincipal(identity);

        await HttpContext.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            principal,
            new AuthenticationProperties
            {
                IsPersistent = true,
                ExpiresUtc = DateTimeOffset.UtcNow.AddDays(14),
            });
    }
}

