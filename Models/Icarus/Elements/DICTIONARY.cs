using ICARUS.Models.Icarus.Elements;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Dictionary {

    /// <summary>
    /// A collection of words that exist in a Vocabulary
    /// </summary>
    public class DICTIONARY : Container {

        /// <summary>
        /// A collection of Words that exist in this user's vocabulary
        /// </summary>
        public Dictionary<string, int> words { get; set; }
        //public Dictionary<string, WORD> words { get; set; }

        /// <summary>
        /// A collection of words
        /// </summary>
        /// <param name="attributes"></param>
        public DICTIONARY() : base("DIV", new MODEL() {
            label = "DICTIONARY"
        }) {
            //this.words = new Dictionary<string, WORD>();
            this.words = new Dictionary<string, int>();
        }
        
        /// <summary>
        /// Constructs a DICTIONARY with the given id and label attributes already set
        /// </summary>
        /// <param name="formPost"></param>
        public DICTIONARY(FormPost formPost) : base("DICTIONARY", formPost) {
            //this.words = new Dictionary<string, WORD>();
        }
    }
}