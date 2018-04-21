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
    /// A Form Element (INPUT, SELECT etc)
    /// </summary>
    public class Input : FormElement {

        /// <summary>
        /// Generic FormElement Constructor for Entity
        /// </summary>
        public Input() : base() {
            var guid = "INPUT_" + Guid.NewGuid();
            this.element = "INPUT";
            this.hasTab = 0;
            this.showHeader = 0; // temp
            this.label = guid;
            this.attributes.Add("name", guid);
            this.className = "INPUT";
        }

        /// <summary>
        /// Constructs an FormElement with the given id and label attributes already set
        /// </summary>
        /// <param name="formPost"></param>
        public Input(FormPost formPost) : base(formPost) {

        }
    }
}