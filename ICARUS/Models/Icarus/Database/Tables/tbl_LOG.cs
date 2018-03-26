using ICARUS.Models.Icarus.ColumnLists;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Tables {

    /// <summary>
    /// A generic Logging table 
    /// </summary>
    public class tbl_LOG : IcarusTable {

        /// <summary>
        /// Constructs a Logging table defined as "tbl_LOG" with
        /// generic columns
        /// </summary>
        public tbl_LOG() : base("tbl_LOG", new cl_LOG()) {

        }

    }
}