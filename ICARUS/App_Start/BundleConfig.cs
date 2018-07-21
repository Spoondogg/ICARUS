using System.Web;
using System.Web.Optimization;

namespace ICARUS {

    /// <summary>
    /// Script bundles
    /// For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
    /// </summary>
    public class BundleConfig {
        
        public static void RegisterBundles(BundleCollection bundles) {
            bundles.Add(new ScriptBundle("~/bundles/jquery.js").Include(
                "~/Scripts/jquery/jquery-{version}.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval.js").Include(
                "~/Scripts/jquery/jquery.validate*"
            ));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr.js").Include(
                "~/Scripts/modernizr/modernizr-*"
            ));

            // http://requirejs.org/docs/download.html#latest
            bundles.Add(new ScriptBundle("~/bundles/require.js").Include(
                "~/Scripts/require/require-*"
            ));

            // TODO Automate minified in final build
            bundles.Add(new ScriptBundle("~/bundles/bootstrap.js").Include(
                "~/Scripts/bootstrap/bootstrap.js",
                "~/Scripts/bootstrap/respond.js"
            ));
            
            // Bootstrap Styles
            bundles.Add(new StyleBundle("~/Content/css/bootstrap.css").Include(
                "~/Content/css/bootstrap/bootstrap.css" //,new CssRewriteUrlTransform()
            ));

            // Animate.css Styles
            bundles.Add(new StyleBundle("~/Content/css/animate").Include(
                "~/Content/css/animate/animate.css"
            ));

            // Icarus specific styles - Names cannot contain UNDERSCORES
            bundles.Add(new StyleBundle("~/Content/css/icarus.css").Include(
                "~/Content/css/icarus/icarus.css",
                "~/Content/css/icarus/icon.css",
                "~/Content/css/icarus/thumbnail.css",
                "~/Content/css/icarus/console.css",
                "~/Content/css/icarus/loader.css",
                "~/Content/css/icarus/container.css",
                "~/Content/css/icarus/dictionary.css",
                "~/Content/css/icarus/word.css",
                "~/Content/css/icarus/main.css",
                "~/Content/css/icarus/label.css",
                "~/Content/css/icarus/textblock.css",
                "~/Content/css/icarus/dropdown.css",
                "~/Content/css/icarus/button.css",
                "~/Content/css/icarus/glyphicon.css",
                "~/Content/css/icarus/menulist.css",
                "~/Content/css/icarus/navbar.css",
                "~/Content/css/icarus/prompt.css",
                "~/Content/css/icarus/preview.css",
                "~/Content/css/icarus/modal.css",
                "~/Content/css/icarus/banner.css",
                "~/Content/css/icarus/imagegallery.css",
                "~/Content/css/icarus/classview.css",
                "~/Content/css/icarus/index.css",
                "~/Content/css/icarus/jumbotron.css",
                "~/Content/css/icarus/section.css",
                "~/Content/css/icarus/form.css",
                "~/Content/css/icarus/elementgroup.css",
                "~/Content/css/icarus/footer.css",
                "~/Content/css/icarus/chat.css",
                "~/Content/css/icarus/table.css",
                "~/Content/css/icarus/mobile.css"
            ));

            // Custom Javascript objects from the Icarus.js library (Ordered by Dependency)
            // bundles.Add(new ScriptBundle("~/bundles/icarus").IncludeDirectory("~/Scripts/icarus", "*.js", true)); // All objects in folder (alphabetical)
            bundles.Add(new ScriptBundle("~/bundles/icarus.js").Include(

                // Model
                "~/Scripts/icarus/model/ATTRIBUTES.js",
                "~/Scripts/icarus/model/MODEL.js",
                "~/Scripts/icarus/model/el/EL.js",

                // Generic
                "~/Scripts/icarus/DATAELEMENTS.js",
                "~/Scripts/icarus/ICONS.js",
                "~/Scripts/icarus/_Icarus.js",  // Clean up when possible
                "~/Scripts/icarus/WATERMARK.js",

                // Graphic
                "~/Scripts/icarus/model/el/graphic/SVG.js",
                "~/Scripts/icarus/model/el/graphic/IMG.js",

                // Text
                "~/Scripts/icarus/model/el/text/ANCHOR.js",
                "~/Scripts/icarus/model/el/text/BADGE.js",
                "~/Scripts/icarus/model/el/text/HR.js",
                "~/Scripts/icarus/model/el/text/LABEL.js",
                "~/Scripts/icarus/model/el/text/span/SPAN.js",
                "~/Scripts/icarus/model/el/text/span/CARET.js",
                "~/Scripts/icarus/model/el/text/span/GLYPHICON.js",
                "~/Scripts/icarus/model/el/text/p/P.js",
                "~/Scripts/icarus/model/el/text/p/WELL.js",

                


                // Group (Generic Data Structure) (LIST?)
                "~/Scripts/icarus/model/el/group/GROUP.js",

                // Group > Container
                "~/Scripts/icarus/model/el/container/CONTAINERBODY.js",
                "~/Scripts/icarus/model/el/container/CONTAINERFACTORY.js",
                "~/Scripts/icarus/model/el/container/CONTAINER.js",

                // Group > List
                "~/Scripts/icarus/model/el/group/li/LI.js",
                "~/Scripts/icarus/model/el/group/ul/UL.js",
                "~/Scripts/icarus/model/el/group/ul/console/CONSOLE.js",

                // Container > NAV
                "~/Scripts/icarus/model/el/nav/navitemicon/NAVITEMICON.js",
                "~/Scripts/icarus/model/el/nav/navitem/NAVITEM.js",
                "~/Scripts/icarus/model/el/nav/navitem/NAVSEARCH.js",
                "~/Scripts/icarus/model/el/nav/navitem/NAVSEPARATOR.js",
                "~/Scripts/icarus/model/el/nav/navitem/TAB.js",

                // Container > NAV > MENU
                "~/Scripts/icarus/model/el/nav/menu/MENU.js",
                "~/Scripts/icarus/model/el/nav/menu/NAVHEADER.js",
                "~/Scripts/icarus/model/el/nav/menu/SIDEBAR.js",

                "~/Scripts/icarus/model/el/nav/navitem/navitemtab/NAVITEMTAB.js",
                "~/Scripts/icarus/model/el/nav/navitem/navitemtab/dropdowntab/DROPDOWNTAB.js",
                "~/Scripts/icarus/model/el/nav/navitem/navitemtab/modaltab/MODALTAB.js",

                "~/Scripts/icarus/model/el/nav/navitemgroup/dropdownmenu/DROPDOWNMENU.js",

                // Group > List Items
                "~/Scripts/icarus/model/el/group/li/dropdownheader/DROPDOWNHEADER.js",
                "~/Scripts/icarus/model/el/group/li/listgroupitem/LISTGROUPITEM.js",
                "~/Scripts/icarus/model/el/group/ul/listgroup/LISTGROUP.js",
                "~/Scripts/icarus/model/el/group/buttongroup/BUTTONGROUP.js",

                // Button
                "~/Scripts/icarus/model/el/button/BUTTON.js",
                "~/Scripts/icarus/model/el/button/togglebutton/TOGGLEBUTTON.js",

                // Modal Dialog
                "~/Scripts/icarus/model/el/modal/MODAL.js",
                "~/Scripts/icarus/model/el/modal/loader/LOADER.js",
                "~/Scripts/icarus/model/el/modal/modalmenu/MODALMENU.js",
                "~/Scripts/icarus/model/el/modal/prompt/PROMPT.js",

                // Layout and Navigation
                "~/Scripts/icarus/model/el/nav/NAV.js",
                "~/Scripts/icarus/model/el/nav/navbar/NAVBAR.js",
                "~/Scripts/icarus/model/el/header/HEADER.js",
                "~/Scripts/icarus/model/el/footer/FOOTER.js",
                "~/Scripts/icarus/model/el/footer/stickyfooter/STICKYFOOTER.js",


                // Container Generics
                "~/Scripts/icarus/model/el/container/iframe/IFRAME.js",

                // Jumbotrons and Banners
                "~/Scripts/icarus/model/el/container/jumbotron/JUMBOTRON.js",
                "~/Scripts/icarus/model/el/container/banner/thumbnail/THUMBNAIL.js",
                "~/Scripts/icarus/model/el/container/banner/thumbnail/indexthumbnail/INDEXTHUMBNAIL.js",
                "~/Scripts/icarus/model/el/container/banner/callout/CALLOUT.js",
                "~/Scripts/icarus/model/el/container/banner/BANNER.js",
                "~/Scripts/icarus/model/el/container/banner/index/INDEX.js",
                "~/Scripts/icarus/model/el/container/banner/imagegallery/IMAGEGALLERY.js",
                "~/Scripts/icarus/model/el/container/banner/indexmain/INDEXMAIN.js",
                "~/Scripts/icarus/model/el/container/banner/classviewer/CLASSVIEWER.js",
                "~/Scripts/icarus/model/el/container/paragraph/PARAGRAPH.js",
                "~/Scripts/icarus/model/el/container/textblock/TEXTBLOCK.js",

                // List
                "~/Scripts/icarus/model/el/container/list/listitem/LISTITEM.js",
                "~/Scripts/icarus/model/el/container/list/LIST.js",
                "~/Scripts/icarus/model/el/container/menulist/MENULIST.js",

                // Form
                "~/Scripts/icarus/model/el/container/form/fieldset/formelement/FORMELEMENT.js",
                
                "~/Scripts/icarus/model/el/container/form/fieldset/formelement/textarea/TEXTAREA.js",
                "~/Scripts/icarus/model/el/container/form/fieldset/formelement/select/OPTION.js",
                "~/Scripts/icarus/model/el/container/form/fieldset/formelement/select/SELECT.js",
                "~/Scripts/icarus/model/el/container/form/fieldset/formelement/input/INPUT.js",
                "~/Scripts/icarus/model/el/container/form/fieldset/formelement/input/file/FILE.js",
                "~/Scripts/icarus/model/el/container/form/fieldset/formelement/input/TOKEN.js",
                "~/Scripts/icarus/model/el/container/form/fieldset/formelement/formpostinput/FORMPOSTINPUT.js",

                "~/Scripts/icarus/model/el/container/form/fieldset/formelement/FORMELEMENTGROUP.js",
                "~/Scripts/icarus/model/el/container/form/fieldset/FIELDSET.js",
                "~/Scripts/icarus/model/el/container/form/FORMFOOTER.js",
                "~/Scripts/icarus/model/el/container/form/FORMPOST.js",
                "~/Scripts/icarus/model/el/container/form/FORM.js",

                // Custom Forms
                "~/Scripts/icarus/model/el/container/form/forms/LogoutForm.js",

                // Main
                "~/Scripts/icarus/model/el/container/main/dictionary/DICTIONARY.js",
                "~/Scripts/icarus/model/el/container/main/dictionary/word/WORD.js",
                "~/Scripts/icarus/model/el/container/main/chat/CHAT.js",
                "~/Scripts/icarus/model/el/container/main/article/section/SECTION.js",
                "~/Scripts/icarus/model/el/container/main/article/ARTICLE.js",
                "~/Scripts/icarus/model/el/container/main/MAIN.js"
            ));
        }
    }
}