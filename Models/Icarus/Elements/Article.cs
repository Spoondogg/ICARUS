using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Elements {

    /// <summary>
    /// An ARTICLE is a top level container for an APP
    /// Treat ARTICLE(s) like tabs in a web browser
    /// </summary>
    public class ARTICLE : Container {

        /// <summary>
        /// An article is the basic building block for nearly all pages.  
        /// Articles are made up of a collection of SECTIONS
        /// </summary>
        /// <param name="attributes"></param>
        public ARTICLE() : base("ARTICLE", new MODEL(){
            label = "ARTICLE"
        }) {

        }
        
        /// <summary>
        /// Constructs an ARTICLE with the given id and label attributes already set
        /// </summary>
        /// <param name="formPost"></param>
        public ARTICLE(FormPost formPost) : base("ARTICLE", formPost) {
            
        }
    }
}