using ICARUS.Models.Icarus.ColumnLists;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Schemas {

    /// <summary>
    /// An OTL Schema
    /// </summary>
    public class sch_OTL : IcarusSchema {

        /// <summary>
        /// Constructs a generic OTL schema
        /// </summary>
        public sch_OTL() : base("OTL") {
            this.addTable(new IcarusTable("tbl_OTL_Hours", new ArrayList()));
            this.addTable(new IcarusTable("tbl_OTL_HoursNFT", new ArrayList()));
            this.addTable(new IcarusTable("tbl_OTL_HourTypes", new ArrayList()));
        }
    }
}