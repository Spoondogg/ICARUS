using ICARUS.Models.Icarus;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models {

    /// <summary>
    /// A Database Schema
    /// </summary>
    public class IcarusSchema {

        /// <summary>
        /// The unique name used to identify the schema
        /// </summary>
        private String name;

        /// <summary>
        /// A collection of tables that are contained within this schema
        /// </summary>
        private Dictionary<String, IcarusTable> tables;

        private Dictionary<String, IcarusView> views;

        private Dictionary<String, IcarusProcedure> procedures;

        // TODO: private Dictionary<String, IcarusFunction> functions;
        
        /// <summary>
        /// Constructs a generic schema to be added to a database
        /// </summary>
        /// <param name="name"></param>
        public IcarusSchema(String name) {
            this.name = name;
            this.tables = new Dictionary<String, IcarusTable>();
        }

        public string getName() {
            return this.name;
        }

        public void addTable(IcarusTable table) {
            this.tables.Add(table.getName(), table);
        }

    }
}