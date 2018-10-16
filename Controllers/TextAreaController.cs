using ICARUS.Models;
using ICARUS.Models.Icarus;
using ICARUS.Models.Icarus.Elements;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data.Entity;
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
    public class TextAreaController : ContainerController {

        public TextAreaController() : base("TextArea") {

        }

        /// <summary>
        /// Instantiate a Container using TextArea defaults
        /// </summary>
        /// <returns></returns>
        public override Container make(FormPost formPost = null) {
            var obj = (formPost == null)
                ? new TextArea()
                : new TextArea(formPost);

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
            return ctx.TextAreas.AsQueryable().Single(FilterById(id));
        }

        /// <summary>
        /// Select a single element
        /// </summary>
        /// <param name="ctx"></param>
        /// <returns></returns>
        public override IEnumerable<Container> selectAll(ObjectDBContext ctx) {
            return ctx.TextAreas.Where(FilterAllowed());
        }
    }
}