using ICARUS.Models.Icarus.Elements;
using ICARUS.Models.Icarus.Elements.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace ICARUS.Models.Icarus {

    /// <summary>
    /// The APP object in bound to the DOM document.body.  
    /// The APP contains a collection of ARTICLES and a NAVBAR to navigate them
    /// </summary>
    public class Main : Container {

        /// <summary>
        /// The Application navbar is the main interface for ARTICLE(s)
        /// </summary>
        public NAVBAR navBar;

        /// <summary>
        /// The footer that is fixed at the bottom of the Application window
        /// </summary>
        public STICKYFOOTER footer;

        /// <summary>
        /// Parameterless constructor for Entity
        /// </summary>
        public Main() : base("MAIN", new MODEL(new ATTRIBUTES("app"))) {
            this.label = "MAIN";
            this.showHeader = 1;
            //this.collapsed = 0;
            this.hasTab = 0;
            this.hasSidebar = 1;
            this.attributesId = 0;
            this.dataId = 0;

            this.navBar = new NAVBAR(true, true);
            this.footer = new STICKYFOOTER(); //"&copy; " + @DateTime.Now.Year
        }

        /// <summary>
        /// An Application data structure
        /// </summary>
        /// <param name="id"></param>
        /// <param name="version"></param>
        /// <param name="name"></param>
        public Main(FormPost formPost) : base("MAIN", formPost) {
            this.navBar = new NAVBAR(true, true);
            this.footer = new STICKYFOOTER(); //"&copy; " + @DateTime.Now.Year
        }
    }
}