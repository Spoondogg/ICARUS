using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Enums {

    public class ICON : Dictionary<String, String> {
        
        public ICON() {
            this.Add("CHEVRON_UP", "glyphicon-chevron-up");
            this.Add("CHEVRON_DOWN", "glyphicon-chevron-down");
            this.Add("PENCIL", "glyphicon-pencil");
            this.Add("ARROW_UP", "glyphicon-arrow-up");
            this.Add("ARROW_DOWN", "glyphicon-arrow-down");
            this.Add("LOCK", "glyphicon-lock");
            this.Add("COG", "glyphicon-cog");
            this.Add("PLUS", "glyphicon-plus");
            this.Add("SAVE", "glyphicon-save");
            this.Add("DELETE", "glyphicon-minus");
            this.Add("LOAD", "glyphicon-open-file");
            this.Add("UP", "glyphicon-triangle-top");
            this.Add("DOWN", "glyphicon-triangle-bottom");
        }
    }
}