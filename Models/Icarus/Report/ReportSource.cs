using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ICARUS.Models {
    public class ReportSource {

        public int id { get; set; }

        [StringLength(128, MinimumLength = 3), Required]
        public string authorId { get; set; }

        [Required, Display(Name = "Source")]
        public string source { get; set; }

    }
}