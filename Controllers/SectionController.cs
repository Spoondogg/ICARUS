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
    
    public class SectionController : ContainerController {

        public SectionController() : base("SECTION") {

        }

        /// <summary>
        /// Instantiate a Container using Section defaults
        /// </summary>
        /// <returns></returns>
        public override Container make(FormPost formPost = null) {
            var obj = (formPost == null)
                ? new SECTION()
                : new SECTION(formPost);

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
            return ctx.Sections.AsQueryable().Single(FilterById(id));
        }

        /// <summary>
        /// Select all elements
        /// </summary>
        /// <param name="ctx"></param>
        /// <returns></returns>
        public override IEnumerable<Container> selectAll(ObjectDBContext ctx) {
            return ctx.Sections.Where(FilterAllowed());
        }
    }
}