using ICARUS.Models.Icarus;
using ICARUS.Models.Icarus.Elements;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Web.Mvc;

namespace ICARUS.Models {

    /// <summary>
    /// A Form Element (INPUT, SELECT etc)
    /// </summary>
    public class TextArea : FormElement {

        /// <summary>
        /// Generic FormElement Constructor for Entity
        /// </summary>
        public TextArea() : base() { 
            this.element = "TEXTAREA";
            this.label = "TEXTAREA";
            this.attributes.Add("name", "woot");
            this.attributes.Add("value", "woot");
        }

        /// <summary>
        /// Constructs an FormElement with the given id and label attributes already set
        /// </summary>
        /// <param name="formPost"></param>
        public TextArea(FormPost formPost) : base(formPost) {

        }
    }
}