using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Elements {

    /// <summary>
    /// A Bootstrap Greywrap is a large banner style element, typically 
    /// located at the top of the page that contains a series of callouts
    /// </summary>
    public class BANNER : Container {

        /// <summary>
        /// Jumbotron with image and header
        /// </summary>
        /// <param name="attributes"></param>
        public BANNER() : base("DIV", new MODEL()) {
            this.label = "BANNER";
        }

        /// <summary>
        /// Constructs an ARTICLE with the given id and label attributes already set
        /// </summary>
        /// <param name="formPost"></param>
        public BANNER(FormPost formPost) : base("DIV", formPost) {

        }
    }
}