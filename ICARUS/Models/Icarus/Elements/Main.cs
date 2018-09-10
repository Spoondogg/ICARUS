using ICARUS.Models.Icarus.Elements;
using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus {

    /// <summary>
    /// The APP object in bound to the DOM document.body.  
    /// The APP contains a collection of ARTICLES and a NAVBAR to navigate them
    /// </summary>
    public class MAIN : Container {

        /// <summary>
        /// The application's MAIN Container
        /// </summary>
        public MAIN() : base("MAIN", new MODEL() {
            label = "MAIN"
        }) {

        }

        /// <summary>
        /// An Application data structure
        /// </summary>
        /// <param name="id"></param>
        /// <param name="version"></param>
        /// <param name="name"></param>
        public MAIN(FormPost formPost) : base("MAIN", formPost) {

        }
    }
}