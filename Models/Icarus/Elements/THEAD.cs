using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Elements {

    /// <summary>
    /// Represents a table header
    /// </summary>
    public class THEAD : Container {

        /// <summary>
        /// An article is the basic building block for nearly all pages.  
        /// Articles are made up of a collection of SECTIONS
        /// </summary>
        /// <param name="attributes"></param>
        public THEAD() : base("THEAD", new MODEL() {
            label = "THEAD"
        }) {

        }

        /// <summary>
        /// Construct a THEAD based on the provided Form Post
        /// </summary>
        /// <param name="formPost"></param>
        public THEAD(FormPost formPost) : base("THEAD", formPost) {

        }
    }
}