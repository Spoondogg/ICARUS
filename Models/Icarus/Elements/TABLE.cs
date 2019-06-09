using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Elements {

    /// <summary>
    /// Represents a table data-structure
    /// </summary>
    public class TABLE : Container {

        /// <summary>
        /// An article is the basic building block for nearly all pages.  
        /// Articles are made up of a collection of SECTIONS
        /// </summary>
        /// <param name="attributes"></param>
        public TABLE() : base("TABLE", new MODEL() {
            label = "TABLE"
        }) {

        }

        /// <summary>
        /// Construct a TABLE based on the provided Form Post
        /// </summary>
        /// <param name="formPost"></param>
        public TABLE(FormPost formPost) : base("TABLE", formPost) {

        }
    }
}