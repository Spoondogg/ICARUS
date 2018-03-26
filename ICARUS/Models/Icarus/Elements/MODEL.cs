﻿using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Reflection;
using System.Web;

namespace ICARUS.Models.Icarus.Elements {

    /// <summary>
    /// An Element Data Model
    /// </summary>
    public class MODEL { // : Dictionary<string, Object> {

        /// <summary>
        /// Unique Id for this element
        /// </summary>
        [Range(0, int.MaxValue)]
        public int id { get; set; }

        /// <summary>
        /// A collection of Attributes 
        /// </summary>
        [NotMapped]
        public ATTRIBUTES attributes;

        /// <summary>
        /// Optional label to be displayed
        /// </summary>
        [StringLength(128, MinimumLength = 3), Required]
        public string label { get; set; }

        /// <summary>
        /// Construct a generic MODEL
        /// </summary>
        /// <param name="attributes"></param>
        public MODEL(ATTRIBUTES attributes = null, string label = null) {
            this.attributes = attributes == null ? new ATTRIBUTES() : attributes;
            this.label = label == null ? "__NOLABEL" : label;
        }

        /// <summary>
        /// Add / Overide values in this dictionary with given values 
        /// </summary>
        /// <param name="obj"></param>
        public void set(Dictionary<string, Object> obj) {
            foreach (string key in obj.Keys) {
                //this.Add(key, obj[key]);
            }
        }
        
    }
}