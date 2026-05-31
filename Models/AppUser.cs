using System.ComponentModel.DataAnnotations;

namespace Routiva.Models;

public class AppUser
{
    public int Id { get; set; }

    [Required, MaxLength(80)]
    public string UserName { get; set; } = "";

    [Required, MaxLength(120)]
    public string DisplayName { get; set; } = "";

    [MaxLength(160)]
    public string? Email { get; set; }

    [MaxLength(40)]
    public string? Phone { get; set; }

    [Required, MaxLength(200)]
    public string PasswordHash { get; set; } = "";

    [MaxLength(24)]
    public string Role { get; set; } = "yukveren"; // yukveren | tasiyici

    // Taşıyıcı için: haritadan seçilen operasyon başlangıç noktası (demo)
    public double? CarrierBaseLat { get; set; }
    public double? CarrierBaseLng { get; set; }

    [MaxLength(140)]
    public string? CarrierBaseLabel { get; set; }

    // İkinci nokta: varış / operasyon bitişi (harita)
    public double? CarrierDestLat { get; set; }
    public double? CarrierDestLng { get; set; }

    [MaxLength(140)]
    public string? CarrierDestLabel { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }
}

