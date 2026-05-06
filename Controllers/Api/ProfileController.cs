using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Routiva.Data;

namespace Routiva.Controllers.Api;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly AppDbContext _db;

    public ProfileController(AppDbContext db) => _db = db;

    public record CarrierLocationDto(double Lat, double Lng, string? Label);

    public record UserRouteDto(CarrierLocationDto? Origin, CarrierLocationDto? Destination);

    [HttpGet("location")]
    public async Task<ActionResult<CarrierLocationDto?>> GetLocation(CancellationToken ct)
    {
        var idRaw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(idRaw, out var id)) return Unauthorized();

        var u = await _db.Users.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (u is null) return Unauthorized();

        if (u.CarrierBaseLat is null || u.CarrierBaseLng is null)
            return Ok(null);

        return Ok(new CarrierLocationDto(u.CarrierBaseLat.Value, u.CarrierBaseLng.Value, u.CarrierBaseLabel));
    }

    [HttpPut("location")]
    public async Task<ActionResult<CarrierLocationDto>> SetLocation([FromBody] CarrierLocationDto body, CancellationToken ct)
    {
        var idRaw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(idRaw, out var id)) return Unauthorized();

        var u = await _db.Users.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (u is null) return Unauthorized();

        // basit doğrulama
        if (body.Lat is < -90 or > 90) return BadRequest("Lat geçersiz.");
        if (body.Lng is < -180 or > 180) return BadRequest("Lng geçersiz.");

        u.CarrierBaseLat = body.Lat;
        u.CarrierBaseLng = body.Lng;
        u.CarrierBaseLabel = string.IsNullOrWhiteSpace(body.Label) ? null : body.Label.Trim();
        u.UpdatedAtUtc = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);

        return Ok(new CarrierLocationDto(u.CarrierBaseLat.Value, u.CarrierBaseLng.Value, u.CarrierBaseLabel));
    }

    [HttpGet("route")]
    public async Task<ActionResult<UserRouteDto?>> GetRoute(CancellationToken ct)
    {
        var idRaw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(idRaw, out var id)) return Unauthorized();

        var u = await _db.Users.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (u is null) return Unauthorized();

        if (u.CarrierBaseLat is null || u.CarrierBaseLng is null)
            return Ok(null);

        var origin = new CarrierLocationDto(u.CarrierBaseLat.Value, u.CarrierBaseLng.Value, u.CarrierBaseLabel);
        CarrierLocationDto? dest = null;
        if (u.CarrierDestLat is not null && u.CarrierDestLng is not null)
            dest = new CarrierLocationDto(u.CarrierDestLat.Value, u.CarrierDestLng.Value, u.CarrierDestLabel);

        return Ok(new UserRouteDto(origin, dest));
    }

    [HttpPut("route")]
    public async Task<ActionResult<UserRouteDto>> SetRoute([FromBody] UserRouteDto body, CancellationToken ct)
    {
        var idRaw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(idRaw, out var id)) return Unauthorized();

        var u = await _db.Users.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (u is null) return Unauthorized();

        if (body.Origin is null) return BadRequest("Çıkış noktası (origin) gerekli.");
        if (body.Destination is null) return BadRequest("Varış noktası (destination) gerekli.");

        static bool BadCoord(double lat, double lng, out string err)
        {
            err = "";
            if (lat is < -90 or > 90) { err = "Lat geçersiz."; return true; }
            if (lng is < -180 or > 180) { err = "Lng geçersiz."; return true; }
            return false;
        }

        if (BadCoord(body.Origin.Lat, body.Origin.Lng, out var e1)) return BadRequest(e1);
        if (BadCoord(body.Destination.Lat, body.Destination.Lng, out var e2)) return BadRequest(e2);

        u.CarrierBaseLat = body.Origin.Lat;
        u.CarrierBaseLng = body.Origin.Lng;
        u.CarrierBaseLabel = string.IsNullOrWhiteSpace(body.Origin.Label) ? null : body.Origin.Label.Trim();

        u.CarrierDestLat = body.Destination.Lat;
        u.CarrierDestLng = body.Destination.Lng;
        u.CarrierDestLabel = string.IsNullOrWhiteSpace(body.Destination.Label) ? null : body.Destination.Label.Trim();

        u.UpdatedAtUtc = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);

        return Ok(new UserRouteDto(
            new CarrierLocationDto(u.CarrierBaseLat.Value, u.CarrierBaseLng.Value, u.CarrierBaseLabel),
            new CarrierLocationDto(u.CarrierDestLat.Value, u.CarrierDestLng.Value, u.CarrierDestLabel)));
    }

    /// <summary>Tüm güzergâh kaydını (A ve B) siler.</summary>
    [HttpDelete("route")]
    public async Task<IActionResult> DeleteRoute(CancellationToken ct)
    {
        var idRaw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(idRaw, out var id)) return Unauthorized();

        var u = await _db.Users.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (u is null) return Unauthorized();

        u.CarrierBaseLat = u.CarrierBaseLng = null;
        u.CarrierBaseLabel = null;
        u.CarrierDestLat = u.CarrierDestLng = null;
        u.CarrierDestLabel = null;
        u.UpdatedAtUtc = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);

        return NoContent();
    }

    /// <summary>Yalnızca varış (B) noktasını siler; çıkış (A) kalır.</summary>
    [HttpDelete("route/destination")]
    public async Task<ActionResult<UserRouteDto?>> DeleteRouteDestination(CancellationToken ct)
    {
        var idRaw = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(idRaw, out var id)) return Unauthorized();

        var u = await _db.Users.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (u is null) return Unauthorized();

        if (u.CarrierBaseLat is null || u.CarrierBaseLng is null)
            return BadRequest("Kayıtlı çıkış noktası yok.");

        u.CarrierDestLat = u.CarrierDestLng = null;
        u.CarrierDestLabel = null;
        u.UpdatedAtUtc = DateTime.UtcNow;
        await _db.SaveChangesAsync(ct);

        var origin = new CarrierLocationDto(u.CarrierBaseLat.Value, u.CarrierBaseLng.Value, u.CarrierBaseLabel);
        return Ok(new UserRouteDto(origin, null));
    }
}

