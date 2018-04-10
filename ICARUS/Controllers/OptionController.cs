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
    public class OptionController : ContainerController {

        public OptionController() : base("Option") {

        }        

        public override async Task<ActionResult> Create() {
            // Attempt to create and save to the database
            try {
                // Save the object
                Option model = new Option();
                model.setAuthorId(User.Identity.Name);

                getObjectDbContext().Options.Add(model);
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
            Option model = null;
            try {
                model = new Option(formPost);
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