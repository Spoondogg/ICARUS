using ICARUS.Models.Icarus;
using ICARUS.Models.Icarus.Elements;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace ICARUS.Controllers {
    
    public class BannerController : ContainerController {

        public BannerController() : base("Banner") {

        }

        /// <summary>
        /// Instantiate a Container using List defaults
        /// </summary>
        /// <returns></returns>
        public override Container make(FormPost formPost = null) {
            BANNER obj = (formPost == null)
                ? new BANNER()
                : new BANNER(formPost);

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
            BANNER model = (BANNER)ctx.Banners.Single(m =>
                   m.id == id && (m.authorId == User.Identity.Name || m.shared == 1)
                );
            return model;
        }
    }
}