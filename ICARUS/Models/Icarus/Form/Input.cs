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
    public class FormInput : Container {

        /// <summary>
        /// Generic FormElement Constructor for Entity
        /// </summary>
        public FormInput() : base("INPUT", new MODEL() {
            label = "INPUT"
        }) {

        }

        /// <summary>
        /// Constructs an FormElement with the given id and label attributes already set
        /// </summary>
        /// <param name="formPost"></param>
        public FormInput(FormPost formPost) : base("INPUT", formPost) {

        }
    }
}