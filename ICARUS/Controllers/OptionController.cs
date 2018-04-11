using ICARUS.Models;
using ICARUS.Models.Icarus;
using ICARUS.Models.Icarus.Elements;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace ICARUS.Controllers {

    [Authorize(Roles = "User,Dev,Admin")]
    public class OptionController : ContainerController {

        public OptionController() : base("Option") {

        }

        /// <summary>
        /// Instantiate a Container using Main defaults
        /// </summary>
        /// <returns></returns>
        public override Container make(FormPost formPost = null) {
            Option obj = (formPost == null)
                ? new Option()
                : new Option(formPost);

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
            Option model = (Option)ctx.Options.Single(m =>
                   m.id == id && m.authorId == User.Identity.Name
                );
            return model;
        }
    }
}