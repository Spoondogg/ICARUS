using ICARUS.Models.Icarus.Elements;

namespace ICARUS.Models.Icarus.Dictionary {

    /// <summary>
    /// A word used in a Dictionary
    /// https://www.aims.edu/student/online-writing-lab/grammar/index.php
    /// https://www.aims.edu/student/online-writing-lab/grammar/parts-of-speech.php
    /// </summary>
    public class WORD : Container {

        /// <summary>
        /// A word used in a Dictionary
        /// </summary>
        /// <param name="attributes"></param>
        public WORD() : base("DIV", new MODEL() {
            label = "WORD"
        }) {

        }

        /// <summary>
        /// Constructs an WORD with the given id and label attributes already set
        /// </summary>
        /// <param name="formPost"></param>
        public WORD(FormPost formPost) : base("DIV", formPost) {

        }

        /*
        /// <summary>
        /// Unique id for this post
        /// </summary>
        [Range(0, int.MaxValue)]
        public int id { get; set; }

        /// <summary>
        /// Indicates if the object is active/inactive on the database, 
        /// or any other states that might be needed
        /// </summary>
        [Required]
        public int status { get; set; }

        [Required, Range(0, int.MaxValue)]
        public int typeId { get; set; } // WORDTYPE["noun"]

        [Required, Range(0, int.MaxValue)]
        public int syllableCount { get; set; }

        [StringLength(128), Required]
        public String value { get; set; }

        [Required]
        public String definition { get; set; }

        [Required, Column(TypeName = "xml")]
        public string xmlResults { get; set; }

        public WORD(String value, int typeId = 1, String definition = "") {
            this.status = 1;
            this.typeId = typeId;
            this.value = value;
            this.syllableCount = 1;
            this.definition = definition;
            this.xmlResults = "<root><word>"+value+"</word></root>";
        }
        */

    }
}