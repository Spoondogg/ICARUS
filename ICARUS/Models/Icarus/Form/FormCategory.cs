using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ICARUS.Models {

    /// <summary>
    /// A form category is used to filter groups, elements and options
    /// </summary>
    public class FormCategory {

        public int id { get; set; }

        [StringLength(128, MinimumLength = 3), Required]
        public string authorId { get; set; }

        [StringLength(128, MinimumLength = 3), Required]
        public string label { get; set; }

    }

}