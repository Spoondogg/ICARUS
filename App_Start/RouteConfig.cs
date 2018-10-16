using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
namespace ICARUS {
    /// <summary>
    /// Configure various routes
    /// </summary>
    public class RouteConfig {
        public static void RegisterRoutes(RouteCollection routes) {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.IgnoreRoute("favicon.ico");
            /** Opens a MAIN Container of param {id} in Home/Index */
            routes.MapRoute(
                name: "Open",
                url: "{id}",
                defaults: new {
                    controller = "Home",
                    action = "Index",
                    id = UrlParameter.Optional
                }
            );
            /** Default URL pattern */
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new {
                    controller = "Home",
                    action = "Index",
                    id = UrlParameter.Optional
                }
            );
            /** Recieves Icarus.js formposts such as FORM.submit() */
            routes.MapRoute(
                name: "formPost",
                url: "Form/Submit",
                defaults: new {
                    controller = "Form",
                    action = "Submit",
                    id = UrlParameter.Optional
                }
            );
            /** Calls the specified procedure by id */
            routes.MapRoute(
                name: "callProcedure",
                url: "Procedures/Call",
                defaults: new {
                    controller = "Procedures",
                    action = "Call",
                    id = UrlParameter.Optional
                }
            );
        }
    }
}
