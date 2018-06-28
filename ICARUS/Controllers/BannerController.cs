using ICARUS.Models.Icarus;
using ICARUS.Models.Icarus.Elements;
using System;
using System.Collections.Generic;
using System.Data.Entity;
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
            //var model // DOES MODEL NEED TO BE EXPLICIT?
            //BANNER model = (BANNER)ctx.Banners.Single(m =>
            var model = ctx.Banners.Single(m =>
                   m.id == id && (m.authorId == User.Identity.Name || m.shared == 1)
                );
            return model;
        }

        /// <summary>
        /// Select a single Main element
        /// </summary>
        /// <param name="ctx"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public override IEnumerable<Container> selectAll(ObjectDBContext ctx) {
            return ctx.Banners.Where(m =>
                (m.authorId == User.Identity.Name || m.shared == 1)
            );
        }

        public override DbSet getDbSet(ObjectDBContext ctx) {
            return ctx.Banners;
        }


    }
}