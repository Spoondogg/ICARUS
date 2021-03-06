﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Elements {

    /// <summary>
    /// A dropdown type data structure
    /// </summary>
    public class DROPDOWN : NavItem {

        /// <summary>
        /// A list of items in this dropdown menu
        /// </summary>
        public List menu;

        /// <summary>
        /// Constructs a list item to be added to a list
        /// </summary>
        /// <param name="attributes"></param>
        /// <param name="label">The text to be displayed within the LI tags</param>
        public DROPDOWN() : base() {
            this.className = "DROPDOWN";
            this.attributes.Add("class", "dropdown");            
        }

        /// <summary>
        /// Constructs a list item to be added to a list
        /// </summary>
        /// <param name="attributes"></param>
        /// <param name="label">The text to be displayed within the LI tags</param>
        public DROPDOWN(FormPost formPost) : base(formPost) {
            this.className = "DROPDOWN";
            this.attributes.Add("class", "dropdown");
        }

        /// <summary>
        /// Constructs a list item to be added to a list
        /// </summary>
        /// <param name="attributes"></param>
        /// <param name="label">The text to be displayed within the LI tags</param>
        public DROPDOWN(string label, Boolean alignRight = false) : base(label, "#") {
            this.attributes.Add("class", "dropdown");
            if (alignRight) {
                this.attributes.Add("data-align", "right");
            }
            this.className = "DROPDOWN";
        }

        /// <summary>
        /// Adds a dropdown nav item to the navigation
        /// </summary>
        public void addNavDropdown(string label) {
            this.addChild(new DROPDOWN(label));
        }
    }
}