using Microsoft.AspNetCore.Mvc;
using RadioWatch.Setup.ConfigToken;

namespace RadioWatch.Controllers
{
    [Route("api/[controller]")]
    public class ConfigController : Controller
    {
        private readonly ConfigTokenHandler<YoutubeToken> _tokenHandler;

        public ConfigController(ConfigTokenHandler<YoutubeToken> tokenHandler)
        {
            _tokenHandler = tokenHandler;
        }

        public class YoutubeApiToken
        {
            public string Token { get; set; }
        }

        [HttpGet("youtube")]
        public IActionResult Get()
        {
            return new JsonResult(new YoutubeApiToken
            {
                Token = _tokenHandler.Token
            });
        }
    }
}
