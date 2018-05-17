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

        /// <summary>
        /// Redirect HTTP to HTTPS and return appropriate Response Header for SEO
        /// See https://stackoverflow.com/a/41260494/722785
        /// </summary>
        protected void Application_BeginRequest() {
            if (!Context.Request.IsSecureConnection         
                && !Context.Request.IsLocal // to avoid switching to https when local testing
            ) {
                Response.Clear();
                Response.Status = "301 Moved Permanently";
                Response.AddHeader("Location", Context.Request.Url.ToString().Insert(4, "s"));
                Response.End();
            }
        }

        /// <summary>
        /// Debug: it's possible all this stuff could be moved to Startup.cs which has something 
        /// to do with OWIN middleware decoupling from webserver.  
        /// Not going to mess with this for now, though.
        /// See http://stackoverflow.com/questions/20168978/do-i-need-a-global-asax-cs-file-at-all-if-im-using-an-owin-startup-cs-class-and for an entry point to discussion.
        /// </summary>
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