using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Elements {

    /// <summary>
    /// A high level view of objects belonging to this user
    /// </summary>
    public class IMAGEGALLERY : Container {

        public Dictionary<string, int> containers { get; set; }

        // A list of container names
        //public List<string> containers;

        /// <summary>
        /// A wide header that often contains a background image and heading
        /// </summary>
        /// <param name="attributes"></param>
        public IMAGEGALLERY() : base("DIV", new MODEL() {
            label = "IMAGEGALLERY"
        }) {
            this.containers = new Dictionary<string, int>(); // List<string>();
        }

        /// <summary>
        /// Constructs an IMAGEGALLERY with the given id and label attributes already set
        /// </summary>
        /// <param name="formPost"></param>
        public IMAGEGALLERY(FormPost formPost) : base("IMAGEGALLERY", formPost) {

        }
    }
}