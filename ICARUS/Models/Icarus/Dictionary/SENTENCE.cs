using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Dictionary {

    /// <summary>
    /// An ordered collection of WORDS
    /// </summary>
    public class SENTENCE : List<WORD> {

        /// <summary>
        /// Unique id for this post
        /// </summary>
        [Range(0, int.MaxValue)]
        public int id { get; set; }

        [Range(0, int.MaxValue)]
        public int typeId { get; set; } // Question, Statement, Opinion, Observation

        [Range(0, int.MaxValue)]
        public int wordCount { get; set; }

        [StringLength(128), Required]
        public String value { get; set; }

        /// <summary>
        /// A comma delimited list of subject/topic ids (ie: 1,2,3)
        /// </summary>
        [Required]
        public string subjects { get; set; }

        /// <summary>
        /// Collect words into a sentence
        /// </summary>
        /// <param name="words"></param>
        public SENTENCE(List<WORD> words) : base(words) {
            
        }

    }
}