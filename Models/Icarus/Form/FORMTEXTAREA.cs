using ICARUS.Models.Icarus;
using ICARUS.Models.Icarus.Elements;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Web.Mvc;
namespace ICARUS.Models {
    /// <summary>
    /// A Form Text Area
    /// </summary>
    public class FORMTEXTAREA : Container {
        /// <summary>
        /// Generic FORMTEXTAREA Constructor for Entity
        /// </summary>
        public FORMTEXTAREA() : base("DIV", new MODEL() {
            label = "FORMTEXTAREA"
        }) {

        }
        /// <summary>
        /// Constructs an FORMTEXTAREA with the given id and label attributes already set
        /// </summary>
        /// <param name="formPost"></param>
        public FORMTEXTAREA(FormPost formPost) : base("FORMTEXTAREA", formPost) {

        }
    }
}