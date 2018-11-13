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
    public class FORMELEMENT : Container {
        /// <summary>
        /// Generic FORMELEMENT Constructor for Entity
        /// </summary>
        public FORMELEMENT() : base("DIV", new MODEL() {
            label = "FORMELEMENT"
        }) {

        }
        /// <summary>
        /// Constructs an FORMELEMENT with the given id and label attributes already set
        /// </summary>
        /// <param name="formPost"></param>
        public FORMELEMENT(FormPost formPost) : base("FORMELEMENT", formPost) {

        }
    }
}