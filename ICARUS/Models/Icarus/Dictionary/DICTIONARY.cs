using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Dictionary {

    /// <summary>
    /// A collection of words that exist in a Vocabulary
    /// </summary>
    public class DICTIONARY : Dictionary<string, WORD> {
        
        /// <summary>
        /// Identifier
        /// </summary>
        public String label;

        /// <summary>
        /// A description
        /// </summary>
        public String description;

        /// <summary>
        /// Collect words into a sentence
        /// </summary>
        /// <param name="words"></param>
        public DICTIONARY(Dictionary<string, WORD> words) : base(words) {
            
        }
    }
}