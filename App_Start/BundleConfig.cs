using System.Web;
using System.Web.Optimization;

namespace ICARUS {
    /// <summary>
    /// Script bundles
    /// For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
    /// </summary>
    public class BundleConfig {        
        /// <summary>
        /// Server Side Bundling
        /// Build tasks should be ran through Gulp where possible
        /// </summary>
        /// <param name="bundles"></param>
        public static void RegisterBundles(BundleCollection bundles) {            
            /*
            bundles.Add(new ScriptBundle("~/bundles/scripts.js").Include(
                "~/Scripts/jquery/jquery-{version}.js"
            ));
            bundles.Add(new StyleBundle("~/Content/css/styles.css").Include(
                "~/Content/css/icarus/icarus.css"
            ));
            */
        }
    }
}