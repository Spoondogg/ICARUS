using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Elements {

    /// <summary>
    /// Represents a table row
    /// </summary>
    public class TR : Container {

        /// <summary>
        /// Table Row
        /// </summary>
        /// <param name="attributes"></param>
        public TR() : base("TR", new MODEL() {
            label = "TR"
        }) {

        }

        /// <summary>
        /// Construct a THEAD based on the provided Form Post
        /// </summary>
        /// <param name="formPost"></param>
        public TR(FormPost formPost) : base("TR", formPost) {

        }
    }
}