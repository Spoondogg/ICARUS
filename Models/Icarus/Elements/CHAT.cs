using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Elements {

    /// <summary>
    /// A Chat Window
    /// </summary>
    public class CHAT : Container {

        /// <summary>
        /// A Chat Window
        /// </summary>
        /// <param name="attributes"></param>
        public CHAT() : base("CHAT", new MODEL() {
            label = "CHAT"
        }) {

        }

        /// <summary>
        /// Construct a CHAT based on the provided Form Post
        /// </summary>
        /// <param name="formPost"></param>
        public CHAT(FormPost formPost) : base("CHAT", formPost) {

        }
    }
}