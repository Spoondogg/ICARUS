using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Elements {

    /// <summary>
    /// A Paragraph
    /// </summary>
    public class PARAGRAPH : Container {

        /// <summary>
        /// PARAGRAPH
        /// </summary>
        /// <param name="attributes"></param>
        public PARAGRAPH() : base("P", new MODEL()) {
            this.label = "PARAGRAPH";
        }

        /// <summary>
        /// Constructs an PARAGRAPH with the given id and label attributes already set
        /// </summary>
        /// <param name="formPost"></param>
        public PARAGRAPH(FormPost formPost) : base("P", formPost) {

        }
    }
}