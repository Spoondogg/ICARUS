using ICARUS.Models.Icarus.Elements;
using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.Core.Objects.DataClasses;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus {

    /// <summary>
    /// A collection of html elements that are supported
    /// </summary>
    public enum ELEMENTS {
        DIV, A, UL, LI, SPAN, FORM, INPUT, SELECT, TEXTAREA, TABLE, THEAD, TBODY, TFOOT, TR, TD, HEADER, FOOTER, ARTICLE, SECTION, BUTTON, NAV
    }

    /// <summary>
    /// A generic html element
    /// </summary>
    public class EL : MODEL {

        /// <summary>
        /// The name of this class that this object is based on
        /// </summary>
        [StringLength(64), Required]
        public string className;

        /// <summary>
        /// The html element that this object is based on
        /// </summary>
        [StringLength(64), Required]
        public string element { get; set; }

        /// <summary>
        /// Author unique identifier, generally an email
        /// </summary>
        [StringLength(128, MinimumLength = 3), Required]
        public string authorId { get; set; }

        /// <summary>
        /// Indicates if the object is active/inactive on the database, 
        /// or any other states that might be needed
        /// </summary>
        [Required]
        public int status { get; set; }

        /// <summary>
        /// Indicates if the object is active/inactive on the database, 
        /// or any other states that might be needed
        /// </summary>
        [Required]
        public int shared { get; set; }

        /// <summary>
        /// An HTML string that will be added to this node/element
        /// </summary>
        private string innerHtml { get; set; }

        /// <summary>
        /// A list of elements that are children of this element
        /// </summary>
        public List<Object> children { get; set; }

        /// <summary>
        /// A comma delimited list of child subsection ids (ie: 1,2,3)
        /// </summary>
        [Required]
        public string subsections { get; set; }

        /// <summary>
        /// A related form post for generic data key/values
        /// </summary>
        [Required]
        public int dataId { get; set; }

        /// <summary>
        /// A related form post for element attributes, extensible data etc
        /// </summary>
        [Required]
        public int attributesId { get; set; }

        /// <summary>
        /// A related form post containing a meta data (description, tags etc) for this Element
        /// </summary>
        [Required]
        public int metaId { get; set; }

        /// <summary>
        /// Constructs a generic element
        /// </summary>
        /// <param name="element">HTML Element</param>
        /// <param name="model">Object Model</param>
        /// <param name="innerHtml">Optional HTML string to display within this element</param>
        public EL(string element, MODEL model, string innerHtml = "") : base (model.attributes) {
            this.className = this.GetType().Name;
            this.element = element;
            this.innerHtml = innerHtml;
            this.children = new List<Object>();
            this.status = 1;
            this.shared = 0;
        }

        /// <summary>
        /// Adds a child element to this object
        /// </summary>
        /// <param name="child">Pushes an EL into this ELEMENT's children array</param>
        public virtual void addChild(object child) {
            this.children.Add(child);
        }

        /// <summary>
        /// Returns the inner HTML for this element
        /// </summary>
        /// <returns>An HTML string</returns>
        public string getInnerHtml() {
            return this.innerHtml;
        }

        /// <summary>
        /// Returns the Author Id of this Element
        /// </summary>
        /// <returns>Author Identifier</returns>
        public string getAuthorId() {
            return this.authorId;
        }

        /// <summary>
        /// Sets the author Id for this Element
        /// </summary>
        /// <param name="id"></param>
        public void setAuthorId(string id) {
            // TODO: Validate authorId before setting
            this.authorId = id;
        }
    }    
}