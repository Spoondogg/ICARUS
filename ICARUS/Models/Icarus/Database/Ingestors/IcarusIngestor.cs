using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus {

    /// <summary>
    /// A Generic Ingestor class
    /// </summary>
    public class IcarusIngestor {

        /// <summary>
        /// The type of ingestor (ie: SQL, CSV, XML etc)
        /// </summary>
        private String type;




        /// <summary>
        /// Constructs a generic Ingestor class
        /// </summary>
        /// <param name="name"></param>
        /// <param name="columns"></param>
        public IcarusIngestor(string name, ArrayList columns) {

        }

    }
}