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
    public class TBODY : Container {

        /// <summary>
        /// TBODY
        /// </summary>
        /// <param name="attributes"></param>
        public TBODY() : base("TBODY", new MODEL() {
            label = "TBODY"
        }) {

        }

        /// <summary>
        /// Construct a TBODY based on the provided Form Post
        /// </summary>
        /// <param name="formPost"></param>
        public TBODY(FormPost formPost) : base("TBODY", formPost) {

        }
    }
}