using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Elements {

    /// <summary>
    /// A generic List element object
    /// </summary>
    public class List : Container {

        /// <summary>
        /// A Collection of List Items
        /// </summary>
        /// <param name="attributes"></param>
        public List() : base("UL", new MODEL() {
            label = "LIST"
        }) {
            this.className = "LIST";
        }

        /// <summary>
        /// Constructs a LIST with the given id and label attributes already set
        /// </summary>
        /// <param name="formPost"></param>
        public List(FormPost formPost) : base("UL", formPost) {

        }
    }
}