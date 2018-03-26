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
    public class JUMBOTRON : EL {

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
        /// A large banner element
        /// </summary>
        /// <param name="header"></param>
        /// <param name="text"></param>
        public JUMBOTRON(string header, string text, string backgroundUrl = null) : base("JUMBOTRON", new MODEL(new ATTRIBUTES("jumbotron"))) {
            this.backgroundUrl = backgroundUrl;
            this.header = header;
            this.text = text;
        }
    }
}