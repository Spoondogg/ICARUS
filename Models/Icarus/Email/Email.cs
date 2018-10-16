using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ICARUS.Models {

    /// <summary>
    /// A generic email object
    /// </summary>
    public class Email {
        [Required, Display(Name = "Your name")]
        public string fromName { get; set; }

        [Required, Display(Name = "Your email"), EmailAddress]
        public string fromEmail { get; set; }

        [Required, Display(Name = "Your subject")]
        public string subject { get; set; }

        [Required, Display(Name = "Recipient Email"), EmailAddress]
        public string toEmail { get; set; }

        [Required]
        public string message { get; set; }
    }
}