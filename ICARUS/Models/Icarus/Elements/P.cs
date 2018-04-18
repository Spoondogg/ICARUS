using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Elements {

    /// <summary>
    /// A SECTION of an ARTICLE, each SECTION has a collapsable HEADER
    /// and a TEXTBLOCK 
    /// </summary>
    public class P : EL {

        /*
        /// <summary>
        /// A section of content that is loaded into an article
        /// </summary>
        /// <param name="model"></param>
        /// <param name="innerHtml"></param>
        public P(
            MODEL model, string innerHtml            
        ) : base("P", model, innerHtml) {
                      
        }
        */

        /// <summary>
        /// A section of content that is loaded into an article
        /// </summary>
        /// <param name="className"></param>
        /// <param name="innerHtml"></param>
        public P(string className = null, string innerHtml = "") : base(
            "P", new MODEL(new ATTRIBUTES(className)), innerHtml
        ) {
            this.className = "P";
        }
    }
}