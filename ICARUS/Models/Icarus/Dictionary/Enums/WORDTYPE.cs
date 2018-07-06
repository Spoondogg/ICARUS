using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Enums {

    public class WORDTYPE : Dictionary<String, int> {
        
        public WORDTYPE() {
            this.Add("noun", 1);
            this.Add("verb", 2);
            this.Add("pronoun", 3);
            this.Add("adjective", 4);
            this.Add("adverb", 5);
            this.Add("preposition", 6);
            this.Add("conjunction", 7);
            this.Add("interjection", 8);
        }
    }
}