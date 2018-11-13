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
    public class FIELDSET : Container {
        /// <summary>
        /// Constructs an empty fieldset
        /// </summary>
        public FIELDSET() : base("FIELDSET", new MODEL() {
            label = "FIELDSET"
        }) {
            
        }
        /// <summary>
        /// Constructs an empty fieldset
        /// </summary>
        /// <param name="formPost"></param>
        public FIELDSET(FormPost formPost) : base("FIELDSET", formPost) {

        }
    }
}