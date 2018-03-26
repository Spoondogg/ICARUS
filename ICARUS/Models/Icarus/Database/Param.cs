using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Web.Mvc;

namespace ICARUS.Models {

    //enum paramType { String, Integer, Float, Text, Date, DateTime, XML };

    /// <summary>
    /// A parameter that is passed to a stored procedure (IcarusProcedure)
    /// </summary>
    public class Param {

        public int id { get; set; }

        [Range(0, int.MaxValue)]
        public int type { get; set; }

        [StringLength(128, MinimumLength = 3), Required]
        public string name { get; set; }

        [StringLength(128)]
        public string value { get; set; }

        [Range(0, int.MaxValue)]
        public int procedureId { get; set; }

        [NotMapped]
        public IEnumerable<SelectListItem> types { get; set; }

        [NotMapped]
        public IEnumerable<SelectListItem> procedures { get; set; }        

    }
}