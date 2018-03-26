using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.ColumnLists {

    /// <summary>
    /// A Column List that is used for common logging methods
    /// </summary>
    public class cl_LOG: IcarusTableColumnList {

        /// <summary>
        /// Constructs a collection of Table Columns to be used in a Logging Table
        /// </summary>
        public cl_LOG() {
            this.Add(new IcarusTableColumn("id", DataTypes.Integer.ToString()));
            this.Add(new IcarusTableColumn("timestamp", DataTypes.DateTime.ToString()));
            this.Add(new IcarusTableColumn("process", DataTypes.String.ToString()));
            this.Add(new IcarusTableColumn("step", DataTypes.String.ToString()));
            this.Add(new IcarusTableColumn("comment", DataTypes.String.ToString()));
        }

        

    }
}