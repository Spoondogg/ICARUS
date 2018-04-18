using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Elements {

    /// <summary>
    /// A Bootstrap 3 Navigation Bar
    /// </summary>
    public class NAVBAR : EL {

        /*
        /// <summary>
        /// The text brand name shown in the top left corner of the navigation bar
        /// </summary>
        public string label;
        */

        /// <summary>
        /// A collection of NAVITEMS that appear from left to right in the navBar
        /// </summary>
        public List<NAVITEM> navLeft;

        /// <summary>
        /// A collection of NAVITEMS that appear under the OPTIONS panel
        /// </summary>
        public List<NAVITEM> navRight;

        /// <summary>
        /// Constructs a navigation bar
        /// </summary>
        /// <param name="attributes"></param>
        public NAVBAR(
            Boolean isFixed = false, Boolean isInverted = false
        ) : base("NAV", new MODEL()) {

            string className = "navbar";
            className += (isFixed) ? " navbar-fixed-top" : " navbar-nav";
            className += (isInverted) ? " navbar-inverse" : "";
            this.attributes.Add("class", className);

            //this.label = label;
            this.navLeft = new List<NAVITEM>();
            this.navRight = new List<NAVITEM>();

            this.className = "NAVBAR";
        }
    }
}