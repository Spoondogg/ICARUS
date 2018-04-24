using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Elements {

    /// <summary>
    /// A SECTION of an ARTICLE, each SECTION has a collapsable HEADER
    /// and a TEXTBLOCK 
    /// </summary>
    public class Section : Container {

        /// <summary>
        /// An article is the basic building block for nearly all pages.  
        /// Articles are made up of a collection of SECTIONS
        /// </summary>
        /// <param name="attributes"></param>
        public Section() : base("SECTION", new MODEL() {
            label = "SECTION"
        }) {

        }

        /// <summary>
        /// Construct a SECTION based on the provided Form Post
        /// </summary>
        /// <param name="formPost"></param>
        public Section(FormPost formPost) : base("SECTION", formPost) {

        }
    }
}