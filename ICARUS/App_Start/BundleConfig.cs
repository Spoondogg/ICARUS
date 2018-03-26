using System.Web;
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

                "~/Scripts/icarus/IcarusModel/ATTRIBUTES.js",
                "~/Scripts/icarus/IcarusModel/MODEL.js",
                "~/Scripts/icarus/EL.js",


                "~/Scripts/icarus/_generic/GROUP.js",
                "~/Scripts/icarus/_generic/SPAN.js",
                "~/Scripts/icarus/_generic/ANCHOR.js",
                "~/Scripts/icarus/_generic/P.js",
                "~/Scripts/icarus/_generic/UL.js",
                "~/Scripts/icarus/_generic/LI.js",
                "~/Scripts/icarus/_generic/TABLE.js",
                "~/Scripts/icarus/_generic/HEADER.js",
                "~/Scripts/icarus/_generic/FOOTER.js",
                "~/Scripts/icarus/_generic/LABEL.js",
                "~/Scripts/icarus/_generic/FORM.js",
                "~/Scripts/icarus/_generic/SVG.js",
                

                "~/Scripts/icarus/IcarusButton/GLYPHICON.js",
                "~/Scripts/icarus/IcarusButton/DROPDOWNHEADER.js",
                "~/Scripts/icarus/IcarusButton/BUTTONGROUP.js",
                "~/Scripts/icarus/IcarusButton/BUTTON.js",

                "~/Scripts/icarus/IcarusNavBar/NAV.js",
                "~/Scripts/icarus/IcarusNavBar/NAVITEMGROUP.js",
                "~/Scripts/icarus/IcarusNavBar/NAVHEADEROPTIONS.js",
                "~/Scripts/icarus/IcarusNavBar/NAVHEADER.js",
                "~/Scripts/icarus/IcarusNavBar/NAVITEM.js",
                "~/Scripts/icarus/IcarusNavBar/CARET.js",
                "~/Scripts/icarus/IcarusNavBar/TAB.js",
                "~/Scripts/icarus/IcarusNavBar/NAVITEMTAB.js",
                "~/Scripts/icarus/IcarusNavBar/NAVITEMANCHOR.js",
                "~/Scripts/icarus/IcarusNavBar/DROPDOWN.js",
                "~/Scripts/icarus/IcarusNavBar/DROPDOWNTAB.js",
                "~/Scripts/icarus/IcarusNavBar/NAVSEPARATOR.js",
                "~/Scripts/icarus/IcarusNavBar/OPTIONSDROPDOWN.js",

                "~/Scripts/icarus/IcarusButton/DROPDOWNMENUGROUP.js",
                "~/Scripts/icarus/IcarusButton/DROPDOWNMENU.js",
                "~/Scripts/icarus/IcarusButton/TOGGLEBUTTON.js",

                

                "~/Scripts/icarus/IcarusList/BADGE.js",
                "~/Scripts/icarus/IcarusList/LISTGROUPITEM.js",
                "~/Scripts/icarus/IcarusList/LISTGROUP.js",

                "~/Scripts/icarus/IcarusModal/MODAL.js",
                "~/Scripts/icarus/IcarusModal/PROMPT.js",
                "~/Scripts/icarus/IcarusModal/LOADER.js",

                
                
                "~/Scripts/icarus/IcarusNavBar/NAVBARCOLLAPSE.js",
                "~/Scripts/icarus/IcarusNavBar/NAVBAR.js",
                "~/Scripts/icarus/IcarusNavBar/NAVSEARCH.js",
                "~/Scripts/icarus/IcarusNavBar/SIDEBAR.js",

                "~/Scripts/icarus/IcarusJumbotron/JUMBOTRON.js",

                "~/Scripts/icarus/IcarusContainer/CONTAINERBODY.js",
                "~/Scripts/icarus/IcarusContainer/CONTAINER.js",

                "~/Scripts/icarus/IcarusTextBlock/TEXTBLOCK.js",

                "~/Scripts/icarus/IcarusArticle/SECTION.js",
                "~/Scripts/icarus/IcarusArticle/IcarusSectionHeader.js",
                "~/Scripts/icarus/IcarusArticle/ARTICLE.js",
                
                "~/Scripts/icarus/IcarusFooter/STICKYFOOTER.js",
                "~/Scripts/icarus/IcarusFooter/SITEMAP.js",
                "~/Scripts/icarus/IcarusFooter/PAGINATION.js",

                "~/Scripts/icarus/LOADER.js",

                "~/Scripts/icarus/IcarusForm/AntiForgeryToken.js",
                "~/Scripts/icarus/IcarusForm/IcarusFormPost.js",
                "~/Scripts/icarus/IcarusForm/IcarusFieldSet.js",
                "~/Scripts/icarus/IcarusForm/IcarusFormElementGroup.js",
                "~/Scripts/icarus/IcarusForm/IcarusFormElement.js",
                "~/Scripts/icarus/IcarusForm/IcarusFormOption.js",
                "~/Scripts/icarus/IcarusForm/IcarusFormInput.js",
                "~/Scripts/icarus/IcarusForm/IcarusFormSelect.js",
                "~/Scripts/icarus/IcarusForm/IcarusFormTextArea.js",
                "~/Scripts/icarus/IcarusForm/IcarusFormFooter.js",
                "~/Scripts/icarus/IcarusForm/IcarusForm.js",
                "~/Scripts/icarus/IcarusForm/IcarusIndex.js",
                "~/Scripts/icarus/IcarusForm/IcarusInputList.js",
                "~/Scripts/icarus/IcarusForm/IcarusEditor.js",

                "~/Scripts/icarus/REPORT.js",
                "~/Scripts/icarus/THUMBNAILS.js",

                "~/Scripts/icarus/IcarusApp/IcarusLogoutForm.js",
                "~/Scripts/icarus/IcarusApp/MAIN.js",
                

                "~/Scripts/icarus/_Icarus.js"));
        }
    }
}