using System.Reflection;
using Autofac;
using RadioWatch.Setup.ConfigToken;

namespace RadioWatch.Setup
{
    public class DiConfig
    {
        public static ContainerBuilder Setup()
        {
            var builder = new ContainerBuilder();
            builder.RegisterAssemblyTypes(typeof(Program).GetTypeInfo().Assembly).AssignableTo<IConfigToken>();
            builder.RegisterGeneric(typeof(ConfigTokenHandler<>)).AsSelf();
            return builder;
        }
    }
}
