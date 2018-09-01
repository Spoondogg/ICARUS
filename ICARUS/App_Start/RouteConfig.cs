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

            /**
                Loads the given id as an APP into Home/Index
            */
            routes.MapRoute(
                name: "LaunchApp",
                url: "{id}",
                defaults: new {
                    controller = "Home",
                    action = "Index",
                    id = UrlParameter.Optional
                }
            );



            /**
                Default URL pattern
            */
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new {
                    controller = "Home",
                    action = "Index",
                    id = UrlParameter.Optional
                }
            );

            // TODO: Verify if this is still required
            routes.MapRoute(
                name: "formObject",
                url: "Form/FormObject/{id}",
                defaults: new {
                    controller = "Form",
                    action = "FormObject",
                    id = UrlParameter.Optional
                }
            );

            // TODO: Verify if this is still required
            routes.MapRoute(
                name: "formElementEditor",
                url: "FormElement/FormElementEditor/{id}",
                defaults: new { controller = "FormElement", action = "FormElementEditor", id = UrlParameter.Optional }
            );

            /**
             * Form data is POSTED via FORM.submit();
            */
            // TODO: Verify if this is still required
            routes.MapRoute(
                name: "formPost",
                url: "Form/Submit",
                defaults: new { controller = "Form", action = "Submit", id = UrlParameter.Optional }
            );

            // TODO: Verify if this is still required
            routes.MapRoute(
                name: "formPostEdit",
                url: "FormPosts/Edit",
                defaults: new { controller = "FormPosts", action = "Edit", id = UrlParameter.Optional }
            );

            // TODO: Verify if this is still required
            routes.MapRoute(
                name: "formGroupPost",
                url: "Form/FormGroupObject",
                defaults: new { controller = "Form", action = "FormGroupObject", id = UrlParameter.Optional }
            );

            /*
                Returns a JSON Form Group Objects for the Input list
             */
            routes.MapRoute(
                name: "formGroupsPost",
                url: "Form/FormGroupsObject",
                defaults: new { controller = "Form", action = "FormGroupsObject", id = UrlParameter.Optional }
            );
            
            routes.MapRoute(
                name: "formElementPost",
                url: "Form/FormElementObject",
                defaults: new { controller = "Form", action = "FormElementObject", id = UrlParameter.Optional }
            );
            
            routes.MapRoute(
                name: "formElementsPost",
                url: "Form/FormElementsObject",
                defaults: new { controller = "Form", action = "FormElementsObject", id = UrlParameter.Optional }
            );
            
            routes.MapRoute(
                name: "formOptionPost",
                url: "Form/FormOptionObject",
                defaults: new { controller = "Form", action = "FormOptionObject", id = UrlParameter.Optional }
            );
            
            routes.MapRoute(
                name: "formOptionsPost",
                url: "Form/FormOptionsObject",
                defaults: new { controller = "Form", action = "FormOptionsObject", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "formCategoriesPost",
                url: "Form/FormCategoriesObject",
                defaults: new { controller = "Form", action = "FormCategoriesObject", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "getOptions",
                url: "Form/GetOptions",
                defaults: new { controller = "Form", action = "GetOptions", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "callProcedure",
                url: "Procedures/Call",
                defaults: new { controller = "Procedures", action = "Call", id = UrlParameter.Optional }
            );
        }
    }
}
