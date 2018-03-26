using ICARUS.Models.Icarus.ColumnLists;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Schemas {

    /// <summary>
    /// A generic LOGGING schema
    /// </summary>
    public class sch_LOG : IcarusSchema {

        /// <summary>
        /// Constructs a generic Logging schema
        /// </summary>
        public sch_LOG() : base("LOG") {
            this.addTable(new IcarusTable("LOG", new cl_LOG()));
        }
    }
}