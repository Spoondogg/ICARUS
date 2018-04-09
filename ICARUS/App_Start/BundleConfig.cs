﻿using System.Web;
using System.Web.Optimization;

namespace ICARUS {

    /// <summary>
    /// Script bundles
    /// For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
    /// </summary>
    public class BundleConfig {
        
        public static void RegisterBundles(BundleCollection bundles) {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr/modernizr-*"));

            // http://requirejs.org/docs/download.html#latest
            bundles.Add(new ScriptBundle("~/bundles/require").Include(
                        "~/Scripts/require/require-*"));

            // TODO Automate minified in final build
            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap/bootstrap.js",
                      "~/Scripts/bootstrap/respond.js"));
            
            // Bootstrap Styles
            bundles.Add(new StyleBundle("~/Content/css/bootstrap").Include(
                "~/Content/css/bootstrap.css" //,new CssRewriteUrlTransform()
            ));

            // Icarus specific styles - Names cannot contain UNDERSCORES
            bundles.Add(new StyleBundle("~/Content/css/icarus").Include(
                "~/Content/css/spoonMedia/icarus.css",
                "~/Content/css/spoonMedia/container.css",
                "~/Content/css/spoonMedia/main.css",
                "~/Content/css/spoonMedia/label.css",
                "~/Content/css/spoonMedia/textblock.css",
                "~/Content/css/spoonMedia/dropdown.css",
                "~/Content/css/spoonMedia/button.css",
                "~/Content/css/spoonMedia/glyphicon.css",
                "~/Content/css/spoonMedia/navbar.css",
                "~/Content/css/spoonMedia/prompt.css",
                "~/Content/css/spoonMedia/modal.css",
                "~/Content/css/spoonMedia/jumbotron.css",
                "~/Content/css/spoonMedia/section.css",
                "~/Content/css/spoonMedia/form.css",
                "~/Content/css/spoonMedia/elementgroup.css",
                "~/Content/css/spoonMedia/footer.css",
                "~/Content/css/spoonMedia/table.css",
                "~/Content/css/spoonMedia/mobile.css"
            ));

            // Custom Javascript objects from the Icarus.js library (Ordered by Dependency)
            // bundles.Add(new ScriptBundle("~/bundles/icarus").IncludeDirectory("~/Scripts/icarus", "*.js", true)); // All objects in folder (alphabetical)
            bundles.Add(new ScriptBundle("~/bundles/icarus").Include(

                // Generic
                "~/Scripts/icarus/_Icarus.js",  // Clean up when possible
                "~/Scripts/icarus/WATERMARK.js",
                "~/Scripts/icarus/model/ATTRIBUTES.js",
                "~/Scripts/icarus/model/MODEL.js",
                "~/Scripts/icarus/model/el/EL.js",

                // Button
                "~/Scripts/icarus/model/el/button/BUTTON.js",
                "~/Scripts/icarus/model/el/button/togglebutton/TOGGLEBUTTON.js",

                // Text
                "~/Scripts/icarus/model/el/text/ANCHOR.js",
                "~/Scripts/icarus/model/el/text/BADGE.js",
                "~/Scripts/icarus/model/el/text/LABEL.js",
                "~/Scripts/icarus/model/el/text/span/SPAN.js",
                "~/Scripts/icarus/model/el/text/span/CARET.js",
                "~/Scripts/icarus/model/el/text/span/GLYPHICON.js",
                "~/Scripts/icarus/model/el/text/p/P.js",
                "~/Scripts/icarus/model/el/text/p/WELL.js",

                // Graphic
                "~/Scripts/icarus/model/el/graphic/SVG.js",

                // Group
                "~/Scripts/icarus/model/el/group/GROUP.js",
                "~/Scripts/icarus/model/el/group/buttongroup/BUTTONGROUP.js",
                "~/Scripts/icarus/model/el/group/dropdownmenugroup/DROPDOWNMENUGROUP.js",

                // List Items
                "~/Scripts/icarus/model/el/group/li/LI.js",
                "~/Scripts/icarus/model/el/group/li/dropdownheader/DROPDOWNHEADER.js",
                "~/Scripts/icarus/model/el/group/li/listgroupitem/LISTGROUPITEM.js",

                // List
                "~/Scripts/icarus/model/el/group/ul/UL.js",
                "~/Scripts/icarus/model/el/group/ul/listgroup/LISTGROUP.js",

                // Layout and Navigation
                "~/Scripts/icarus/model/el/nav/NAV.js",
                "~/Scripts/icarus/model/el/nav/navbar/NAVBAR.js",
                "~/Scripts/icarus/model/el/header/HEADER.js",
                "~/Scripts/icarus/model/el/footer/FOOTER.js",
                "~/Scripts/icarus/model/el/footer/stickyfooter/STICKYFOOTER.js",
                
                "~/Scripts/icarus/model/el/nav/navitemgroup/NAVITEMGROUP.js",
                "~/Scripts/icarus/model/el/nav/navitemgroup/NAVBARCOLLAPSE.js",
                "~/Scripts/icarus/model/el/nav/navitemgroup/NAVHEADER.js",
                "~/Scripts/icarus/model/el/nav/navitemgroup/NAVHEADEROPTIONS.js",
                "~/Scripts/icarus/model/el/nav/navitemgroup/NAVITEMGROUP.js",
                "~/Scripts/icarus/model/el/nav/navitemgroup/SIDEBAR.js",

                "~/Scripts/icarus/model/el/nav/navitemgroup/dropdownmenu/DROPDOWNMENU.js",

                "~/Scripts/icarus/model/el/nav/navitem/NAVITEM.js",
                "~/Scripts/icarus/model/el/nav/navitem/NAVSEARCH.js",
                "~/Scripts/icarus/model/el/nav/navitem/NAVSEPARATOR.js",
                "~/Scripts/icarus/model/el/nav/navitem/TAB.js",
                "~/Scripts/icarus/model/el/nav/navitem/navitemtab/NAVITEMTAB.js",
                "~/Scripts/icarus/model/el/nav/navitem/navitemtab/dropdowntab/DROPDOWNTAB.js",
                "~/Scripts/icarus/model/el/nav/navitem/navitemtab/dropdowntab/OPTIONSDROPDOWN.js",

                // Container
                "~/Scripts/icarus/model/el/container/CONTAINERBODY.js",
                "~/Scripts/icarus/model/el/container/CONTAINERFACTORY.js",
                "~/Scripts/icarus/model/el/container/CONTAINER.js",

                    // Modal
                    "~/Scripts/icarus/model/el/container/modal/MODAL.js",
                    "~/Scripts/icarus/model/el/container/modal/loader/LOADER.js",
                    "~/Scripts/icarus/model/el/container/modal/prompt/PROMPT.js",

                // Form
                "~/Scripts/icarus/model/el/container/form/fieldset/formelement/FORMELEMENT.js",
                "~/Scripts/icarus/model/el/container/form/fieldset/formelement/FORMELEMENTGROUP.js",
                "~/Scripts/icarus/model/el/container/form/fieldset/formelement/textarea/TEXTAREA.js",
                "~/Scripts/icarus/model/el/container/form/fieldset/formelement/select/OPTION.js",
                "~/Scripts/icarus/model/el/container/form/fieldset/formelement/select/SELECT.js",
                "~/Scripts/icarus/model/el/container/form/fieldset/formelement/input/INPUT.js",
                "~/Scripts/icarus/model/el/container/form/fieldset/formelement/input/TOKEN.js",
                "~/Scripts/icarus/model/el/container/form/fieldset/FIELDSET.js",
                "~/Scripts/icarus/model/el/container/form/FORMFOOTER.js",
                "~/Scripts/icarus/model/el/container/form/FORM.js",

                // Custom Forms
                "~/Scripts/icarus/model/el/container/form/forms/LogoutForm.js",

                // Main
                "~/Scripts/icarus/model/el/container/main/article/section/SECTION.js",
                "~/Scripts/icarus/model/el/container/main/article/ARTICLE.js",
                "~/Scripts/icarus/model/el/container/main/MAIN.js"
            ));
        }
    }
}