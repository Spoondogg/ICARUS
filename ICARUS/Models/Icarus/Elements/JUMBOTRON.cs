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
    public class JUMBOTRON : Container {

        /// <summary>
        /// If specified, this element will use the following Url for its background image
        /// </summary>
        public string backgroundUrl;

        /// <summary>
        /// Header text used in this jumbotron
        /// </summary>
        public string header;

        /// <summary>
        /// Body paragraph used in this jumbotron
        /// </summary>
        public string text;

        /// <summary>
        /// An article is the basic building block for nearly all pages.  
        /// Articles are made up of a collection of SECTIONS
        /// </summary>
        /// <param name="attributes"></param>
        public JUMBOTRON() : base("JUMBOTRON", new MODEL(new ATTRIBUTES("jumbotron")) {
            label = "JUMBOTRON"
        }) {
            this.className = "JUMBOTRON";
        }

        /// <summary>
        /// Constructs an ARTICLE with the given id and label attributes already set
        /// </summary>
        /// <param name="formPost"></param>
        public JUMBOTRON(FormPost formPost) : base("JUMBOTRON", formPost) {

        }
    }
}