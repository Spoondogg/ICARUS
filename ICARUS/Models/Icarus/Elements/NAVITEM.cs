using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Elements {

    /// <summary>
    /// Represents a Navigation button that appears within the nav bar.
    /// </summary>
    public class NavItem : ListItem {
        
        /// <summary>
        /// The url that this navitem references
        /// </summary>
        public ANCHOR anchor;

        /// <summary>
        /// Constructs a list item to be added to a list
        /// </summary>
        /// <param name="label">The text to be displayed within the LI tags</param>
        public NavItem() : base() {
            this.className = "NAVITEM";
            this.label = "NAVITEM";
            this.attributes.Add("href", "#");
            this.anchor = new ANCHOR(this, "NAVITEM");
        }

        /// <summary>
        /// Constructs a list item to be added to a list
        /// </summary>
        /// <param name="label">The text to be displayed within the LI tags</param>
        public NavItem(FormPost formPost) : base(formPost) {
            this.className = "NAVITEM";
            this.label = "NAVITEM";
            this.attributes.Add("href", "#");
            this.anchor = new ANCHOR(this, "NAVITEM");
        }

        // GET RID OF THIS WHEN POSSIBLE
        /// <summary>
        /// Constructs a list item to be added to a list
        /// </summary>
        /// <param name="label">The text to be displayed within the LI tags</param>
        public NavItem(string label = "NAVITEM", string url = "#") : base() {
            this.className = "NAVITEM";
            this.label = label;
            this.attributes.Add("href", url);
            this.anchor = new ANCHOR(this, label);
        }

        /// <summary>
        /// Adds a dropdown nav item to the navigation
        /// </summary>
        /// <param name="dropdown">The dropdown object to be added</param>
        public void addNavDropdown(DROPDOWN dropdown) {
            this.addChild(dropdown);
        }
    }
}