using ICARUS.Models;
using ICARUS.Models.Icarus;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Web.Mvc;
using System.Threading;
using System.Text;
using System.Xml;
using ICARUS.Models.Icarus.Elements;

namespace ICARUS.Controllers {

    /// <summary>
    /// Handles loading of web forms.  Requires authorization
    /// </summary>
    // [Authorize]
    public class IFrameController : ContainerController {

        public IFrameController() : base("IFrame") {

        }

        /// <summary>
        /// Instantiate a Container using Article defaults
        /// </summary>
        /// <returns></returns>
        [Authorize]
        public override Container make(FormPost formPost = null) {
            IFRAME obj = (formPost == null)
                ? new IFRAME()
                : new IFRAME(formPost);

            obj.setAuthorId(User.Identity.Name);
            return obj;
        }

        /// <summary>
        /// Select a single Main element
        /// </summary>
        /// <param name="ctx"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        [Authorize]
        public override Container select(ObjectDBContext ctx, int id) {
            IFRAME model = (IFRAME)ctx.IFrames.Single(m =>
                   m.id == id && m.authorId == User.Identity.Name
                );
            return model;
        }
    }
}