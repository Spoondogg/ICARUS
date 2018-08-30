﻿using ICARUS.Models.Icarus.Elements.Attributes;
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
        //[Required, DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        [Required]
        public DateTime dateCreated { get; set; }

        /// <summary>
        /// The DateTime that this element was last modified
        /// </summary>
        //[Required, DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        [Required]
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
        //[Required]
        //public int collapsed { get; set; } //= 0;

        /// <summary>
        /// If set to true, the header will be shown, otherwise it is hidden
        /// </summary>
        //[Required]
        //public int showHeader { get; set; } //= 1;

        /// <summary>
        /// If set to true, a tab will be created in the sidebar (document-map)
        /// </summary>
        //[Required]
        //public int hasTab { get; set; } //= 1;

        /// <summary>
        /// If set to true, a sidebar will be created for this container
        /// </summary>
        //[Required]
        //public int hasSidebar { get; set; }

        /// <summary>
        /// Construct Container as a DIV
        /// </summary>
        /// <param name="attributes"></param>
        public Container() : base("DIV", new MODEL() {
            label = "CONTAINER"
        }) {
            this.dateCreated = DateTime.UtcNow;
            this.dateLastModified = DateTime.UtcNow;
        }

        /// <summary>
        /// A generic Container 
        /// Articles are made up of a collection of SECTIONS
        /// </summary>
        /// <param name="element"></param>
        public Container(string element, MODEL model) : base(element, model) {
            this.id = id;
            this.label = model.label;
            this.subsections = "0";
            //this.collapsed = 0; // TODO: This should be migrated out of here and into attributes
            //this.showHeader = 1; // TODO: This should be migrated out of here and into attributes
            //this.hasTab = 1; // TODO: This should be migrated out of here and into attributes
            //this.hasSidebar = 0; // TODO: This should be migrated out of here and into attributes
            this.status = 1;
            this.attributesId = 0;
            this.dataId = 0;
            this.descriptionId = 0;
            this.shared = 0;
            this.dateCreated = DateTime.UtcNow;
            this.dateLastModified = DateTime.UtcNow;
        }

        /// <summary>
        /// Constructs an ARTICLE with the given id and label attributes already set
        /// </summary>
        /// <param name="element"></param>
        /// <param name="formPost"></param>
        public Container(string element, FormPost formPost) : base(
            element, new MODEL()
        ) {
            this.dateCreated = DateTime.UtcNow;
            this.dateLastModified = DateTime.UtcNow;
            this.updateContainerModel(formPost);
        }

        /// <summary>
        /// Sets Container Model values based on the given FormPost
        /// </summary>
        /// <param name="formPost"></param>
        public void updateContainerModel(FormPost formPost) {
            formPost.resultsToXml();
            this.subsections = formPost.parseString("subsections", "0");
            this.label = formPost.parseString("label");
            this.id = formPost.parseInt("id", -1);
            //this.hasTab = formPost.parseInt("hasTab", 1);
            //this.hasSidebar = formPost.parseInt("hasSidebar");
            //this.showHeader = formPost.parseInt("showHeader", 1);
            //this.collapsed = formPost.parseInt("collapsed");
            this.attributesId = formPost.parseInt("attributesId");
            this.dataId = formPost.parseInt("dataId");
            this.descriptionId = formPost.parseInt("descriptionId");
            this.shared = formPost.parseInt("shared");
            this.dateLastModified = DateTime.UtcNow;
        }
    }
}