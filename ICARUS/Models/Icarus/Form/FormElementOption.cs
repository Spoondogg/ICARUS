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
    public class FormElementOption : Container {

        /// <summary>
        /// Generic Form Element Option Constructor for Entity
        /// </summary>
        public FormElementOption() : base("FORMELEMENTOPTION", new MODEL() {
            label = "FORMELEMENTOPTION"
        }) {

        }

        /// <summary>
        /// Constructs a Form Element Option with the given id and label attributes already set
        /// </summary>
        /// <param name="formPost"></param>
        public FormElementOption(FormPost formPost) : base("FORMELEMENTOPTION", formPost) {

        }
    }      
} 