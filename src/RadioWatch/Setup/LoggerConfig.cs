using RadioWatch.Setup.ConfigToken;
using Serilog;

namespace RadioWatch.Setup
{
    public class LoggerConfig
    {
        public static ILogger Setup(ConfigTokenHandler<SeqUriToken> uriToken)
        {
            Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Information()
            .Enrich.FromLogContext()
            .WriteTo.Seq(uriToken.Token).CreateLogger();

            return Log.Logger;
        }
    }
}
