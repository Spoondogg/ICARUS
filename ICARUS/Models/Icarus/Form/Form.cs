using ICARUS.Models.Icarus;
using ICARUS.Models.Icarus.Elements;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ICARUS.Models.Icarus.Elements.Attributes;

namespace ICARUS.Models {

    /// <summary>
    /// A generic Icarus Form.  Icarus Forms are used to collect abstract data objects
    /// that may need to be transformed into tables or accessed via XQuery
    /// </summary>
    public class Form : Container {

        /// <summary>
        /// Generic Form Constructor
        /// </summary>
        public Form() : base("FORM", new MODEL() {
            label = "FORM"
        }) {

        }

        /// <summary>
        /// Generic Form Constructor
        /// </summary>
        public Form(FormPost formPost) : base("FORM", formPost) {
            //this.label = formPost.getXml().GetElementsByTagName("Label")[0].InnerText;
            //this.subsections = formPost.getXml().GetElementsByTagName("SubSections")[0].InnerText;
        }

        /// <summary>
        /// Loads the given state into this form
        /// TODO: Create this method
        /// </summary>
        private void loadPost(FormPost formPost) {
            // Not yet implemented
            // Somehow you need to iterate through each IcarusFormGroup and determine if the respective FORM INPUT
            // exists.  If it does, set its value to the key/value within the FormPost
        }
    }    
}