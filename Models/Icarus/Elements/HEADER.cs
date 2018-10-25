using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Elements {

    /// <summary>
    /// A Bootstrap Jumbotron is a large banner style element, typically 
    /// located at the top of the page.
    /// </summary>
    public class HEADER : EL {

        /// <summary>
        /// A footer located at the bottom of a section
        /// </summary>
        /// <param name="label"></param>
        public HEADER() : base("HEADER", new MODEL()) {
            this.className = "HEADER";
        }
    }
}