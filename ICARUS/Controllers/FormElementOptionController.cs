using ICARUS.Models;
using ICARUS.Models.Icarus;
using ICARUS.Models.Icarus.Elements;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace ICARUS.Controllers {

    [Authorize(Roles = "User,Dev,Admin")]
    public class FormElementOptionController : ContainerController {

        public FormElementOptionController() : base("FORMELEMENTOPTION") {

        }        

        public override async Task<ActionResult> Create() {
            // Attempt to create and save to the database
            try {
                // Save the object
                FormElementOption model = new FormElementOption();
                model.setAuthorId(User.Identity.Name);

                getObjectDbContext().FormElementOptions.Add(model);
                int result = getObjectDbContext().SaveChanges();

                // Return the success response along with the email message body
                return Json(
                    new Payload(
                        result, className, model, "Successfully created " + className + "(" + model.id + ")"
                    ),
                JsonRequestBehavior.AllowGet);

            } catch (Exception e) {
                return Json(new Payload(0, "Failed to create " + className + "\n" + e.Message, e), JsonRequestBehavior.AllowGet);
            }
        }

        public override async Task<ActionResult> Create(FormPost formPost) {
            try {
                FormElementOption model = new FormElementOption(formPost);
                model.setAuthorId(User.Identity.Name);

                getObjectDbContext().FormElementOptions.Add(model);
                int results = getObjectDbContext().SaveChanges();

                return Json(new Payload(results, "FORMELEMENTOPTION", model, "Successfully created " + className));

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