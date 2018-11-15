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
using System.Data.Entity;
using System.Data.Entity.Validation;
using System.Data.Entity.Infrastructure;
namespace ICARUS.Controllers {
    /// <summary>
    /// Handles loading of web forms.  Requires authorization
    /// </summary>
    public class FormController : ContainerController {
        public FormController() : base("Form") {
        }
        /// <summary>
        /// Instantiate a Container using Main defaults
        /// </summary>
        /// <returns></returns>
        public override Container make(FormPost formPost = null) {
            var obj = (formPost == null)
                ? new FORM()
                : new FORM(formPost);

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
            return ctx.Forms.AsQueryable().Single(FilterById(id));
        }
        /// <summary>
        /// Select a single element
        /// </summary>
        /// <param name="ctx"></param>
        /// <returns></returns>
        public override IEnumerable<Container> selectAll(ObjectDBContext ctx) {
            return ctx.Forms.Where(FilterAllowed());
        }
        /// <summary>
        /// POST's the IcarusForm FORMPOST results to the server using the FormPostController.Create() method
        /// </summary>
        /// <param name="formPost">POSTed values</param>
        /// <returns></returns>
        [HttpPost]
        public async Task<ActionResult> Submit(FormPost formPost) {
            try { // @see https://stackoverflow.com/a/32098348/722785
                var ct = DependencyResolver.Current.GetService<FormPostController>();
                ct.ControllerContext = new ControllerContext(this.Request.RequestContext, ct);
                return await ct.Create(formPost);
            } catch (Exception e) {
                return Json(new Payload(0, e,
                    "FormController.Submit(): Unable to create FormPost\n" + e.ToString() + "\n\n" +
                        e.Message.ToString())); //, JsonRequestBehavior.AllowGet
            }
        }
    }
}