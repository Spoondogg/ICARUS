using ICARUS.Models.Icarus;
using ICARUS.Models.Icarus.Elements;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Web.Mvc;

namespace ICARUS.Models {

    /// <summary>
    /// An Option that appears in a form element
    /// </summary>
    public class Option : Container {

        /// <summary>
        /// Generic Form Element Option Constructor for Entity
        /// </summary>
        public Option() : base("OPTION", new MODEL() {
            label = "OPTION"
        }) {

        }

        /// <summary>
        /// Constructs a Form Element Option with the given id and label attributes already set
        /// </summary>
        /// <param name="formPost"></param>
        public Option(FormPost formPost) : base("OPTION", formPost) {

        }
    }      
} 