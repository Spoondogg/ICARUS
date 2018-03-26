using ICARUS.Models.Icarus.ColumnLists;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Schemas {

    /// <summary>
    /// A generic Index schema
    /// </summary>
    public class sch_IX : IcarusSchema {

        /// <summary>
        /// Constructs a generic Logging schema
        /// </summary>
        public sch_IX() : base("IX") {
            this.addTable(new IcarusTable("ix_City", new ArrayList()));
            // TODO: Implement this.addIndex();
        }
    }
}