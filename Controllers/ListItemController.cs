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
    
    public class ListItemController : ContainerController {

        public ListItemController() : base("ListItem") {

        }

        /// <summary>
        /// Instantiate a Container using Section defaults
        /// </summary>
        /// <returns></returns>
        public override Container make(FormPost formPost = null) {
            var obj = (formPost == null)
                ? new ListItem()
                : new ListItem(formPost);

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
            return ctx.ListItems.AsQueryable().Single(FilterById(id));
        }
        
        /// <summary>
        /// Select a single Main element
        /// </summary>
        /// <param name="ctx"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public override IEnumerable<Container> selectAll(ObjectDBContext ctx) {
            return ctx.ListItems.Where(FilterAllowed());
        }
    }
}