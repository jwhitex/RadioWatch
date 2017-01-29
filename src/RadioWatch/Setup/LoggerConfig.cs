using RadioWatch.Setup.ConfigToken;
using Serilog;

namespace RadioWatch.Setup
{
    public class LoggerConfig
    {
        public static ILogger Setup(ConfigTokenHandler<SeqUriToken> uriToken, ConfigTokenHandler<LogFilePath> logFilePath, ConfigTokenHandler<LogToFile> logToFile)
        {
            var config = new LoggerConfiguration()
            .MinimumLevel.Information()
            .Enrich.FromLogContext();
            if (bool.Parse(logToFile.Token))
                config.WriteTo.File(string.IsNullOrEmpty(logFilePath.Token) ? "./" : logFilePath.Token);
            else
                config.WriteTo.Seq(uriToken.Token);
            Log.Logger = config.CreateLogger();
            return Log.Logger;
        }
    }
}
