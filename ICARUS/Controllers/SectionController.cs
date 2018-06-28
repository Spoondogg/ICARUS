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

        public SectionController() : base("Section") {

        }

        /// <summary>
        /// Instantiate a Container using Section defaults
        /// </summary>
        /// <returns></returns>
        public override Container make(FormPost formPost = null) {
            Section obj = (formPost == null)
                ? new Section()
                : new Section(formPost);

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
            Section model = (Section)ctx.Sections.Single(m =>
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
            return ctx.Sections.Where(m =>
                (m.authorId == User.Identity.Name || m.shared == 1)
            );
        }

        public override DbSet getDbSet(ObjectDBContext ctx) {
            return ctx.Sections;
        }

    }
}