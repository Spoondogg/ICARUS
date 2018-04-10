using ICARUS.Models;
using ICARUS.Models.Icarus;
using ICARUS.Models.Icarus.Elements;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace ICARUS.Controllers {

    /// <summary>
    /// Handles loading of web forms.  Requires authorization
    /// </summary>
    [Authorize(Roles = "User,Dev,Admin")]
    public class FieldsetController : ContainerController {

        public FieldsetController() : base("FieldSet") {

        }

        public override async Task<ActionResult> Create() {
            // Attempt to create and save to the database
            try {
                
                FieldSet model = new FieldSet();
                model.setAuthorId(User.Identity.Name);

                // Save the object
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
            FieldSet model = null;
            try {
                model = new FieldSet(formPost);
                getObjectDbContext().Containers.Add(model);
                getObjectDbContext().SaveChanges();
                return Json(model);
            } catch (Exception e) {
                return Json(new Payload(
                    0,
                    "Unable to create new instance of " + this.className + "()\n" + e.ToString() + "\n\n" + e.Message.ToString(),
                    e
                ), JsonRequestBehavior.AllowGet);
            }
        }
    }    
}