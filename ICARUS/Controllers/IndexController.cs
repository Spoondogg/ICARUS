﻿using ICARUS.Models.Icarus;
using ICARUS.Models.Icarus.Elements;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace ICARUS.Controllers {
    
    public class IndexController : ContainerController {

        public IndexController() : base("Index") {

        }

        /// <summary>
        /// Instantiate a Container using List defaults
        /// </summary>
        /// <returns></returns>
        public override Container make(FormPost formPost = null) {
            var obj = (formPost == null)
                ? new INDEX()
                : new INDEX(formPost);

            obj.setAuthorId(User.Identity.Name);

            return obj;
        }

        /// <summary>
        /// Select a single element
        /// </summary>
        /// <param name="ctx"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public override Container select(ObjectDBContext ctx, int id) {
            return ctx.Indexes.AsQueryable().Single(FilterById(id));
        }

        /// <summary>
        /// Select a single element
        /// </summary>
        /// <param name="ctx"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public override IEnumerable<Container> selectAll(ObjectDBContext ctx) {
            return ctx.Indexes.Where(FilterAllowed());
        }
    }
}