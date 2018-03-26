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
    [Authorize(Roles = "User,Dev,Admin")]
    public class FieldsetController : ContainerController {

        public FieldsetController() : base("FIELDSET") {

        }

        /// <summary>
        /// GET: FormElement
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [Authorize(Roles = "Dev,Admin")]
        public ActionResult Index(int id = 0) {
            var groups = from s in getObjectDbContext().FieldSets
                         where (s.id == id || id == 0) && s.getAuthorId() == User.Identity.Name
                         orderby s.label
                         select s;
            return View(groups);
        }

        public override async Task<ActionResult> Create() {
            // Attempt to create and save to the database
            try {
                // Save the object
                FieldSet model = new FieldSet();
                model.setAuthorId(User.Identity.Name);

                getObjectDbContext().FieldSets.Add(model);
                int result = getObjectDbContext().SaveChanges();

                // Return the success response along with the email message body
                return Json(
                    new Payload(
                        result, className, model, "Successfully created "+className+"(" + model.id + ")"
                    ), 
                JsonRequestBehavior.AllowGet);

            } catch (Exception e) {
                return Json(new Payload(0, "Failed to create " + className + "\n" + e.Message, e), JsonRequestBehavior.AllowGet);
            }
        }

        public override async Task<ActionResult> Create(FormPost formPost) {            
            try {
                FieldSet model = new FieldSet(formPost);
                model.setAuthorId(User.Identity.Name);

                getObjectDbContext().FieldSets.Add(model);
                int results = getObjectDbContext().SaveChanges();

                return Json(new Payload(results, "FIELDSET", model, "Successfully created " + className));

            } catch (Exception e) {
                return Json(
                    new Payload(
                        0,
                        "Unable to create new instance of " + this.className + "\n"
                        + e.ToString() + "\n\n" + e.Message.ToString(),
                        e
                    ),
                JsonRequestBehavior.AllowGet);
            }
        }

    }    
}