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
    public class FORM : Container {

        /// <summary>
        /// Generic Form Constructor
        /// </summary>
        public FORM() : base("FORM", new MODEL() {
            label = "FORM"
        }) {

        }

        /// <summary>
        /// Generic Form Constructor
        /// </summary>
        public FORM(FormPost formPost) : base("FORM", formPost) {

        }
    }    
}