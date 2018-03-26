using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Elements {

    /// <summary>
    /// A footer that is fixed to the bottom of the viewpane
    /// </summary>
    public class STICKYFOOTER : FOOTER {

        /// <summary>
        /// A footer located at the bottom of a section
        /// </summary>
        /// <param name="copy">Copywrite text</param>
        public STICKYFOOTER(string copy) : base(copy) {
            this.attributes.Add("class", "stickyfooter");
        }
    }
}