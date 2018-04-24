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
    public class HEADERWRAP : JUMBOTRON {

        /// <summary>
        /// Jumbotron with image and header
        /// </summary>
        /// <param name="attributes"></param>
        public HEADERWRAP() : base() {
            this.label = "HEADERWRAP";
            this.attributes["class"] += " headerwrap";
        }

        /// <summary>
        /// Constructs an ARTICLE with the given id and label attributes already set
        /// </summary>
        /// <param name="formPost"></param>
        public HEADERWRAP(FormPost formPost) : base(formPost) {

        }
    }
}