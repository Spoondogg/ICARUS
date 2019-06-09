using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Elements {

    /// <summary>
    /// Represents a table footer
    /// </summary>
    public class TFOOT : Container {

        /// <summary>
        /// An article is the basic building block for nearly all pages.  
        /// Articles are made up of a collection of SECTIONS
        /// </summary>
        /// <param name="attributes"></param>
        public TFOOT() : base("TFOOT", new MODEL() {
            label = "TFOOT"
        }) {

        }

        /// <summary>
        /// Construct a TFOOT based on the provided Form Post
        /// </summary>
        /// <param name="formPost"></param>
        public TFOOT(FormPost formPost) : base("TFOOT", formPost) {

        }
    }
}