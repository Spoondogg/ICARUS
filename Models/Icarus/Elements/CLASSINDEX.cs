using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Elements {

    /// <summary>
    /// A high level view of objects belonging to this user
    /// </summary>
    public class CLASSINDEX : Container {

        public Dictionary<string, int> containers { get; set; }
        
        /// <summary>
        /// A wide header that often contains a background image and heading
        /// </summary>
        /// <param name="attributes"></param>
        public CLASSINDEX() : base("DIV", new MODEL() {
            label = "CLASSINDEX"
        }) {
            this.containers = new Dictionary<string, int>(); // List<string>();
        } 

        /// <summary>
        /// Constructs a CLASSINDEX with the given id and label attributes already set
        /// </summary>
        /// <param name="formPost"></param>
        public CLASSINDEX(FormPost formPost) : base("CLASSINDEX", formPost) {

        }
    }
}