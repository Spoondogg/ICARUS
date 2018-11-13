using ICARUS.Models.Icarus;
using ICARUS.Models.Icarus.Elements;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Web.Mvc;
namespace ICARUS.Models {
    /// <summary>
    /// A Form Input
    /// </summary>
    public class FORMINPUT : Container {
        /// <summary>
        /// Generic FORMINPUT Constructor for Entity
        /// </summary>
        public FORMINPUT() : base("DIV", new MODEL() {
            label = "FORMINPUT"
        }) {

        }
        /// <summary>
        /// Constructs an FORMINPUT with the given id and label attributes already set
        /// </summary>
        /// <param name="formPost"></param>
        public FORMINPUT(FormPost formPost) : base("FORMINPUT", formPost) {

        }
    }
}