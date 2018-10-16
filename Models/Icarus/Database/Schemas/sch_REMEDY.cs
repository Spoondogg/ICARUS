using ICARUS.Models.Icarus.ColumnLists;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Schemas {

    /// <summary>
    /// A Big X schema based on PROD feeds
    /// </summary>
    public class sch_REMEDY : IcarusSchema {

        /// <summary>
        /// Constructs a generic Big X schema
        /// </summary>
        public sch_REMEDY() : base("REMEDY") {
            this.addTable(new IcarusTable("tbl_TAG", new ArrayList()));
            this.addTable(new IcarusTable("tbl_MRO", new ArrayList()));
            this.addTable(new IcarusTable("tbl_CTTS", new ArrayList()));
        }
    }
}