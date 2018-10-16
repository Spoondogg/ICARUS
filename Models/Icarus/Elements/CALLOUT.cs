using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Elements {

    /// <summary>
    /// A Bootstrap CALLOUT contains an icon, a header and a paragraph
    /// </summary>
    public class CALLOUT : Container {

        /// <summary>
        /// Jumbotron with image and header
        /// </summary>
        /// <param name="attributes"></param>
        public CALLOUT() : base("DIV", new MODEL()) {
            this.label = "CALLOUT";
        }

        /// <summary>
        /// Constructs an ARTICLE with the given id and label attributes already set
        /// </summary>
        /// <param name="formPost"></param>
        public CALLOUT(FormPost formPost) : base("DIV", formPost) {

        }
    }
}