using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Elements {

    /// <summary>
    /// Represents a horizontal line that seperates groupings inside of a dropdown menu
    /// </summary>
    public class NAVSEPARATOR : NAVITEM {

        /// <summary>
        /// Constructs a list item (LI) to be added to a list (UL > LI)
        /// </summary>
        /// <param name="attributes"></param>
        /// <param name="label">The text to be displayed within the LI tags</param>
        public NAVSEPARATOR() : base() {
            this.attributes.Add("role", "separator");
            this.attributes.Add("class", "divider");
        }
    }
}