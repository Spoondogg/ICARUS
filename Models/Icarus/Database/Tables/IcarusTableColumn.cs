using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus {

    /// <summary>
    /// An enumerated list of Data Types that an IcarusTableColumn can contain
    /// </summary>
    enum DataTypes {
        String, Integer, Float, Decimal, Date, DateTime, Time, Xml
    };

    /// <summary>
    /// A Data Column that exists in a Database Table
    /// </summary>
    public class IcarusTableColumn {

        /// <summary>
        /// The unique name used to identify the column
        /// </summary>
        private String name;

        /// <summary>
        /// The column's data type.  This determines how the column value will be parsed/returned
        /// </summary>
        private String dataType;

        /// <summary>
        /// A generic value representing the column value.  
        /// Parsing rules are applied to this value upon GET/SET to ensure proper data typing
        /// </summary>
        private Object value;

        /// <summary>
        /// Constructs a Column to be added to a Database Table
        /// </summary>
        /// <param name="name"></param>
        /// <param name="dataType"></param>
        /// <param name="value"></param>
        public IcarusTableColumn(String name, String dataType, Object value) {
            this.name = name;
            this.dataType = dataType;
            this.value = value;
        }

        /// <summary>
        /// Constructs a Column to be added to a Database Table with no default value
        /// </summary>
        /// <param name="name"></param>
        /// <param name="dataType"></param>
        public IcarusTableColumn(string name, string dataType) {
            this.name = name;
            this.dataType = dataType;
        }

        /// <summary>
        /// Sets the value of the current column
        /// </summary>
        /// TODO Implement value testing
        /// <param name="value">
        /// The value to be assigned to the column, represented as a scalar.
        /// The value will undergo parsing to ensure that it can be correctly mapped.
        /// If the value cannot be assigned, an exception will be thrown
        /// </param>
        public void setValue(String value) {
            this.value = value;
        }

        /// <summary>
        /// Returns the scalar value contained within this column
        /// </summary>
        /// <returns></returns>
        public Object getValue() {
            return this.value;
        }
        
    }
}