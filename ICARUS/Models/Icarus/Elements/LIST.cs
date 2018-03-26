using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Elements {

    /// <summary>
    /// A series of html 5 compatible list types
    /// </summary>
    enum ListTypes { UL, OL };

    /// <summary>
    /// A generic List element object
    /// </summary>
    public class LIST : EL {

        /// <summary>
        /// Lists can be Unorganized (UL) or Organized (OL)
        /// </summary>
        private string type;

        /// <summary>
        /// Construct a generic list element
        /// </summary>
        /// <param name="listType"></param>
        /// <param name="model"></param>
        public LIST(string listType, MODEL model) : base("UL", model) {
            
        }

        /// <summary>
        /// Adds a List Item to the list
        /// </summary>
        /// <param name="child"></param>
        public void addListItem(LISTITEM child) {
            this.children.Add(child);
        }

    }
}