using ICARUS.Models.Icarus.ColumnLists;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Schemas {

    /// <summary>
    /// An EzCare schema based on CRMRPT feeds
    /// </summary>
    public class sch_EZCARE : IcarusSchema {

        /// <summary>
        /// Constructs a generic EzCare schema
        /// </summary>
        public sch_EZCARE() : base("EZCARE") {
            this.addTable(new IcarusTable("tbl_EzCare", new ArrayList()));
            this.addTable(new IcarusTable("tbl_CourierInfo", new ArrayList()));
            this.addTable(new IcarusTable("tbl_Customer", new ArrayList()));
        }
    }
}