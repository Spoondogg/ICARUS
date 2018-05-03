using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Elements {

    /// <summary>
    /// An IFRAME is a top level container for a page to be loaded
    /// Treat ARTICLE(s) like tabs in a web browser
    /// </summary>
    public class IFRAME : Container {

        /// <summary>
        /// Represents an inline frame (iframe)
        /// </summary>
        /// <param name="attributes"></param>
        public IFRAME() : base("IFRAME", new MODEL(){
            label = "IFRAME"
        }) {

        }
        
        /// <summary>
        /// Constructs an IFRAME with the given id and label attributes already set
        /// </summary>
        /// <param name="formPost"></param>
        public IFRAME(FormPost formPost) : base("IFRAME", formPost) {
            
        }
    }
}