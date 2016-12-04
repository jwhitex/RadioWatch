using Microsoft.Extensions.Configuration;

namespace RadioWatch.Setup.ConfigToken
{
    public class ConfigTokenHandler<T> where T : IConfigToken
    {
        private readonly IConfigurationRoot _configuration;

        public ConfigTokenHandler(IConfigurationRoot configuration)
        {
            _configuration = configuration;
        }

        public string Token
        {
            get { return _configuration.GetSection(typeof(T).Name).Value; }
        }
    }
}