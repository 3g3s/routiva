using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Mvc;

namespace Routiva.Controllers.Api;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _config;
    private readonly ILogger<ChatController> _logger;

    public ChatController(
        IHttpClientFactory httpClientFactory,
        IConfiguration config,
        ILogger<ChatController> logger)
    {
        _httpClientFactory = httpClientFactory;
        _config = config;
        _logger = logger;
    }

    public class ChatTurnDto
    {
        public string Role { get; set; } = "";
        public string Text { get; set; } = "";
    }

    public class ChatReplyRequestDto
    {
        public string Partner { get; set; } = "";
        public string Mod { get; set; } = "";
        public string? Rota { get; set; }
        public string? Ozet { get; set; }
        public List<ChatTurnDto> History { get; set; } = new();
        public string Message { get; set; } = "";
    }

    public record ChatReplyResponse(string Reply, bool UsedAi, string? Hint);

    [HttpPost("reply")]
    public async Task<ActionResult<ChatReplyResponse>> Reply([FromBody] ChatReplyRequestDto body, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(body.Message))
            return BadRequest(new ChatReplyResponse("Boş mesaj gönderilemez.", false, null));

        var apiKey = _config["Ai:GeminiApiKey"]?.Trim();
        var model = _config["Ai:GeminiModel"]?.Trim();
        if (string.IsNullOrEmpty(model))
            model = "gemini-2.0-flash";

        if (string.IsNullOrEmpty(apiKey))
        {
            var fb = BuildOfflineReply(body);
            return Ok(new ChatReplyResponse(
                fb,
                false,
                "Yapay zeka için Ai:GeminiApiKey ekleyin: geliştirmede dotnet user-secrets; üretimde ortam değişkeni Ai__GeminiApiKey."));
        }

        try
        {
            var text = await CallGeminiAsync(apiKey, model, body, ct);
            if (string.IsNullOrWhiteSpace(text))
            {
                var fb = BuildOfflineReply(body);
                return Ok(new ChatReplyResponse(fb, false, "Model yanıt üretemedi; yedek mod kullanıldı."));
            }

            return Ok(new ChatReplyResponse(text.Trim(), true, null));
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Gemini sohbet isteği başarısız.");
            var fb = BuildOfflineReply(body);
            return Ok(new ChatReplyResponse(fb, false, "API hatası; yedek yanıt gösteriliyor."));
        }
    }

    private static string BuildSystemPrompt(ChatReplyRequestDto req)
    {
        var rol = req.Mod == "yukveren"
            ? "Sen, yük veren firma temsilcisisin. Karşı taraftaki taşıyıcı / nakliyeci ile yazışıyorsun."
            : "Sen, nakliyeci / taşıyıcı firma temsilcisisin. Karşı taraftaki yük veren ile yazışıyorsun.";

        var ctx = new StringBuilder();
        ctx.Append(rol);
        ctx.Append(" Firma adı: ").Append(req.Partner).Append('.');
        if (!string.IsNullOrWhiteSpace(req.Rota))
            ctx.Append(" Güzergâh / rota bağlamı: ").Append(req.Rota).Append('.');
        if (!string.IsNullOrWhiteSpace(req.Ozet))
            ctx.Append(" Ek özet (teklif veya yük): ").Append(req.Ozet).Append('.');
        ctx.Append("""
            
            Kurallar:
            - Sadece Türkçe, kısa ve profesyonel lojistik dili kullan (2–6 cümle).
            - Kullanıcının son mesajına doğrudan ve mantıklı cevap ver; spekülasyon yapma.
            - Kesin hukuki taahhüt, garanti fiyat veya sahte belge vaadi verme; gerekirse "kesin fiyat için operasyon onayı" de.
            - ADR, sigorta, frigo sıcaklığı, yükleme penceresi gibi konularda genel doğru bilgi verebilirsin.
            - Routiva bir eşleştirme platformudur; ödeme detayını platform süreçlerine bırak.
            """);

        return ctx.ToString();
    }

    private async Task<string?> CallGeminiAsync(string apiKey, string model, ChatReplyRequestDto req, CancellationToken ct)
    {
        var systemPrompt = BuildSystemPrompt(req);

        var contents = new JsonArray();
        foreach (var turn in req.History)
        {
            var role = string.Equals(turn.Role, "assistant", StringComparison.OrdinalIgnoreCase) ? "model" : "user";
            var text = turn.Text?.Trim() ?? "";
            if (text.Length == 0) continue;
            contents.Add(new JsonObject
            {
                ["role"] = role,
                ["parts"] = new JsonArray { new JsonObject { ["text"] = text } },
            });
        }

        contents.Add(new JsonObject
        {
            ["role"] = "user",
            ["parts"] = new JsonArray { new JsonObject { ["text"] = req.Message.Trim() } },
        });

        var root = new JsonObject
        {
            ["systemInstruction"] = new JsonObject
            {
                ["parts"] = new JsonArray { new JsonObject { ["text"] = systemPrompt } },
            },
            ["contents"] = contents,
            ["generationConfig"] = new JsonObject
            {
                ["maxOutputTokens"] = 768,
                ["temperature"] = 0.55,
            },
        };

        var client = _httpClientFactory.CreateClient();
        client.Timeout = TimeSpan.FromSeconds(55);

        var safeModel = string.IsNullOrWhiteSpace(model) ? "gemini-2.0-flash" : model.Trim();
        if (safeModel.Contains('/') || safeModel.Contains('?'))
            safeModel = "gemini-2.0-flash";

        var url =
            $"https://generativelanguage.googleapis.com/v1beta/models/{safeModel}:generateContent?key={Uri.EscapeDataString(apiKey)}";

        using var httpReq = new HttpRequestMessage(HttpMethod.Post, url);
        httpReq.Content = new StringContent(root.ToJsonString(), Encoding.UTF8, "application/json");
        httpReq.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

        using var resp = await client.SendAsync(httpReq, ct);
        var json = await resp.Content.ReadAsStringAsync(ct);

        if (!resp.IsSuccessStatusCode)
        {
            _logger.LogWarning("Gemini HTTP {Status}: {Body}", (int)resp.StatusCode, json.Length > 500 ? json[..500] : json);
            return null;
        }

        using var doc = JsonDocument.Parse(json);
        var rootEl = doc.RootElement;

        if (rootEl.TryGetProperty("error", out var err))
        {
            _logger.LogWarning("Gemini error: {Err}", err.GetRawText());
            return null;
        }

        if (!rootEl.TryGetProperty("candidates", out var candidates) || candidates.GetArrayLength() == 0)
            return null;

        var first = candidates[0];
        if (first.TryGetProperty("content", out var content) &&
            content.TryGetProperty("parts", out var parts) &&
            parts.GetArrayLength() > 0 &&
            parts[0].TryGetProperty("text", out var textEl))
        {
            return textEl.GetString();
        }

        return null;
    }

    /// <summary>Anahtar yok veya API hatasında Türkçe mantıklı yedek yanıt.</summary>
    private static string BuildOfflineReply(ChatReplyRequestDto req)
    {
        var msg = req.Message.ToLowerInvariant();
        var isCarrier = req.Mod != "yukveren";

        if (msg.Contains("merhaba") || msg.Contains("selam") || msg.Contains("günaydın") || msg.Contains("iyi günler"))
            return isCarrier
                ? $"Merhaba, {req.Partner} olarak yardımcı olmaya hazırız.{(string.IsNullOrWhiteSpace(req.Rota) ? "" : " " + req.Rota + " hattı için")} Ağırlık, desi veya palet adedini paylaşırsanız süreci netleştiririz."
                : $"Merhaba, {req.Partner} tarafından yazıyorum. Aracınızın kapasitesi ve hangi günler müsait olduğunuzu yazar mısınız?";

        if (msg.Contains("fiyat") || msg.Contains("ücret") || msg.Contains("tl") || msg.Contains("maliyet"))
            return isCarrier
                ? "Fiyat; güzergâh, yük tipi, kg/desi ve mevcut filoya göre değişir. Bu bilgileri paylaşırsanız aralık veya net teklif için operasyonu devreye alırız."
                : "Taşıma bedeli rota ve yük özelliklerine göre belirlenir. Şu an otomatik fiyat bağlamıyorum; ilanınızdaki özet üzerinden taşıyıcı tekliflerini değerlendirebilirsiniz.";

        if (msg.Contains("adr") || msg.Contains("tehlikeli"))
            return "ADR taşımalarda sınıf, UN numarası ve güncel belgeler kritiktir. Uygun araç ve sertifikalı sürücü koordinasyonu gerekir; detayları mesajınıza yazarsanız uygunluk kontrolü yapılır.";

        if (msg.Contains("frigo") || msg.Contains("soğuk") || msg.Contains("soguk") || msg.Contains("reefer"))
            return "Frigofirik yüklemede hedef sıcaklık aralığı ve ürün tipi (gıda/ilaç vb.) net olmalı. Veri kaydı veya termograf isteğinizi belirtin.";

        if (msg.Contains("ne zaman") || msg.Contains("saat") || msg.Contains("yarın") || msg.Contains("yükleme"))
            return "Yükleme/boşaltma için tercih ettiğiniz gün ve saat aralığını yazın; depo/tesis çalışma saatlerine göre slot önerelim.";

        if (msg.Contains("sigorta") || msg.Contains("kasko"))
            return "Yük sigortası ve araç teminatları genelde sözleşmede netleşir. Kapsam ve limit talebinizi yazarsanız yönlendirebilirim.";

        if (msg.Contains("teşekkür") || msg.Contains("sağ ol"))
            return "Rica ederim, başka bir konuda da yazabilirsiniz.";

        return isCarrier
            ? $"Mesajınızı aldım ({req.Partner}). Biraz daha ayrıntı (kg, desi, palet, ADR ihtiyacı, yükleme adresi zamanı) paylaşırsanız daha net yanıt verebilirim."
            : $"Not aldım. Araç tipi, müsait olduğunuz günler ve {req.Partner} ilanıyla ilgili sorunuz varsa devam edebilirsiniz.";
    }
}
