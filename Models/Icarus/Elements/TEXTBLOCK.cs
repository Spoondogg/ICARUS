using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Elements {

    /// <summary>
    /// A block of text
    /// and a TEXTBLOCK 
    /// </summary>
    public class TEXTBLOCK : Container {

        /// <summary>
        /// An article is the basic building block for nearly all pages.  
        /// Articles are made up of a collection of SECTIONS
        /// </summary>
        /// <param name="attributes"></param>
        public TEXTBLOCK() : base("TEXTBLOCK", new MODEL() {
            label = "TEXTBLOCK"
        }) {
            this.className = "TEXTBLOCK";
        }

        /// <summary>
        /// Constructs an ARTICLE with the given id and label attributes already set
        /// </summary>
        /// <param name="formPost"></param>
        public TEXTBLOCK(FormPost formPost) : base("TEXTBLOCK", formPost) {

        }
    }
}