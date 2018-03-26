using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models {

    /// <summary>
    /// A generic Database object
    /// </summary>
    public class IcarusDatabase {

        /// <summary>
        /// The database name
        /// </summary>
        private String name;

        /// <summary>
        /// The name of the server that hosts this database
        /// ie: AADMSCEIA1\DEV2
        /// </summary>
        private String serverName;

        /// <summary>
        /// A collection of schemas that exist in this database
        /// </summary>
        private Dictionary<String, IcarusSchema> schemas;

        /// <summary>
        /// Constructs a generic Icarus Database Object
        /// </summary>
        /// <param name="name"></param>
        public IcarusDatabase(String name) {
            this.name = name;
            this.schemas = new Dictionary<String, IcarusSchema>();
        }

        /// <summary>
        /// Adds a schema to the database
        /// </summary>
        /// <param name="schema"></param>
        public void addSchema(IcarusSchema schema) {
            this.schemas.Add(schema.getName(), schema);
        }

        /// <summary>
        /// Retrieves the specified schema from the database
        /// </summary>
        /// <param name="name"></param>
        /// <returns></returns>
        public IcarusSchema getSchema(String name) {
            return this.schemas[name];
        }

        /// <summary>
        /// Sets the server host name/alias name 
        /// </summary>
        /// <param name="name"></param>
        private void setServerName(String name) {
            this.serverName = name;
        }

    }
}