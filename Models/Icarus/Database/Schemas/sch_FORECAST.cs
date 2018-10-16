using ICARUS.Models.Icarus.ColumnLists;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Schemas {

    /// <summary>
    /// A Field Forecast schema
    /// </summary>
    public class sch_FORECAST : IcarusSchema {

        /// <summary>
        /// Constructs a generic EzCare schema
        /// </summary>
        public sch_FORECAST() : base("FORECAST") {
            this.addTable(new IcarusTable("tbl_Forecast", new ArrayList()));
            this.addTable(new IcarusTable("tbl_OperationalModel", new ArrayList()));
            this.addTable(new IcarusTable("tbl_Forecast", new ArrayList()));
        }
    }
}