using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ICARUS.Models {
    public class Report {

        public int id { get; set; }

        [StringLength(128, MinimumLength = 3), Required]
        public string authorId { get; set; }

        [Required, Display(Name = "Report Name")]
        public string name { get; set; }

        [StringLength(128, MinimumLength = 3), Required]
        public string title { get; set; }

        [Required]
        public string description { get; set; }

        [Required, Display(Name = "Report Source")]
        public string reportSourceId { get; set; }

    }
}