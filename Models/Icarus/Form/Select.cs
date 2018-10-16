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
    public class Select : Container {

        /// <summary>
        /// Generic FormElement Constructor for Entity
        /// </summary>
        public Select() : base("SELECT", new MODEL() {
            label = "SELECT"
        }) {
            this.className = "SELECT";
        }

        /// <summary>
        /// Constructs an FormElement with the given id and label attributes already set
        /// </summary>
        /// <param name="formPost"></param>
        public Select(FormPost formPost) : base("SELECT", formPost) {

        }
    }
}