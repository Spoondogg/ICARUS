using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using ICARUS.Models;
using ICARUS.Models.Icarus;
using ICARUS.Models.Icarus.Elements;
namespace ICARUS.Controllers {
    /// <summary>
    /// Handles loading of web forms.  Requires authorization
    /// </summary>
    public class FormTextAreaController : ContainerController {
        public FormTextAreaController() : base("FORMTEXTAREA") {

        }
        /// <summary>
        /// Instantiate a FORMINPUT using defaults
        /// </summary>
        /// <returns></returns>
        public override Container make(FormPost formPost = null) {
            var obj = (formPost == null)
                ? new FORMTEXTAREA()
                : new FORMTEXTAREA(formPost);

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
            return ctx.FormTextAreas.AsQueryable().Single(FilterById(id));
        }
        /// <summary>
        /// Select a single element
        /// </summary>
        /// <param name="ctx"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        public override IEnumerable<Container> selectAll(ObjectDBContext ctx) {
            return ctx.FormTextAreas.Where(FilterAllowed());
        }
    }    
}