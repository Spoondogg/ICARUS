using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Elements {

    /// <summary>
    /// Represents a generic LI element
    /// </summary>
    public class ListItem : Container {

        /// <summary>
        /// Constructs a list item (LI) to be added to a list (UL > LI)
        /// </summary>
        /// <param name="attributes"></param>
        /// <param name="label">The text to be displayed within the LI tags</param>
        public ListItem() : base("LI", new MODEL(){
            label = "LISTITEM"
        }) {
            this.className = "LISTITEM";
        }

        /// <summary>
        /// Constructs an LISTITEM with the given id and label attributes already set
        /// </summary>
        /// <param name="formPost"></param>
        public ListItem(FormPost formPost) : base("LI", formPost) {

        }
    }
}