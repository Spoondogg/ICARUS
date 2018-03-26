using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Web.Mvc;

namespace ICARUS.Models {

    public class Procedure {

        public int id { get; set; }

        /// <summary>
        /// User ID of Author
        /// </summary>
        [StringLength(128, MinimumLength = 3), Required]
        public string authorId { get; set; }

        /// <summary>
        /// The label represents what is shown in views
        /// </summary>
        [StringLength(128, MinimumLength = 3), Required]
        public string label { get; set; }

        /// <summary>
        /// Enumerated list of Procedure types
        /// </summary>
        [NotMapped]
        public IEnumerable<SelectListItem> types = new ProcedureTypeList();

        /// <summary>
        /// The procedure type determines how it is represented in its View
        /// </summary>
        [Range(0, int.MaxValue)]
        public int typeId { get; set; }

        /// <summary>
        /// Describe the intent of the procedure
        /// </summary>
        [StringLength(512)]
        public string description { get; set; }

        /// <summary>
        /// The name of the procedure as it appears in the database
        /// </summary>
        [StringLength(128, MinimumLength = 3), Required]
        public string name { get; set; }

        /// <summary>
        /// A comma delimited string of column names returned by this procedure
        /// </summary>
        [StringLength(512, MinimumLength = 1), Required]
        public string columns { get; set; }

        /// <summary>
        /// Delimited list of parameter Ids from dbo.Params
        /// </summary>
        [StringLength(512, MinimumLength = 1), Required]
        public string parameters { get; set; }

        /// <summary>
        /// Constructs a default procedure, using the TABLE type
        /// </summary>
        public Procedure() {
            this.typeId = 1;
        }

        /// <summary>
        /// Construct a Procedure of the given type
        /// </summary>
        /// <param name="typeId"></param>
        public Procedure(int typeId) {
            this.typeId = typeId;
        }

    }
    
}