using ICARUS.Models.Icarus;
using ICARUS.Models.Icarus.Elements;
using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Linq;
using System.Web;
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

        }

        /// <summary>
        /// Constructs an empty form group
        /// </summary>
        public FieldSet(FormPost formPost) : base("FIELDSET", new MODEL()) {

        }
    }
}