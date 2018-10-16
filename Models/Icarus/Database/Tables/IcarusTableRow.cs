using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus {

    /// <summary>
    /// A generic row of data that exists within a table
    /// </summary>
    public class IcarusTableRow {

        /// <summary>
        /// An unique identifier for this row
        /// </summary>
        private int rowId;

        /// <summary>
        /// A collection of values that exist within this row, stored as scalar
        /// </summary>
        private String[] values;

        /// <summary>
        /// Constructs an empty row of data to be added to a table
        /// </summary>
        /// <param name="rowId"></param>
        public IcarusTableRow(int rowId) {
            this.rowId = rowId;
        }

        /// <summary>
        /// Constructs a row containing the supplied data to be added to a table
        /// </summary>
        /// <param name="rowId"></param>
        /// <param name="values"></param>
        public IcarusTableRow(int rowId, String[] values) {
            this.rowId = rowId;
            this.values = values;
        }

    }
}