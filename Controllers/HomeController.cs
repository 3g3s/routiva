using System.Text;
using Microsoft.AspNetCore.Mvc;
using Routiva.Models;
using System.Diagnostics;

namespace Routiva.Controllers
{
    public class HomeController : Controller
    {
        private readonly IWebHostEnvironment _env;

        public HomeController(IWebHostEnvironment env) => _env = env;

        [HttpGet("/")]
        [HttpGet("/yuk-olustur")]
        [HttpGet("/arac-ilani")]
        [HttpGet("/gizlilik")]
        [HttpGet("/giris")]
        [HttpGet("/kayit")]
        [HttpGet("/iletisim")]
        [HttpGet("/hakkimizda")]
        [HttpGet("/nasil-calisir")]
        [HttpGet("/sss")]
        [HttpGet("/kullanim-kosullari")]
        [HttpGet("/teklif/{slot}")]
        [HttpGet("/yuk-ilan/{slot}")]
        [HttpGet("/sohbet")]
        public IActionResult Index()
        {
            var path = Path.Combine(_env.WebRootPath, "spa", "index.html");
            if (!System.IO.File.Exists(path))
            {
                return Content(
                    "Önce ClientApp klasöründe 'npm install' ve 'npm run build' çalıştırın.",
                    "text/plain; charset=utf-8",
                    Encoding.UTF8);
            }

            return PhysicalFile(path, "text/html");
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
