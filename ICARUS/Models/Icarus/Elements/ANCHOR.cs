using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Elements {

    /// <summary>
    /// Represents an html anchor A HREF 
    /// </summary>
    public class ANCHOR : EL {

        /// <summary>
        /// Constructs a generic HREF anchor
        /// </summary>
        /// <param name="model"></param>
        /// <param name="innerHtml">The text to be displayed within the ANCHOR tags</param>
        public ANCHOR(
            MODEL model, string innerHtml
        ) : base("A", model, innerHtml) {
            this.className = "ANCHOR";
        }
    }
}