using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Elements {

    /// <summary>
    /// A generic List element object
    /// </summary>
    public class MenuList : Container {

        /// <summary>
        /// A Collection of List Items
        /// </summary>
        /// <param name="attributes"></param>
        public MenuList() : base("DIV", new MODEL() {
            label = "MENULIST"
        }) {
            this.className = "MENULIST";
        }

        /// <summary>
        /// Constructs a LIST with the given id and label attributes already set
        /// </summary>
        /// <param name="formPost"></param>
        public MenuList(FormPost formPost) : base("DIV", formPost) {

        }
    }
}