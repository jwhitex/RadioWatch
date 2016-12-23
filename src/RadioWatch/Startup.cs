using System;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using RadioWatch.Setup;
using RadioWatch.Setup.ConfigToken;
using Serilog;

namespace RadioWatch
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();

            builder.AddJsonFile("config.json");

            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }
        public IContainer ApplicationContainer { get; private set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            // Add framework services.
            services.AddMvc();

            var builder = DiConfig.Setup();
            builder.Register(c => LoggerConfig.Setup(c.Resolve<ConfigTokenHandler<SeqUriToken>>())).As<Serilog.ILogger>().SingleInstance();
            builder.Register(c => Configuration).As<IConfigurationRoot>().SingleInstance();

            builder.Populate(services);
            ApplicationContainer = builder.Build();
            using (var lifetimeScope = ApplicationContainer.BeginLifetimeScope())
            {
                var logger = lifetimeScope.Resolve<Serilog.ILogger>();
                logger.Information("Application Starting..");
            }

            return new AutofacServiceProvider(ApplicationContainer);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory, IApplicationLifetime appLifetime)
        {
            //Good post on exception filter...
            //https://weblog.west-wind.com/posts/2016/Oct/16/Error-Handling-and-ExceptionFilter-Dependency-Injection-for-ASPNET-Core-APIs
            loggerFactory.AddSerilog();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Home", action = "Index" });
            });

            appLifetime.ApplicationStopped.Register(() => ApplicationContainer.Dispose());
        }
    }
}
