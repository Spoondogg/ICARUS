using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Elements {

    /// <summary>
    /// A high level view of objects belonging to this user
    /// </summary>
    public class FORMPOSTINDEX : Container {

        public Dictionary<string, int> containers { get; set; }
        
        /// <summary>
        /// A wide header that often contains a background image and heading
        /// </summary>
        /// <param name="attributes"></param>
        public FORMPOSTINDEX() : base("DIV", new MODEL() {
            label = "FORMPOSTINDEX"
        }) {
            this.containers = new Dictionary<string, int>(); // List<string>();
        }

        /// <summary>
        /// Constructs a CONTAINERINDEX with the given id and label attributes already set
        /// </summary>
        /// <param name="formPost"></param>
        public FORMPOSTINDEX(FormPost formPost) : base("FORMPOSTINDEX", formPost) {

        }
    }
}