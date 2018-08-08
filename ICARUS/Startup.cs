using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ICARUS.Startup))]
namespace ICARUS {

    public partial class Startup {

        /// <summary>
        /// <see cref="http://scottdorman.github.io/2016/03/17/integrating-asp.net-core-dependency-injection-in-mvc-4/"/>
        /// </summary>
        /// <param name="app"></param>
        public void Configuration(IAppBuilder app) {
            //var services = new ServiceCollection();
            ConfigureAuth(app);
            //ConfigureServices(new ServiceCollection()); // .net core
        }
        //public void ConfigureServices(ServiceCollection services) {        } // .net core
    }
}
