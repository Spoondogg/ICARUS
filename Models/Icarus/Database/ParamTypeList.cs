using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ICARUS.Models {
    public class ParamTypeList: List<SelectListItem> {

        public ParamTypeList() {
            this.Add(new SelectListItem { Value = "1", Text = "String" });
            this.Add(new SelectListItem { Value = "2", Text = "Integer" });
            this.Add(new SelectListItem { Value = "3", Text = "Date" });
            this.Add(new SelectListItem { Value = "4", Text = "DateTime" });
            this.Add(new SelectListItem { Value = "5", Text = "Float" });
            this.Add(new SelectListItem { Value = "6", Text = "Function" });
        }
    }
}