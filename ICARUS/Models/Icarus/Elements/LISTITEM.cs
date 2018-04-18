using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Elements {

    /// <summary>
    /// Represents a generic LI element
    /// </summary>
    public class LISTITEM : EL {

        /// <summary>
        /// Constructs a list item (LI) to be added to a list (UL > LI)
        /// </summary>
        /// <param name="attributes"></param>
        /// <param name="label">The text to be displayed within the LI tags</param>
        public LISTITEM(string label = null, MODEL model = null) : base("LI", model) {
            this.className = "LISTITEM";
        }
    }
}