using ICARUS.Models.Icarus.Schemas;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Databases {

    /// <summary>
    /// A Database Model based on Icarus applications
    /// </summary>
    public class db_CEIA : IcarusDatabase {

        /// <summary>
        /// Constructs an instance of an Icarus Database
        /// </summary>
        /// <param name="name"></param>
        public db_CEIA(string name) : base(name) {
            this.addSchema(new IcarusSchema("CEIA"));
            this.addSchema(new sch_LOG());
        }
    }
}