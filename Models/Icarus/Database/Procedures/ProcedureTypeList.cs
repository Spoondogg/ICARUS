using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ICARUS.Models {

    /// <summary>
    /// A list of stored procedure types.  
    /// The type determines how the values returned by the procedure will be displayed in its view
    /// </summary>
    public class ProcedureTypeList: List<SelectListItem> {

        public ProcedureTypeList() {
            this.Add(new SelectListItem { Value = "1", Text = "Table" });
            this.Add(new SelectListItem { Value = "2", Text = "Chart - Bar" });
            this.Add(new SelectListItem { Value = "3", Text = "Chart - Line" });
        }
    }


}