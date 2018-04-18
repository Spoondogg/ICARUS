using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Elements {

    /// <summary>
    /// A dropdown type data structure
    /// </summary>
    public class TAB : NAVITEM {

        /// <summary>
        /// A list of items in this dropdown menu
        /// </summary>
        public LIST menu;
        
        /// <summary>
        /// Constructs a list item to be added to a list
        /// </summary>
        /// <param name="attributes"></param>
        /// <param name="label">The text to be displayed within the LI tags</param>
        public TAB(string label, int articleId) : base(label, "#") {
            this.attributes.Add("class", "dropdown");
            this.attributes.Add("data-articleId", articleId);
            this.className = "TAB";
        }

        /// <summary>
        /// Adds a tab nav item to the navigation
        /// </summary>
        public void addNavTab(string label, int articleId) {
            this.addChild(new TAB(label, articleId));
        }
    }
}