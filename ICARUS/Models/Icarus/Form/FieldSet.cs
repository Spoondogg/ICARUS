using ICARUS.Models.Icarus;
using ICARUS.Models.Icarus.Elements;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Web.Mvc;

namespace ICARUS.Models {

    /// <summary>
    /// A fieldset is made up of form elements
    /// </summary>
    public class FieldSet : Container {

        /// <summary>
        /// Constructs an empty form group
        /// </summary>
        public FieldSet() : base("FIELDSET", new MODEL() {
            label = "FIELDSET"
        }) {
            this.className = "FIELDSET";
        }

        /// <summary>
        /// Constructs an empty form group
        /// </summary>
        /// <param name="formPost"></param>
        public FieldSet(FormPost formPost) : base("FIELDSET", formPost) {

        }
    }
}