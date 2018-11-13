using ICARUS.Models.Icarus;
using ICARUS.Models.Icarus.Elements;
using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.RegularExpressions;
using System.Web.Mvc;
namespace ICARUS.Models {
    /// <summary>
    /// A INPUT Element (INPUT, SELECT etc)
    /// </summary>
    public class Input : FORMELEMENT {
        /// <summary>
        /// Generic INPUT Constructor for Entity
        /// </summary>
        public Input() : base() {
            this.element = "INPUT";
            this.label = "INPUT";
            this.className = "INPUT";
        }
        /// <summary>
        /// Constructs an INPUT with the given id and label attributes already set
        /// </summary>
        /// <param name="formPost"></param>
        public Input(FormPost formPost) : base(formPost) {

        }
    }
}