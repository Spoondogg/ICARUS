using ICARUS.Models.Icarus.Elements;
using System;
using System.Collections.Generic;
using System.Web.Mvc;

namespace ICARUS.Models.Icarus {
    

    /// <summary>
    /// An Icarus Form Group Object 
    /// </summary>
    public class FORMELEMENTGROUP : Container {

        /// <summary>
        /// A list of Form Elements contained within this form-group (ie: input > type:list)
        /// </summary>
        //public List<IcarusFormElement> elements;
        

        /// <summary>
        /// Generic Fieldset Constructor for Entity
        /// </summary>
        public FORMELEMENTGROUP() : base("FORMELEMENTGROUP", new MODEL() {
            label = "FORMELEMENTGROUP"
        }) {

        }

        /// <summary>
        /// Constructs an ARTICLE with the given id and label attributes already set
        /// </summary>
        /// <param name="formPost"></param>
        public FORMELEMENTGROUP(FormPost formPost) : base("FORMELEMENTGROUP", formPost) {

        }
    }
}