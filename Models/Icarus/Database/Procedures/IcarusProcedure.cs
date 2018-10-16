using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus {
    public class IcarusProcedure {

        public int id { get; set; }
        public string authorId { get; set; }
        public string label { get; set; }
        //public List<Param> parameters { get; set; }

        /// <summary>
        /// Construct a Stored Procedure Object
        /// </summary>
        /// <param name="id"></param>
        /// <param name="authorId"></param>
        /// <param name="label"></param>
        public IcarusProcedure(int id, string authorId, string label) {
            this.id = id;
            this.authorId = authorId;
            this.label = label;
            //this.parameters = new List<Param>();
        }

        /// <summary>
        /// Adds a Parameter to the Procedure
        /// </summary>
        /// <param name="param"></param>
        //public void addParam(Param param) {
        //    this.parameters.Add(param);
        //}

    }
}