using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus.Elements {
    /// <summary>
    /// An ARTICLE is a top level container for an APP
    /// Treat ARTICLE(s) like tabs in a web browser
    /// </summary>
    public class Container : EL {

        /// <summary>
        /// The DateTime that this element was created
        /// </summary>
        [Required, DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime dateCreated { get; set; }

        /// <summary>
        /// The DateTime that this element was last modified
        /// </summary>
        [Required, DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime dateLastModified { get; set; }

        /// <summary>
        /// Container Label
        /// </summary>
        [StringLength(128, MinimumLength = 3), Required]
        public string label { get; set; }
        
        /// <summary>
        /// If set to true, the element section will be collapsed with
        /// only the header visible
        /// </summary>
        [Required]
        public int collapsed { get; set; } //= 0;

        /// <summary>
        /// If set to true, the header will be shown, otherwise it is hidden
        /// </summary>
        [Required]
        public int showHeader { get; set; } //= 1;

        /// <summary>
        /// If set to true, a tab will be created in the sidebar (document-map)
        /// </summary>
        [Required]
        public int hasTab { get; set; } //= 1;

        /// <summary>
        /// If set to true, a sidebar will be created for this container
        /// </summary>
        [Required]
        public int hasSidebar { get; set; }

        /// <summary>
        /// Articles are made up of a collection of SECTIONS
        /// </summary>
        /// <param name="attributes"></param>
        public Container() : base("DIV", new MODEL()) {

        }

        /// <summary>
        /// An article is the basic building block for nearly all pages.  
        /// Articles are made up of a collection of SECTIONS
        /// </summary>
        /// <param name="element"></param>
        public Container(string element, MODEL model) : base(element, model) {
            this.id = id;
            this.label = model.label; //label + "__X"
            this.subsections = "0";
            this.collapsed = 0;
            this.showHeader = 1;
            this.hasTab = 1;
            this.hasSidebar = 0;
            this.status = 1;
        }

        /// <summary>
        /// Constructs an ARTICLE with the given id and label attributes already set
        /// </summary>
        /// <param name="element"></param>
        /// <param name="formPost"></param>
        public Container(string element, FormPost formPost) : base(
            element, new MODEL()
        ) {
            this.dateCreated = DateTime.Now;
            this.dateLastModified = DateTime.Now;

            this.id = Int32.Parse(formPost.getXml().GetElementsByTagName("id")[0].InnerText);
            this.label = formPost.getXml().GetElementsByTagName("label")[0].InnerText;
            this.subsections = formPost.getXml().GetElementsByTagName("subsections")[0].InnerText;
            this.collapsed = Int32.Parse(formPost.getXml().GetElementsByTagName("collapsed")[0].InnerText);
            this.showHeader = Int32.Parse(formPost.getXml().GetElementsByTagName("showHeader")[0].InnerText);
            this.hasTab = Int32.Parse(formPost.getXml().GetElementsByTagName("hasTab")[0].InnerText);
            this.hasSidebar = Int32.Parse(formPost.getXml().GetElementsByTagName("hasSidebar")[0].InnerText);
        }
    }
}