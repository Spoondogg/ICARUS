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
    public class CLASSVIEWER : Container {
        /// <summary>
        /// A wide header that often contains a background image and heading
        /// </summary>
        /// <param name="attributes"></param>
        public CLASSVIEWER() : base("DIV", new MODEL() {
            label = "CLASSVIEWER"
        }) {

        } 

        /// <summary>
        /// Constructs an ARTICLE with the given id and label attributes already set
        /// </summary>
        /// <param name="formPost"></param>
        public CLASSVIEWER(FormPost formPost) : base("CLASSVIEWER", formPost) {

        }
    }
}