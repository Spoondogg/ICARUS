using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus {

    /// <summary>
    /// A Generic Database Table
    /// </summary>
    public class IcarusTable {

        /// <summary>
        /// The name used to identify this table.
        /// </summary>
        private String name;

        /// <summary>
        /// An ordered list of Columns that belong to this table
        /// </summary>
        private List<IcarusTableColumn> columns;

        /// <summary>
        /// Constructs an Icarus Table Object
        /// </summary>
        /// <param name="name"></param>
        public IcarusTable(String name, ArrayList columns) {
            this.name = name;
            this.columns = new List<IcarusTableColumn>();
        }

        /// <summary>
        /// Returns the table name
        /// </summary>
        /// <returns></returns>
        public String getName() {
            return this.name;
        }

        /// <summary>
        /// Adds a column to the Table
        /// </summary>
        /// <param name="column"></param>
        public void addColumn(IcarusTableColumn column) {
            this.columns.Add(column);
        }
    }
}