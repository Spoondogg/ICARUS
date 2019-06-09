using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Elements {

    /// <summary>
    /// Represents table data column
    /// </summary>
    public class TD : Container {

        /// <summary>
        /// An TD   
        /// </summary>
        /// <param name="attributes"></param>
        public TD() : base("TD", new MODEL() {
            label = "TD"
        }) {

        }

        /// <summary>
        /// Construct a TD based on the provided Form Post
        /// </summary>
        /// <param name="formPost"></param>
        public TD(FormPost formPost) : base("TD", formPost) {

        }
    }
}