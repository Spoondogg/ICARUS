using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Elements {

    public class FOOTER : EL {

        /// <summary>
        /// A footer located at the bottom of a section
        /// </summary>
        /// <param name="label"></param>
        public FOOTER() : base("FOOTER", new MODEL(new ATTRIBUTES())) { //, label //string label
            this.className = "FOOTER";
        }
    }
}