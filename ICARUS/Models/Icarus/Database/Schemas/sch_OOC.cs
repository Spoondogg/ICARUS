using ICARUS.Models.Icarus.ColumnLists;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Schemas {

    /// <summary>
    /// An Ontario One Call (OOC) Schema
    /// </summary>
    public class sch_OOC : IcarusSchema {

        /// <summary>
        /// Constructs a generic EzCare schema
        /// </summary>
        public sch_OOC() : base("OOC") {
            this.addTable(new IcarusTable("tbl_OOC", new ArrayList()));
            this.addTable(new IcarusTable("tbl_OOC_BillingDetails", new ArrayList()));
            this.addTable(new IcarusTable("tbl_OOC_MultiViewLocates", new ArrayList()));
        }
    }
}