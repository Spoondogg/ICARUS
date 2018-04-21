﻿using ICARUS.Models.Icarus;
using ICARUS.Models.Icarus.Elements;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace ICARUS.Controllers {
    
    public class TextBlockController : ContainerController {

        public TextBlockController() : base("TextBlock") {

        }

        /// <summary>
        /// Instantiate a Container using List defaults
        /// </summary>
        /// <returns></returns>
        public override Container make(FormPost formPost = null) {
            TEXTBLOCK obj = (formPost == null)
                ? new TEXTBLOCK()
                : new TEXTBLOCK(formPost);

            obj.setAuthorId(User.Identity.Name);
            return obj;
        }

        /// <summary>
        /// Select a single Main element
        /// </summary>
        /// <param name="ctx"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public override Container select(ObjectDBContext ctx, int id) {
            TEXTBLOCK model = (TEXTBLOCK)ctx.TextBlocks.Single(m =>
                   m.id == id && m.authorId == User.Identity.Name
                );
            return model;
        }
    }
}