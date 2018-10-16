using ICARUS.Models.Icarus.ColumnLists;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Schemas {

    /// <summary>
    /// A CARS Schema
    /// </summary>
    public class sch_CARS : IcarusSchema {

        /// <summary>
        /// Constructs a generic CARS schema
        /// </summary>
        public sch_CARS() : base("CARS") {
            this.addTable(new IcarusTable("tbl_CARS_MDMs", new ArrayList()));
            this.addTable(new IcarusTable("tbl_CARS_MDMs_ActDates", new ArrayList()));
            this.addTable(new IcarusTable("tbl_CARS_MDMs_SMP", new ArrayList()));
            this.addTable(new IcarusTable("tbl_CARS_STBs", new ArrayList()));
            this.addTable(new IcarusTable("tbl_CARS_STBs_ActDates", new ArrayList()));
        }
    }
}