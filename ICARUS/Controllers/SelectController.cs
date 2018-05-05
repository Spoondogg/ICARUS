using ICARUS.Models;
using ICARUS.Models.Icarus;
using ICARUS.Models.Icarus.Elements;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity.Validation;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace ICARUS.Controllers {
       
    /// <summary>
    /// Controller for Form Elements, performs basic CRUD actions as well as
    /// various pages
    /// </summary>
    public class SelectController : ContainerController {

        public SelectController() : base("Select") {

        }

        /// <summary>
        /// Instantiate a Container using Select defaults
        /// </summary>
        /// <returns></returns>
        public override Container make(FormPost formPost = null) {
            Select obj = (formPost == null)
                ? new Select()
                : new Select(formPost);

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
            Select model = (Select)ctx.Selects.Single(m =>
                   m.id == id && (m.authorId == User.Identity.Name || m.shared == 1)
                );
            return model;
        }
    }
}