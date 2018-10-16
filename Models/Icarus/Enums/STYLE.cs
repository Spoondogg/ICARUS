using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Enums {

    public class STYLE {

        public Dictionary<String, String> DISPLAY;

        public STYLE() {
            this.DISPLAY = new Dictionary<String, String>();
            this.DISPLAY.Add("DEFAULT", "block");
            this.DISPLAY.Add("BLOCK", "block");
            this.DISPLAY.Add("NONE", "none");
        }

    }
}