using ICARUS.Models;
using ICARUS.Models.Icarus;
using ICARUS.Models.Icarus.Elements;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace ICARUS.Controllers {

    /// <summary>
    /// Handles loading of web forms.  Requires authorization
    /// </summary>
    [Authorize(Roles = "User,Dev,Admin")]
    public class FieldsetController : ContainerController {

        public FieldsetController() : base("FieldSet") {

        }

        /// <summary>
        /// Instantiate a Container using Main defaults
        /// </summary>
        /// <returns></returns>
        public override Container make(FormPost formPost = null) {
            FIELDSET obj = (formPost == null)
                ? new FIELDSET()
                : new FIELDSET(formPost);

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
            FIELDSET model = (FIELDSET)ctx.FieldSets.Single(m =>
                   m.id == id && m.authorId == User.Identity.Name
                );
            return model;
        }
    }    
}