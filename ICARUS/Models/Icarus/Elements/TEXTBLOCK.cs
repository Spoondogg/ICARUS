using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Elements {

    /// <summary>
    /// A block of text
    /// and a TEXTBLOCK 
    /// </summary>
    public class TEXTBLOCK : EL {

        /// <summary>
        /// A label that marks the beginning of this text block
        /// </summary>
        public string label;

        /// <summary>
        /// A block that can contain rich text 
        /// </summary>
        /// <param name="model"></param>
        /// <param name="label"></param>
        /// <param name="collapsed">If true, the section will initially be collapsed</param>
        public TEXTBLOCK(MODEL model, string label) : base("TEXTBLOCK", model) {
            this.label = label;     
        }        
    }
}