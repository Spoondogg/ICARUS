using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Elements.Attributes {

    /// <summary>
    /// An abstract ATTRIBUTES object that can be extended for various element types
    /// </summary>
    public class ATTRIBUTES : Dictionary<string, Object> {

        /// <summary>
        /// Constructs a generic Attribute object
        /// </summary>
        /// <param name="className"></param>
        public ATTRIBUTES(
            string className = null 
            //string name = null, 
            //string type = null,
            //string value = null
        ) {
            if (className != null) { this.Add("class", className); }
        }
    }
}