using ICARUS.Helpers;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.Hosting;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace ICARUS {
    public class MvcApplication : System.Web.HttpApplication {

        // Debug: it's possible all this stuff could be moved to Startup.cs which has something to do with OWIN middleware decoupling from webserver.  
        // Not going to mess with this for now, though.
        // See http://stackoverflow.com/questions/20168978/do-i-need-a-global-asax-cs-file-at-all-if-im-using-an-owin-startup-cs-class-and for an entry point to discussion.
        protected void Application_Start() {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            // Encrypt sections of web.config.
            Configuration config = WebConfigurationManager.OpenWebConfiguration(HostingEnvironment.ApplicationVirtualPath);
            config.EncryptConnectionString(true);
            config.EncryptMailSettings(true);
        }
    }
}