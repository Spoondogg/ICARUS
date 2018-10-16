using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Databases {

    /// <summary>
    /// A Database Model based on Icarus applications
    /// </summary>
    public class db_Icarus : IcarusDatabase {

        /// <summary>
        /// Constructs an instance of an Icarus Database
        /// </summary>
        /// <param name="name"></param>
        public db_Icarus(string name) : base(name) {
            this.addSchema(new IcarusSchema("ICARUS"));
            this.addSchema(new IcarusSchema("LOG"));
        }
    }
}