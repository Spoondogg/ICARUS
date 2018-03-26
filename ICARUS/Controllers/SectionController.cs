using ICARUS.Models.Icarus;
using ICARUS.Models.Icarus.Elements;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace ICARUS.Controllers {
    
    public class SectionController : ContainerController {

        public SectionController() : base("Section") {

        }
        
        public override async Task<ActionResult> Create() {
            // Attempt to create and save to the database
            try {

                Section model = new Section();
                model.setAuthorId(User.Identity.Name);

                // Save the object
                getObjectDbContext().Sections.Add(model);
                int result = getObjectDbContext().SaveChanges();

                // Return the payload
                return Json(new Payload(
                    1, className, model,
                    "Successfully instantiated " + this.className + "(" + model.id + ")"
                ), JsonRequestBehavior.AllowGet);

            } catch (Exception e) {

                // Return the formPost for debugging
                return Json(new Payload(0, "Failed to create " + className + "\n" + e.Message, e), JsonRequestBehavior.AllowGet);
            }
        }

        public override async Task<ActionResult> Create(FormPost formPost) {
            Section model = null;
            try {
                model = new Section(formPost);
                getObjectDbContext().Containers.Add(model);
                getObjectDbContext().SaveChanges();
                return Json(model);
            } catch (Exception e) {
                return Json(new Payload(
                    0,
                    "Unable to create new instance of "+this.className+"()\n" + e.ToString() + "\n\n" + e.Message.ToString(),
                    e
                ), JsonRequestBehavior.AllowGet);
            }
        }
    }
}