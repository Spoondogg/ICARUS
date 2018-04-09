﻿using ICARUS.Models.Icarus;
using ICARUS.Models.Icarus.Elements;
using ICARUS.Models.Icarus.Elements.Attributes;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Web.Mvc;

namespace ICARUS.Models {

    /// <summary>
    /// A Form Element (INPUT, SELECT etc)
    /// </summary>
    public class Input : FormElement {
        /// <summary>
        /// Generic FormElement Constructor for Entity
        /// </summary>
        public Input() : base() {
            this.element = "INPUT";
            this.label = "INPUT";
            this.attributes.Add("name", "woot");
            this.attributes.Add("value", "woot");
        }

        /// <summary>
        /// Constructs an FormElement with the given id and label attributes already set
        /// </summary>
        /// <param name="formPost"></param>
        public Input(FormPost formPost) : base(formPost) {

        }
    }
}