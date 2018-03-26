using ICARUS.Models.Icarus.ColumnLists;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Schemas {

    /// <summary>
    /// An ICARUS schema
    /// </summary>
    public class sch_ICARUS : IcarusSchema {

        /// <summary>
        /// Constructs a generic Icarus schema
        /// </summary>
        public sch_ICARUS() : base("ICARUS") {
            //this.addTable(new IcarusTable("tbl_EzCare", new ArrayList()));
        }
    }
}