using System.ComponentModel.DataAnnotations;

namespace ICARUS.Models.Icarus {

    /// <summary>
    /// An Icarus Form Value Object 
    /// </summary>
    public class FormValue {

        public int id { get; set; }

        [StringLength(128), Required]
        public string name { get; set; }

        [StringLength(128), Required]
        public string type { get; set; }

        [StringLength(128), Required]
        public string value { get; set; }

        /// <summary>
        /// Generic FormValue Constructor
        /// </summary>
        public FormValue() {

        }

        /// <summary>
        /// Construct an Icarus Form Post Object
        /// </summary>
        /// <param name="name"></param>
        /// <param name="value"></param>
        public FormValue(string name, string value) {
            this.name = name;
            this.type = type;
            this.value = value;            
        }

        /// <summary>
        /// Construct an Icarus Form Post Object
        /// </summary>
        /// <param name="name"></param>
        /// <param name="type"></param>
        /// <param name="value"></param>
        public FormValue(string name, string type, string value) {
            this.name = name;
            this.type = type;
            this.value = value;
        }

    }
}