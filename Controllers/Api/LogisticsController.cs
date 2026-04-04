using Microsoft.AspNetCore.Mvc;

namespace Routiva.Controllers.Api;

[ApiController]
[Route("api/[controller]")]
public class LogisticsController : ControllerBase
{
    public record CarrierSearchRequest(string FromId, string ToId, string? LoadTypeId, int? WeightKg, decimal? Desi);

    public record VehicleSearchRequest(string FromId, string ToId, string? VehicleTypeId, string? CapacityLabel);

    /// <summary>Demo endpoint — ileride PostgreSQL / SQL Server ve rota algoritması bağlanacak.</summary>
    [HttpPost("carrier-search")]
    [Produces("application/json")]
    public IActionResult CarrierSearch([FromBody] CarrierSearchRequest body)
    {
        return Ok(new
        {
            matched = true,
            message = "Eşleşme (demo). Gerçek veri .NET 10 API ve harita mesafesi ile hesaplanacak.",
            received = body
        });
    }

    [HttpPost("load-search")]
    [Produces("application/json")]
    public IActionResult LoadSearch([FromBody] VehicleSearchRequest body)
    {
        return Ok(new
        {
            matched = true,
            message = "Uygun yükler (demo).",
            received = body
        });
    }

    [HttpGet("health")]
    public IActionResult Health() => Ok(new { status = "ok", service = "Routiva.Logistics" });
}
