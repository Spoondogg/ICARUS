using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus {

    /// <summary>
    /// A Generic Database View 
    /// </summary>
    public class IcarusView : IcarusTable {

        /// <summary>
        /// Constructs a view of table data
        /// </summary>
        /// <param name="name"></param>
        /// <param name="columns"></param>
        public IcarusView(string name, ArrayList columns) : base(name, columns) {

        }

    }
}