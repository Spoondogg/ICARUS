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
    public class TH : Container {

        /// <summary>
        /// TH
        /// </summary>
        /// <param name="attributes"></param>
        public TH() : base("TH", new MODEL() {
            label = "TH"
        }) {

        }

        /// <summary>
        /// Construct a TH based on the provided Form Post
        /// </summary>
        /// <param name="formPost"></param>
        public TH(FormPost formPost) : base("TH", formPost) {

        }
    }
}